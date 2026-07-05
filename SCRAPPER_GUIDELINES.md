Act as a Principal Staff Engineer and Cloud Architect. Build a Supabase Edge Function in TypeScript that uses the Firecrawl API to scrape the Pakistan Bureau of Emigration & Overseas Employment (BEOE) portal. 

The function must be optimized for performance, compliant with Supabase Edge Function execution limits, and deeply respectful of target server resources.

### Tech Stack & Architecture
1. Backend: Supabase Edge Functions (Deno / TypeScript).
2. Scraping Engine: Firecrawl API (`@mendable/firecrawl-js` or direct HTTPS fetch).
3. Storage: Supabase Database (PostgreSQL) via the pre-configured `supabase-js` service role client.

### Core Targets
- Target 1: OEP List (`https://beoe.gov.pk/list-of-oeps?show=active`)
- Target 2: Foreign Jobs (`https://beoe.gov.pk/foreign-jobs`)

---

### Mandatory Implementation Guidelines

#### 1. Firecrawl Strategy & Anti-Fingerprinting
- Use Firecrawl's `scrape` or `crawl` endpoint. Because BEOE utilizes strict cloud/government firewalls that block standard LLM agents, configure Firecrawl to use **residential proxies** or advanced anti-bot bypass features if available.
- Request the data explicitly as structured JSON using Firecrawl’s `extract` schema parameter to ensure we receive clean, typed data matching our database schema without needing raw HTML parsing logic.

#### 2. Defensive Rate-Limiting & Server Respect
- Because government servers are prone to timeouts and rate-limiting, do not use aggressive parallelization (`Promise.all`). Iterate sequentially.
- If performing paginated crawls on the `/foreign-jobs` directory, inject a randomized delay between requests using an exponential backoff or standard sleep timer:
  ```typescript
  const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
  // Await a random window between 3 to 6 seconds per page request
  await delay(Math.floor(Math.random() * 3000) + 3000);