import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Pricing — SubjectLine AI' };

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: '/mo',
    features: ['10 subject lines/month', 'All email purposes', 'Basic tones', 'Copy to clipboard'],
    cta: 'Get Started',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$19',
    period: '/mo',
    features: ['200 subject lines/month', 'A/B variant testing', 'All tones + custom', 'Predicted open rate scores', 'Subject line history', 'Priority AI model'],
    cta: 'Start Free Trial',
    highlight: true,
  },
  {
    name: 'Business',
    price: '$49',
    period: '/mo',
    features: ['Unlimited subject lines', 'Everything in Pro', 'Team workspace (up to 10 seats)', 'Brand voice profiles', 'API access', 'CSV export', 'Dedicated support'],
    cta: 'Contact Sales',
    highlight: false,
  },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen px-6 py-20 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-3">Simple, Transparent Pricing</h1>
      <p className="text-zinc-400 text-center mb-12">Start free. Upgrade when you need more power.</p>

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map(plan => (
          <div key={plan.name}
            className={`glass rounded-2xl p-6 flex flex-col ${plan.highlight ? 'border-blue-500/50 ring-1 ring-blue-500/20' : ''}`}>
            {plan.highlight && <span className="text-xs font-bold text-blue-400 uppercase mb-2">Most Popular</span>}
            <h3 className="text-xl font-bold">{plan.name}</h3>
            <div className="mt-4 mb-6">
              <span className="text-4xl font-bold">{plan.price}</span>
              <span className="text-zinc-500 text-sm">{plan.period}</span>
            </div>
            <ul className="space-y-2.5 flex-1">
              {plan.features.map(f => (
                <li key={f} className="text-sm text-zinc-300 flex items-start gap-2">
                  <span className="text-cyan-400 mt-0.5">&#10003;</span>{f}
                </li>
              ))}
            </ul>
            <button className={`mt-6 w-full py-3 rounded-xl font-medium text-sm transition ${plan.highlight ? 'btn-primary text-white' : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200'}`}>
              {plan.cta}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
        <div className="max-w-2xl mx-auto text-left space-y-4">
          {[
            ['How does the free plan work?', 'Generate up to 10 subject lines per month. No credit card required.'],
            ['What is A/B variant testing?', 'Pro and Business plans generate two versions of each subject line so you can split-test which one gets higher open rates.'],
            ['Can I cancel anytime?', 'Yes, cancel anytime from your dashboard. No lock-in, no questions asked.'],
            ['Do you store my generated subject lines?', 'Pro and Business plans include full subject line history. Free plan results are not saved server-side.'],
            ['What AI model do you use?', 'We use state-of-the-art LLMs fine-tuned for email marketing copywriting.'],
          ].map(([q, a]) => (
            <details key={q} className="glass rounded-xl p-4 cursor-pointer">
              <summary className="text-sm font-medium">{q}</summary>
              <p className="text-sm text-zinc-400 mt-2">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </main>
  );
}
