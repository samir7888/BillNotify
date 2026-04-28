import * as cheerio from 'cheerio'

export interface NEACheckParams {
  neaLocationCode: string
  scNo: string
  consumerId: string
}

export interface NEABillResult {
  success: boolean
  customerName?: string
  scNo?: string
  consumerId?: string
  status?: string
  payableAmount?: number
  dueBillOf?: string
  neaLocation?: string
  rawStatus?: string
  error?: string
}

const NEA_URL = 'https://www.neabilling.com/viewonline/viewonlineresult/'

function getTodayFormatted(): string {
  const today = new Date()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  const year = today.getFullYear()
  return `${month}/${day}/${year}`
}

export async function checkNEABill(params: NEACheckParams): Promise<NEABillResult> {
  const today = getTodayFormatted()

  const formData = new URLSearchParams({
    NEA_location: params.neaLocationCode,
    sc_no: params.scNo,
    consumer_id: params.consumerId,
    Fromdatepicker: today,
    Todatepicker: today,
  })

  try {
    const response = await fetch(NEA_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'text/html,application/xhtml+xml',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://www.neabilling.com/viewonline/',
      },
      body: formData.toString(),
      signal: AbortSignal.timeout(15000),
    })

    if (!response.ok) {
      return {
        success: false,
        error: `NEA server returned ${response.status}`,
      }
    }

    const html = await response.text()
    return parseNEAHtml(html)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return {
      success: false,
      error: `Failed to reach NEA server: ${message}`,
    }
  }
}

export function parseNEAHtml(html: string): NEABillResult {
  const $ = cheerio.load(html)

  const clean = (value?: string) =>
    (value || '').replace(/\s+/g, ' ').trim()

  const toNumber = (value?: string) => {
    const num = parseFloat((value || '').replace(/[^0-9.-]/g, ''))
    return isNaN(num) ? 0 : num
  }

  const bodyText = clean($('body').text()).toLowerCase()

  // invalid / empty response checks
  if (
    bodyText.includes('no data') ||
    bodyText.includes('not found') ||
    bodyText.includes('invalid') ||
    bodyText.includes('please check')
  ) {
    return {
      success: false,
      error:
        'No bill data found. Please check the location code, SC No, and Consumer ID.',
    }
  }

  const result: NEABillResult = {
    success: true,
  }

  // -----------------------------------
  // Consumer Details
  // -----------------------------------
  $('td').each((_, el) => {
    const text = clean($(el).text()).toLowerCase()

    if (text === 'customer name') {
      result.customerName = clean($(el).next('td').text())
    }

    if (text === 'sc no') {
      result.scNo = clean($(el).next('td').text())
    }

    if (text === 'nea location') {
      result.neaLocation = clean($(el).next('td').text())
    }

    if (text === 'consumer id') {
      result.consumerId = clean($(el).next('td').text())
    }
  })

  // -----------------------------------
  // Bill Rows
  // -----------------------------------
  const billRows: {
    status: string
    dueBillOf: string
    payableAmount: number
    billAmt: number
  }[] = []

  $('tr').each((_, row) => {
    const cells = $(row).find('td')

    // Actual bill rows have 13 columns
    if (cells.length === 13) {
      const sno = clean($(cells[0]).text())
      const status = clean($(cells[1]).text())
      const dueBillOf = clean($(cells[2]).text())
      const billAmt = toNumber($(cells[5]).text())
      const payableAmount = toNumber($(cells[8]).text())

      // Skip TOTAL row
      if (!sno) return

      billRows.push({
        status,
        dueBillOf,
        payableAmount,
        billAmt,
      })
    }
  })

  // -----------------------------------
  // Total Row
  // -----------------------------------
  let totalPayable = 0

  $('tr').each((_, row) => {
    const rowText = clean($(row).text()).toUpperCase()

    if (rowText.includes('TOTAL')) {
      const cells = $(row).find('td')

      if (cells.length >= 9) {
        totalPayable = toNumber($(cells[8]).text())
      }
    }
  })

  // -----------------------------------
  // Final Mapping
  // -----------------------------------
  if (billRows.length > 0) {
    const first = billRows[0]

    result.rawStatus = first.status
    result.status = first.status
    result.dueBillOf = first.dueBillOf
  }

  result.payableAmount = totalPayable

  // If total row not found, fallback highest payable row
  if (!result.payableAmount && billRows.length > 0) {
    result.payableAmount = Math.max(
      ...billRows.map((row) => row.payableAmount)
    )
  }

  // -----------------------------------
  // Business Logic
  // -----------------------------------
  if ((result.payableAmount ?? 0) > 0) {
    result.status = 'READY_TO_PAY'
  } else if (!result.status) {
    result.status = 'NO_DUE'
  }

  // -----------------------------------
  // Final Validation
  // -----------------------------------
  if (
    !result.customerName &&
    !result.consumerId &&
    result.payableAmount === undefined
  ) {
    return {
      success: false,
      error:
        'Could not parse bill data from NEA response. The page format may have changed.',
    }
  }

  return result
}
