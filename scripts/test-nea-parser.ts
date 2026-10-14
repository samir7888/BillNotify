/* Run with: pnpm dlx tsx scripts/test-nea-parser.ts  (or: npx tsx ...) */
import assert from 'node:assert/strict'
import { parseNEAHtml } from '../lib/providers/nea'

const header = `<tr><th>S.No</th><th>Status</th><th>Due Bill Of</th><th>Bill Date</th><th>Days</th><th>Bill Amt</th><th>Rebate</th><th>Fine</th><th>Payable Amt</th><th>a</th><th>b</th><th>c</th><th>d</th></tr>`
const row = (sno: string, status: string, month: string, bill: string, pay: string) =>
  `<tr><td>${sno}</td><td>${status}</td><td>${month}</td><td>d</td><td>30</td><td>${bill}</td><td>0</td><td>0</td><td>${pay}</td><td>-</td><td>-</td><td>-</td><td>-</td></tr>`
const details = (colon = '') => `
  <table><tr><td>Customer Name${colon}</td><td>RAM BAHADUR</td></tr>
  <tr><td>SC No${colon}</td><td>001.01.123A</td></tr>
  <tr><td>NEA Location${colon}</td><td>BUTWAL</td></tr>
  <tr><td>Consumer ID${colon}</td><td>12345678</td></tr></table>`
const page = (inner: string, extra = '') =>
  `<html><body>${extra}${inner}</body></html>`

let n = 0
const test = (name: string, fn: () => void) => { fn(); n++; console.log('ok -', name) }

test('basic bill with TOTAL row', () => {
  const r = parseNEAHtml(page(details() + `<table>${header}${row('1','Pending','Shrawan','900','950.5')}
    <tr><td colspan="8">TOTAL</td><td>950.5</td><td colspan="4"></td></tr></table>`))
  assert.equal(r.success, true)
  assert.equal(r.customerName, 'RAM BAHADUR')
  assert.equal(r.consumerId, '12345678')
  assert.equal(r.payableAmount, 950.5)
  assert.equal(r.status, 'READY_TO_PAY')
  assert.equal(r.dueBillOf, 'Shrawan')
})

test('labels with trailing colon', () => {
  const r = parseNEAHtml(page(details(' :') + `<table>${header}${row('1','Pending','Asar','500','500')}</table>`))
  assert.equal(r.customerName, 'RAM BAHADUR')
  assert.equal(r.neaLocation, 'BUTWAL')
})

test('script containing "invalid" does not cause false "no data"', () => {
  const r = parseNEAHtml(page(details() + `<table>${header}${row('1','Pending','Asar','500','500')}</table>`,
    `<script>var msg = "Invalid input, not found, please check";</script>`))
  assert.equal(r.success, true)
  assert.equal(r.payableAmount, 500)
})

test('no TOTAL row: sums bill rows', () => {
  const r = parseNEAHtml(page(details() + `<table>${header}${row('1','Pending','Asar','500','500')}${row('2','Pending','Shrawan','300','300')}</table>`))
  assert.equal(r.payableAmount, 800)
})

test('nested outer row containing TOTAL does not clobber the total', () => {
  const inner = `<table>${header}${row('1','Pending','Asar','500','500')}<tr><td colspan="8">TOTAL</td><td>500</td><td colspan="4"></td></tr></table>`
  const r = parseNEAHtml(page(details() + `<table><tr><td>${inner}</td></tr></table>`))
  assert.equal(r.payableAmount, 500)
})

test('different column count still parsed via header mapping', () => {
  const h = `<tr><th>S.No</th><th>Status</th><th>Due Bill Of</th><th>Payable Amt</th></tr>`
  const r = parseNEAHtml(page(details() + `<table>${h}<tr><td>1</td><td>Pending</td><td>Asar</td><td>1,250.00</td></tr></table>`))
  assert.equal(r.payableAmount, 1250)
  assert.equal(r.dueBillOf, 'Asar')
})

test('no due bill', () => {
  const r = parseNEAHtml(page(details() + `<table>${header}</table>`))
  assert.equal(r.success, true)
  assert.equal(r.payableAmount, 0)
  assert.equal(r.status, 'NO_DUE')
})

test('genuine "no data" page is an error', () => {
  const r = parseNEAHtml(page('<p>No Data Found</p>'))
  assert.equal(r.success, false)
  assert.match(r.error!, /No bill data found/)
})

test('unrecognised page is a format error', () => {
  const r = parseNEAHtml(page('<p>Hello</p>'))
  assert.equal(r.success, false)
  assert.match(r.error!, /page format may have changed/)
})

console.log(`\n${n} tests passed`)
