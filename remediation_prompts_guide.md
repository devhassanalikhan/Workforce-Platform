# Actionable AI Prompts: Remediation Roadmap

This document contains step-by-step, copy-pasteable prompts you can feed to an AI coding assistant to implement each security fix, architectural improvement, or feature update.

---

## High Priority Tasks

### 1. Secure Escrow Updates in Deployments RLS Policy   [DONE]

**Target**: Supabase RLS Policies & Migrations
```text
Please write a database migration to secure the 'public.deployments' table Row Level Security (RLS) policies. 

Currently, the UPDATE policy on 'public.deployments' allows any authorized employer to update all columns of a deployment, which exposes the 'escrow_balance' column to direct modification. 

Create a new migration script in `supabase/migrations/` that performs the following actions:
1. Drop the existing 'deployments_update' policy on 'public.deployments'.
2. Create a new UPDATE policy named 'deployments_update_fields' on 'public.deployments' that permits employers and assigned talent to update ONLY non-financial fields like 'last_check_in', 'next_check_in', and 'wellbeing_score' (you can enforce this by verifying that the NEW.escrow_balance is equal to OLD.escrow_balance, or by splitting access levels).
3. Ensure that the 'escrow_balance' column remains updatable ONLY via the security-definer RPC function 'release_escrow()'.
4. Verify the migration works and conforms to strict Postgres security best practices.
```

---

### 2. Refactor SignupPage Form Validation with Zod & React Hook Form   [DONE]
**Target**: `src/pages/SignupPage.tsx`

```text
Please refactor the forms in `src/pages/SignupPage.tsx` to use React Hook Form and Zod schemas instead of raw state inputs and manual conditional validations.

Specifically:
1. Define a strict Zod schema for both 'applicant' and 'employer' registration paths.
   - For applicants: Validate full_name (required), email (must be valid email), password (minimum 8 characters).
   - For employers: Validate company_name (required), business_type (must be in predefined lists), registration_number, registration_authority, country, contact_person, designation, phone_number, and company_website (optional, valid URL shape).
2. Wrap the forms in the standard React Hook Form hook ('useForm') using the Zod resolver.
3. Replace custom validation message rendering with the form hook's 'formState.errors' values.
4. Clean up any manual onSubmit state management, ensuring the credentials and metadata object payload sent to Supabase Auth's 'signUp()' function remain structured and type-safe.
5. Make sure the styled components preserve their premium HSL/Tailwind styles during the transition.
```

---

### 3. Refactor JobApplicationForm with Zod & React Hook Form   [DONE]
**Target**: `src/components/jobs/JobApplicationForm.tsx`

```text
Please refactor `src/components/jobs/JobApplicationForm.tsx` to enforce strict schema-based input validations.

Tasks:
1. Define a Zod schema matching the OES-style profile fields collected during application:
   - name (required)
   - gender (must be 'Male' or 'Female')
   - date_of_birth (valid ISO date string format)
   - cnic (must be exactly 13 digits with no dashes)
   - city, phone, category, qualification, field_of_work (required fields)
   - relevant_experience_years (numeric value)
   - foreign_experience, driving_license, has_certification (must be 'Yes' or 'No')
   - height (predefined range values)
2. Replace manual 'FormState' management with React Hook Form's 'useForm' and '@hookform/resolvers/zod'.
3. Integrate display warning notifications next to each input field utilizing form errors rather than a single generic error toast.
4. Ensure data formatting is strictly parsed (e.g., converting experience years string inputs to integers) before saving the profile updates or applying to a placement.
```

---

### 4. Implement a Global React Error Boundary   [DONE]
**Target**: `src/main.tsx` & `src/components/guards/ErrorBoundary.tsx`

```text
Please implement a global React Error Boundary to catch unhandled runtime errors, preventing screen freezes and providing users with a graceful recovery interface.

Steps:
1. Create a new component at `src/components/guards/ErrorBoundary.tsx` using a React class component.
2. In the ErrorBoundary component:
   - Handle 'getDerivedStateFromError' to update state when a crash occurs.
   - Implement 'componentDidCatch' to log error details to the console.
   - Render a custom recovery page with premium WorkforceX dark/light HSL styling, displaying a clean "Something went wrong" message, details of the error, and a "Reload Page" button.
3. Import and wrap '<App />' in `src/main.tsx` inside the new '<ErrorBoundary>'.
4. Add a test utility or development toggle to verify that the boundary successfully intercepts nested render errors.
```

