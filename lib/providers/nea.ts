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
  // NEA expects MM/DD/YYYY. Use Nepal time so the date is right even when the
  // server (e.g. Vercel) runs in UTC.
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kathmandu',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date())
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? ''
  return `${get('month')}/${get('day')}/${get('year')}`
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

interface BillRow {
  status: string
  dueBillOf: string
  payableAmount: number
}

const NO_DATA_MARKERS = ['no data', 'not found', 'invalid', 'please check']

const clean = (value?: string) => (value || '').replace(/\s+/g, ' ').trim()

const toNumber = (value?: string) => {
  const num = parseFloat((value || '').replace(/[^0-9.-]/g, ''))
  return isNaN(num) ? 0 : num
}

// "Customer Name :" -> "customer name"
const normalizeLabel = (value?: string) =>
  clean(value).replace(/[:：]\s*$/, '').trim().toLowerCase()

/**
 * Expand a row's cells into a column-position array so that colspan'd cells
 * (e.g. the "TOTAL" label) don't shift later columns.
 */
function expandRow(
  $: cheerio.CheerioAPI,
  row: ReturnType<cheerio.CheerioAPI>,
) {
  const cols: string[] = []
  row.children('td,th').each((_, cell) => {
    const span = Math.max(parseInt($(cell).attr('colspan') || '1', 10) || 1, 1)
    const text = clean($(cell).text())
    for (let i = 0; i < span; i++) cols.push(i === 0 ? text : '')
  })
  return cols
}

export function parseNEAHtml(html: string): NEABillResult {
  const $ = cheerio.load(html)

  // Script/style contents are part of body.text() and often contain words like
  // "invalid"; they must never be treated as page content.
  $('script, style, noscript, template').remove()

  const bodyText = clean($('body').text()).toLowerCase()

  const result: NEABillResult = { success: true }

  // -----------------------------------
  // Consumer details (label cell -> next cell)
  // -----------------------------------
  $('td, th').each((_, el) => {
    const label = normalizeLabel($(el).text())
    if (!label || label.length > 30) return
    const value = clean($(el).next('td').text())
    if (!value) return

    if (label === 'customer name' && !result.customerName) result.customerName = value
    else if ((label === 'sc no' || label === 'sc no.') && !result.scNo) result.scNo = value
    else if (label === 'nea location' && !result.neaLocation) result.neaLocation = value
    else if (label === 'consumer id' && !result.consumerId) result.consumerId = value
  })

  // -----------------------------------
  // Bill table. Only look at innermost rows so nested tables are not double
  // counted, and map columns by header text with a positional fallback.
  // -----------------------------------
  const rows = $('tr')
    .filter((_, tr) => $(tr).find('tr').length === 0)
    .toArray()

  let statusIdx = 1
  let dueBillIdx = 2
  let payableIdx = 8
  let headerSeen = false

  const billRows: BillRow[] = []
  let totalPayable = 0
  let totalFound = false

  for (const tr of rows) {
    const row = $(tr)
    const cols = expandRow($, row)
    if (cols.length < 3) continue

    const lower = cols.map((c) => c.toLowerCase())

    // Header row: contains a "payable" column and a "status" column
    const pIdx = lower.findIndex((c) => c.includes('payable'))
    const sIdx = lower.findIndex((c) => c === 'status' || c.includes('bill status'))
    if (!headerSeen && pIdx !== -1 && sIdx !== -1 && !/\d/.test(cols[pIdx])) {
      headerSeen = true
      payableIdx = pIdx
      statusIdx = sIdx
      const dIdx = lower.findIndex((c) => c.includes('due bill') || c.includes('bill of'))
      if (dIdx !== -1) dueBillIdx = dIdx
      continue
    }

    // TOTAL row: first non-empty cell is "TOTAL"
    const firstText = cols.find((c) => c)?.toUpperCase() ?? ''
    if (firstText === 'TOTAL' || firstText.startsWith('TOTAL ')) {
      totalFound = true
      totalPayable = toNumber(cols[payableIdx])
      continue
    }

    // Data row: first column is a serial number, and enough columns exist
    if (cols.length > payableIdx && /^\d+$/.test(cols[0])) {
      billRows.push({
        status: cols[statusIdx] ?? '',
        dueBillOf: cols[dueBillIdx] ?? '',
        payableAmount: toNumber(cols[payableIdx]),
      })
    }
  }

  // -----------------------------------
  // Nothing parsed: figure out why
  // -----------------------------------
  const parsedSomething =
    !!result.customerName ||
    !!result.consumerId ||
    !!result.scNo ||
    billRows.length > 0 ||
    totalFound

  if (!parsedSomething) {
    if (NO_DATA_MARKERS.some((m) => bodyText.includes(m))) {
      return {
        success: false,
        error:
          'No bill data found. Please check the location code, SC No, and Consumer ID.',
      }
    }
    return {
      success: false,
      error:
        'Could not parse bill data from NEA response. The page format may have changed.',
    }
  }

  // -----------------------------------
  // Final mapping
  // -----------------------------------
  if (billRows.length > 0) {
    const first = billRows[0]
    result.rawStatus = first.status
    result.status = first.status
    result.dueBillOf = first.dueBillOf
  }

  result.payableAmount = totalFound
    ? totalPayable
    : billRows.reduce((sum, r) => sum + r.payableAmount, 0)

  // Total row present but empty/zero: fall back to summing rows
  if (!result.payableAmount && billRows.length > 0) {
    result.payableAmount = billRows.reduce((sum, r) => sum + r.payableAmount, 0)
  }

  if ((result.payableAmount ?? 0) > 0) {
    result.status = 'READY_TO_PAY'
  } else if (!result.status) {
    result.status = 'NO_DUE'
  }

  return result
}
