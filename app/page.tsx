import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { LogoMark } from '@/components/logo'

const STEPS = [
  { title: 'Create an account', body: 'Sign up with your email. No credit card needed.' },
  { title: 'Add your consumer IDs', body: 'Enter the NEA location code, SC No and Consumer ID for each meter.' },
  { title: 'We check for you', body: 'Your bills are checked every 6 hours on Free and every 2 hours on Pro.' },
  { title: 'You get an email', body: 'The message arrives when the bill becomes payable in eSewa or Khalti.' },
]

const FEATURES = [
  { title: 'Checks on a schedule', body: 'Your bill status is read from the NEA billing page automatically, so you do not have to remember to look.' },
  { title: 'One email when it matters', body: 'You are told when a bill turns payable, with the amount, instead of a daily message.' },
  { title: 'Every meter in one place', body: 'Add the home, the shop and your parents\u2019 house, and see which ones need paying.' },
  { title: 'Built around NEA IDs', body: 'Location codes, SC numbers and consumer IDs are entered the way they appear on your bill.' },
]

const STORED = [
  ['Your email address', 'Your password, wallet login or bank details'],
  ['NEA location code, SC No and Consumer ID', 'Anything needed to pay the bill for you'],
  ['The last bill status and amount we saw', 'Access to your eSewa or Khalti account'],
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-paper text-ink selection:bg-signal/40">
      <Navbar />

      <main>
        {/* Hero */}
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-20 pt-14 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:pt-20">
          <div className="min-w-0">
            <h1 className="font-display text-4xl font-bold leading-[1.08] sm:text-5xl lg:text-[3.4rem]">
              Know the moment your NEA bill is payable.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-violet-700">
              Save your NEA consumer IDs once. BillNotify checks them for you and sends an email when a bill can be
              paid in eSewa or Khalti, so you pay on time and skip the late fee.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link
                href="/dashboard"
                className="rounded-lg bg-violet-700 px-6 py-3 text-base font-semibold text-white hover:bg-violet-800"
              >
                Add your first meter
              </Link>
              <Link
                href="/pricing"
                className="text-base font-semibold underline decoration-signal decoration-2 underline-offset-4 hover:decoration-4"
              >
                See pricing
              </Link>
            </div>
            <p className="mt-5 text-sm text-violet-500">Free plan available. Set up in about two minutes.</p>
          </div>

          {/* The alert, and the accounts it comes from */}
          <figure className="min-w-0" aria-label="Example alert email and account list">
            <div className="rounded-xl border border-violet-200 bg-white shadow-[0_18px_40px_-26px_rgba(31,24,67,0.5)]">
              <div className="flex items-center gap-3 border-b border-violet-100 px-5 py-4">
                <LogoMark size={36} />
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold">Your NEA bill is ready to pay</div>
                  <div className="text-xs text-violet-500">BillNotify &middot; just now</div>
                </div>
              </div>
              <div className="px-5 py-5">
                <div className="text-sm text-violet-700">Home, Butwal</div>
                <div className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="whitespace-nowrap font-display text-3xl font-bold tracking-tight sm:text-4xl">NPR 1,248.50</span>
                  <span className="rounded-sm bg-signal px-2 py-0.5 text-xs font-bold text-violet-950">Payable now</span>
                </div>
                <div className="mt-4 flex gap-2 text-sm font-semibold">
                  <span className="rounded-md border border-violet-200 px-3 py-1.5">Pay in eSewa</span>
                  <span className="rounded-md border border-violet-200 px-3 py-1.5">Pay in Khalti</span>
                </div>
              </div>
            </div>

            <div className="mt-3 overflow-hidden rounded-xl border border-violet-200 bg-white text-sm">
              {[
                { name: 'Home, Butwal', status: 'Ready to pay', ready: true },
                { name: 'Shop', status: 'No bill due', ready: false },
                { name: 'Parents\u2019 house', status: 'No bill due', ready: false },
              ].map((a) => (
                <div key={a.name} className="flex items-center justify-between border-b border-violet-100 px-5 py-3 last:border-b-0">
                  <span className="font-medium">{a.name}</span>
                  <span className="flex items-center gap-2 text-violet-700">
                    <span className={`h-2 w-2 rounded-full ${a.ready ? 'bg-signal' : 'bg-violet-200'}`} />
                    {a.status}
                  </span>
                </div>
              ))}
            </div>
            <figcaption className="mt-3 text-sm text-violet-500">An example of what you receive and what you see.</figcaption>
          </figure>
        </section>

        {/* How it works */}
        <section className="border-y border-violet-100 bg-white">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_1.4fr]">
            <h2 className="font-display text-3xl font-bold sm:text-4xl lg:sticky lg:top-24 lg:self-start">
              From saved ID to email, in four steps
            </h2>
            <ol className="relative border-l-2 border-violet-100 pl-8">
              {STEPS.map((s, i) => (
                <li key={s.title} className="relative pb-9 last:pb-0">
                  <span
                    aria-hidden="true"
                    className={`absolute -left-[2.6rem] top-1 h-4 w-4 rounded-full border-4 border-white ${i === STEPS.length - 1 ? 'bg-signal' : 'bg-violet-600'}`}
                  />
                  <h3 className="font-display text-xl font-bold">{s.title}</h3>
                  <p className="mt-1 max-w-md leading-relaxed text-violet-700">{s.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* What it does */}
        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <h2 className="font-display max-w-xl text-3xl font-bold sm:text-4xl">What BillNotify does</h2>
          <dl className="mt-10 grid gap-x-8 gap-y-0 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f) => (
              <div key={f.title} className="border-t-2 border-violet-800 py-5">
                <dt className="font-display text-lg font-bold">{f.title}</dt>
                <dd className="mt-2 leading-relaxed text-violet-700">{f.body}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Privacy */}
        <section className="border-y border-violet-100 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <h2 className="font-display max-w-2xl text-3xl font-bold sm:text-4xl">
              We only keep what we need to check a bill
            </h2>
            <div className="mt-10 overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm sm:text-base">
                <thead>
                  <tr className="border-b-2 border-violet-800">
                    <th scope="col" className="w-1/2 py-3 pr-4 font-semibold">What we store</th>
                    <th scope="col" className="py-3 font-semibold text-violet-500">What we never ask for</th>
                  </tr>
                </thead>
                <tbody>
                  {STORED.map(([yes, no]) => (
                    <tr key={yes} className="border-b border-violet-100 align-top">
                      <td className="py-4 pr-4 font-medium">{yes}</td>
                      <td className="py-4 text-violet-500">{no}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Plain-language answers (kept for search) */}
        <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">Understanding your NEA bill</h2>
          <p className="mt-4 leading-relaxed text-violet-700">
            BillNotify Nepal is an automated utility notification service. It tracks your Nepal Electricity Authority
            bills and tells you when one is ready to pay, so you can avoid late fees. NEA electricity is supported
            today; water bills are planned.
          </p>
          <dl className="mt-8 divide-y divide-violet-100 border-y border-violet-100">
            <div className="py-5">
              <dt className="font-display text-lg font-bold">What is an NEA SC Number?</dt>
              <dd className="mt-2 leading-relaxed text-violet-700">
                The SC Number (Service Counter Number) is a unique identifier assigned by the Nepal Electricity
                Authority (NEA) to a specific meter connection. It is used alongside the Consumer ID to check bill status.
              </dd>
            </div>
            <div className="py-5">
              <dt className="font-display text-lg font-bold">How do I pay my NEA bill online?</dt>
              <dd className="mt-2 leading-relaxed text-violet-700">
                You can pay your NEA electricity bill online in Nepal using digital wallets like eSewa, Khalti, or
                mobile banking apps. BillNotify Nepal alerts you when the bill is marked as &quot;READY TO PAY&quot; in
                the NEA system.
              </dd>
            </div>
          </dl>
        </section>

        {/* Closing */}
        <section className="bg-violet-800 text-white">
          <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 py-16 sm:px-6 md:flex-row md:items-center">
            <h2 className="font-display max-w-xl text-3xl font-bold sm:text-4xl">Add your first consumer ID today.</h2>
            <Link
              href="/dashboard"
              className="rounded-lg bg-white px-6 py-3 text-base font-semibold text-violet-800 hover:bg-violet-100"
            >
              Open the dashboard
            </Link>
          </div>
        </section>
      </main>

      <footer className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-violet-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-2.5">
          <LogoMark size={24} />
          <span>BillNotify Nepal &copy; {new Date().getFullYear()}</span>
        </div>
        <nav aria-label="Footer" className="flex gap-5">
          <Link href="/pricing" className="hover:text-ink">Pricing</Link>
          <Link href="/dashboard" className="hover:text-ink">Dashboard</Link>
        </nav>
      </footer>
    </div>
  )
}
