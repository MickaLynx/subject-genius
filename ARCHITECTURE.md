# SubjectLine AI — Architecture

## Stack
- **Frontend**: Next.js 15, React 19, Tailwind CSS 4
- **Backend**: Next.js API Routes (serverless)
- **AI**: Vercel AI SDK + Claude/OpenAI
- **Auth**: Supabase Auth (future)
- **Payments**: Stripe Checkout + Webhooks
- **Deploy**: Vercel (primary), Docker (Infomaniak fallback)

## Pages
| Route | Type | Description |
|-------|------|-------------|
| / | Landing | Hero + generator + social proof |
| /dashboard | App | Advanced generator + A/B testing + history |
| /pricing | Static | Free / Pro $19 / Business $49 |
| /api/generate | API | AI subject line generation |
| /api/history | API | User generation history |
| /api/stripe | API | Payment webhook handler |

## Data Model (Supabase — future)
```sql
users (id, email, plan, stripe_customer_id, created_at)
generations (id, user_id, purpose, audience, tone, subjects[], created_at)
ab_tests (id, generation_id, variant_a, variant_b, winner, open_rate_a, open_rate_b)
```

## Pricing
| Plan | Price | Limits |
|------|-------|--------|
| Free | $0 | 10 subject lines/month |
| Pro | $19/mo | 200/month + A/B testing |
| Business | $49/mo | Unlimited + team + API |

## Deployment Checklist
- [ ] Supabase project + auth
- [ ] Stripe products + webhook
- [ ] Vercel deploy + env vars
- [ ] Custom domain
- [ ] PostHog analytics
