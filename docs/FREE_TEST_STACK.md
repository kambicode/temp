# KAMBi - Free Test Stack

Researched 4 October 2026. Free tiers change without notice, so every line marked "verify" should be checked on the provider's page before you depend on it. This is for testing and the first camp's build phase; migrate to paid or sponsored services as they arrive.

## 1. The stack at a glance

| Need | Free option | Notes |
| --- | --- | --- |
| Database, auth, storage, realtime | Supabase free (already yours) | Free projects can pause after inactivity and have no managed backups on the free plan (verify). Keep it alive with a scheduled ping and take your own nightly dump. |
| Web app and HQ console hosting | Cloudflare Pages (or Vercel, Netlify) | apps/web and apps/hq are static Vite builds. Free, with HTTPS. |
| Worker (cron jobs, agents, file rendering) | GitHub Actions scheduled workflows plus Supabase pg_cron and Edge Functions | No server to run. See section 3. |
| Always-on server, if you want one | Google Cloud e2-micro, or Oracle Always Free | Both need a card. See section 2. |
| Domain | GitHub Student Pack domain, or DigitalPlat or eu.org | See section 4. |
| DNS, HTTPS, tunnel | Cloudflare free | Free DNS, and Tunnel can expose a laptop or small VM without a public IP. |
| Webhooks (Payme, Textify) | Supabase Edge Functions | Public URL, no server needed. |
| SMS | Textify Africa API | Bearer key, POST to /api/v1/messages, sender names, status webhooks, OTP API. |
| AI | OpenRouter free models, NVIDIA NIM, Groq | See section 5. |
| Errors and uptime | Sentry free developer tier, UptimeRobot free | Alerts to your phone. |
| Backups | Nightly pg_dump from a scheduled workflow, encrypted, into a private repo or Cloudflare R2 free storage | Verify R2 free limits. |

## 2. Free VPS, honestly

- **Oracle Cloud Always Free.** Still exists, but the Arm allowance was cut to 2 OCPU and 12 GB of RAM in mid-2026, capacity errors are common, a card is required, and idle instances can be reclaimed. Good if it works for you; do not make the camp depend on it.
- **Google Cloud e2-micro.** One small always-free VM (about 1 GB RAM, 30 GB disk), only in us-west1, us-central1 or us-east1, card required, plus a 90-day credit for new accounts. Enough for Docker Compose with Caddy and a light worker.
- **AWS and Azure.** Credits and trials rather than permanent free servers.
- **If cards from Tanzania are refused,** a virtual USD card is the usual workaround, or skip the VPS entirely and use section 3.

## 3. Worker with no VPS (recommended for now)

Your Blueprint already uses a Postgres job queue with row locking and idempotent jobs. That design needs no always-on server: a scheduled job wakes up, drains the queue, and exits.

- **Python worker on GitHub Actions** for PDF, Word, Excel and chart rendering, the recommender, the nightly synopsis, and backups. Scheduled workflows run at most every five minutes and can be delayed, which suits batch work.
- **Supabase pg_cron plus Edge Functions** for short, frequent jobs and webhooks.
- Use the Supabase pooler connection string from Actions, because the direct connection may be IPv6 only.

Example workflow:

```yaml
name: worker
on:
  schedule:
    - cron: "*/30 * * * *"
  workflow_dispatch:
jobs:
  run:
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.12"
      - run: pip install -r services/worker/requirements.txt
      - run: python -m worker.drain --max-jobs 20
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          OPENROUTER_API_KEY: ${{ secrets.OPENROUTER_API_KEY }}
          NVIDIA_API_KEY: ${{ secrets.NVIDIA_API_KEY }}
```

Keep every key in repository secrets and in local environment files that are git-ignored. Never in the repo, the app bundle, or chat.

## 4. Free domain

- **GitHub Student Developer Pack** (best, if your university verifies you): Namecheap gives a .me for a year with an SSL certificate, Name.com gives one domain from a list of endings such as .dev or .app, and .TECH is also offered. Verification uses a school email or student ID and is re-checked periodically.
- **DigitalPlat FreeDomain:** free .dpdns.org, .us.kg, .qzz.io and .xx.kg domains. Quick, but these are subdomain-style and free domains attract abuse, so email and SMS reputation can suffer.
- **eu.org:** free subdomains that do not expire; approval can take a while.
- **is-a.dev and similar:** free developer subdomains.
- Put whichever you choose behind Cloudflare DNS, and keep the domain name in configuration so you can swap it later without code changes.

## 5. AI on a free budget

**Limits (verify at openrouter.ai).** Free model IDs end in :free. They allow 20 requests per minute, and 50 requests per day account-wide until you have bought at least $10 in credits in total, after which the limit becomes 1,000 per day. The limit is on requests, not tokens, so one big request is far better than many small ones.

**Models seen free in mid-2026 (verify, they rotate):**

| Job in Kambi | Model | Why |
| --- | --- | --- |
| Reports, proposals, grant templates, articles | nvidia/nemotron-3-ultra-550b-a55b:free | Largest Nemotron, 1M context |
| Mid-size generation, fallbacks | nvidia/nemotron-3-super-120b-a12b:free | Strong, lighter |
| Field safety check, topic keywords, first moderation decision | nvidia/nemotron-3-nano-30b-a3b:free | Cheap and fast |
| Moderation audit (second model) | nvidia/nemotron-3.5-content-safety:free | Worth testing; may need your own rules on top |
| Anything, as last fallback | openrouter/free | Router across free models |

**Second and third pools** so one account limit does not stop you: NVIDIA NIM (free credits, Nemotron models, around 40 requests per minute), Groq (very high daily request limit on small Llama models, good for classification), and Cloudflare Workers AI (daily free quota).

**How to make the agent efficient:**

1. Batch by output: one request per selected output, never one per entry.
2. Store a daily request counter. When the budget is spent, mark jobs waiting_quota and resume tomorrow, which fits the Blueprint's queue-until-top-up rule.
3. Keep the model list in a config table, not in code, because free models rotate. Pass a models array so OpenRouter falls through on rate limits and downtime.
4. Cache and deduplicate by hashing the input; never regenerate.
5. Validate output with Pydantic and retry with backoff, within the daily budget.

**Privacy.** Many free endpoints may log prompts or use them for training, which conflicts with the Design doc rule of non-logging providers only. Until you move to non-logging providers, use synthetic data only, and keep the anonymization pipeline strict even in tests. Check your OpenRouter privacy settings for what free models require.

## 6. Textify notes

From the API documentation you uploaded: Bearer API key from the portal, base URL https://portal.textify.africa/api/v1, send via POST /messages with sender_name, optional scheduling and a list of receiver and content pairs, message status webhooks per API key, sender name requests, credit purchase through the API, and an OTP API. Use one key per environment and keep the webhook as a Supabase Edge Function. The OTP API could later back phone sign-in for people with no email, through Supabase's custom SMS hook (verify).