---

## Medium Priority Tasks

### 5. Generate Supabase Database TypeScript Type Definitions   [DONE]
**Target**: `src/types/supabase.ts` & Data Layer

```text
Please guide me through generating Supabase database TypeScript type definitions and refactoring the data layer to utilize them.

Tasks:
1. Provide the exact command to run the Supabase CLI code generator to export the project's schema types to `src/types/supabase.ts`.
2. Once the types are generated, review `src/lib/data/` (specifically `jobs.ts`, `talent.ts`, and `adminEmployers.ts`) and replace type overrides like 'as unknown as JobRow[]' or 'as any' with the generated types (e.g. 'Database["public"]["Tables"]["jobs"]["Row"]').
3. Resolve any type mismatch issues between your domain models (`src/types/domain.ts`) and database schemas during translation.
```

---

### 6. Modularize SignupPage.tsx Subcomponents   [REMAINING]
**Target**: `src/pages/SignupPage.tsx`

```text
Please split the large file `src/pages/SignupPage.tsx` (over 800 lines of code) into smaller, reusable, and maintainable subcomponents.

Move sections into separate files:
1. Create `src/components/auth/VerifyEmailStep.tsx` for email verification confirmations.
2. Create `src/components/auth/ApplicantSignupForm.tsx` containing the applicant signup inputs.
3. Create `src/components/auth/EmployerSignupForm.tsx` containing the employer registration structure.
4. Keep `src/pages/SignupPage.tsx` as a clean router component managing routing parameters (`?as=employer`), layout wrapping, step transitions, and top-level authentication callbacks.
5. Verify imports are properly structured, paths remain correct, and styling metrics are untouched.
```

---

### 7. Optimize and Audit Missing Assets   [REMAINING]
**Target**: Public Assets & Image Placeholders

```text
Please identify all image placeholders or missing static assets inside the code (e.g. background layers, logos, blog images) and verify that they are correctly located in the public folders.

Tasks:
1. Scan the components folder and pages (like `HomePage.tsx`, `AboutTrust.tsx`, `BlogResources.tsx`, and component templates) for local assets or image paths (e.g. '/images/blog-departure.jpg', '/images/logo-placeholder.png').
2. Provide a list of all assets referenced in code that are missing from the public folder.
3. For any missing asset, write instructions or scripts to replace them with beautiful SVG vectors or placeholder indicators that fit the application's gold-and-teal dark style guide.
```

---

## Low Priority Tasks

### 8. Integrate AI Assistant with Secure LLM Edge Function Proxy   [REMAINING]
**Target**: `src/pages/AiAssistant.tsx` & Supabase Edge Functions

```text
Please replace the mocked chat response simulation in `src/pages/AiAssistant.tsx` with a secure integration with an LLM provider.

Steps:
1. Create a Supabase Edge Function (e.g., `supabase/functions/chat-ai/index.ts`) that securely calls your LLM provider's API (e.g., Google Gemini or Anthropic Claude) using an environment variable secret.
2. Update the frontend logic in `src/pages/AiAssistant.tsx` inside 'handleSend' to perform a POST request calling 'supabase.functions.invoke("chat-ai")' instead of reading from local mock dictionary keys.
3. Gracefully manage loading feedback states, connection timeouts, and system-level error messages in the chat interface.
```

---

### 9. Implement Pagination & Search Virtualization on Jobs/Talent Pools   [REMAINING]
**Target**: `src/pages/JobsMarketplace.tsx` and `src/pages/TalentPool.tsx`

```text
Please implement cursor-based or offset-based pagination and search virtualization for the Jobs Marketplace and Talent Pool lists to support growing databases.

Tasks:
1. Modify the data services `getJobs` and `getTalent` to accept pagination parameters (page number, limit, sorting options, search query).
2. Update the Supabase queries to retrieve results matching search filters using `.range(from, to)` to load data incrementally.
3. Add pagination buttons or an "infinite scroll" intersection trigger component to the bottom of the list grids in `JobsMarketplace.tsx` and `TalentPool.tsx`.
4. Ensure loading skeletons are rendered while next pages are fetching, providing a smooth scroll transition.
```
