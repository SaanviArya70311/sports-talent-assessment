# Elitez — Sports Talent Assessment & Scout Discovery Platform

Elitez is a standardized sports talent assessment, performance benchmarking, video evaluation, and collegiate scout discovery website.

## Core Pillars & Capabilities

1. **Deterministic Scoring Engine (`v2.4-deterministic`)**:
   - Pure mathematical mapping from raw performance units (seconds, cm, reps) to normalized 0–100 scale.
   - Distinct directional algorithms (`lower_is_better` for sprints/shuttles, `higher_is_better` for jumps/endurance).
   - Weighted composite index across 5 pillars (Speed, Power, Strength, Endurance, Agility).
   - No black-box AI score hallucination; transparent, auditable formula versioning.

2. **Computer Vision & Video Movement Analysis**:
   - HTML5 timeline player with keypoint overlay (shoulders, elbows, hips, knees, ankles).
   - Movement cadence (BPM) and repetition tracking.
   - Frame scrubbing (±1 frame advance) and slow-motion (0.25x, 0.5x, 1x).
   - Strict honesty model: CV outputs are clearly tagged as estimates; combine badges require certified coach verification.

3. **Peer Benchmark Datasets & Citations**:
   - Grounded in documented athletic combine cohorts (NSCA Youth Norms, High School Combine Study, Cooper Institute).
   - Dynamic distribution bar showing 10th, 25th, median (50th), 75th, 90th, and 99th elite percentiles.
   - Non-selection guarantee disclaimers displayed prominently.

4. **Role-Based Experience**:
   - **Athlete Hub**: Personal bests, 5-pillar radar chart, attempt history, protocol wizard, and offline draft autosaving.
   - **Coach & Scout Portal**: Search directory with sport/age/score filters, side-by-side athlete comparison, private notes, ratings (1–5 stars), and video verification actions.
   - **Admin Management**: Tunable metric boundaries, scoring weights, submission review queue, benchmark tables, and immutable audit logs.
   - **Minor Safeguarding**: Parental consent controls, automatic location/contact cloaking for athletes under 18.

## Running Locally

```bash
# Install dependencies
npm install

# Run the local development server (port 3000)
npm run dev

# Run deterministic scoring engine tests
npm run test

# Type-check and lint
npm run lint

# Build for production
npm run build
```

## Production Database & Cloud Run Deployment

- **Database**: Apply `schema.sql` to your PostgreSQL or Supabase instance to enable Row Level Security (RLS) policies.
- **Environment Variables**: Configure `.env` with `SUPABASE_URL` and `SUPABASE_ANON_KEY` when connecting a live backend.
- **Docker / Cloud Run**: Suitable for containerized deployment on Google Cloud Run listening on port 3000.
