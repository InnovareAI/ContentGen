# Content Engine - Handover Document

## Project Overview

**Content Engine** is an AI-powered content generation platform that transforms a single topic/idea into a complete cross-platform content campaign. It generates optimized content for Blog, LinkedIn, Twitter/X, Instagram, and Facebook - all from one input.

### Live URLs
- **Production:** https://content-gen-ai.netlify.app
- **GitHub:** https://github.com/InnovareAI/ContentGen
- **Netlify Admin:** https://app.netlify.com/projects/content-gen-ai

---

## Tech Stack

| Component | Technology |
|-----------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Database & Auth | Supabase |
| Text Generation | Claude API (Anthropic) |
| Image Generation | DALL-E 3 (OpenAI) |
| Styling | Tailwind CSS |
| Hosting | Netlify |

---

## Project Structure

```
ContentGen/
├── src/
│   ├── app/
│   │   ├── (app)/                    # Authenticated app routes
│   │   │   ├── dashboard/            # Main dashboard
│   │   │   ├── campaigns/            # Campaign list & management
│   │   │   │   ├── new/              # Create new campaign
│   │   │   │   └── [id]/             # Campaign detail/review
│   │   │   ├── brands/               # Brand management
│   │   │   └── calendar/             # Content calendar
│   │   ├── (auth)/                   # Auth routes (login/signup)
│   │   ├── api/                      # API routes
│   │   │   ├── campaigns/            # Campaign CRUD
│   │   │   ├── brands/               # Brand CRUD
│   │   │   ├── content/              # Content updates
│   │   │   └── generate/             # AI generation endpoints
│   │   │       ├── text/             # Claude text generation
│   │   │       └── image/            # DALL-E image generation
│   │   ├── layout.tsx                # Root layout
│   │   └── page.tsx                  # Landing page
│   ├── components/
│   │   ├── ui/                       # Reusable UI components
│   │   ├── campaigns/                # Campaign-specific components
│   │   ├── content/                  # Content preview/edit
│   │   └── Sidebar.tsx               # Navigation sidebar
│   ├── lib/
│   │   ├── ai/
│   │   │   ├── claude.ts             # Claude API wrapper
│   │   │   ├── image.ts              # DALL-E API wrapper
│   │   │   ├── orchestrator.ts       # Content generation orchestrator
│   │   │   └── prompts.ts            # Platform-specific prompts
│   │   ├── supabase/
│   │   │   ├── client.ts             # Browser client
│   │   │   ├── server.ts             # Server client
│   │   │   └── middleware.ts         # Auth middleware
│   │   └── utils.ts                  # Utility functions
│   ├── types/
│   │   └── index.ts                  # TypeScript definitions
│   └── middleware.ts                 # Next.js middleware (auth)
├── supabase-schema.sql               # Database schema
├── .env.local.example                # Environment variables template
└── package.json
```

---

## Environment Variables

Copy `.env.local.example` to `.env.local` and configure:

```env
# Supabase (Required for auth & database)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Anthropic Claude (Required for text generation)
ANTHROPIC_API_KEY=sk-ant-...

# OpenAI (Required for image generation)
OPENAI_API_KEY=sk-...
```

**For Netlify:** Add these in Site Settings → Environment Variables

---

## Database Setup

1. Create a Supabase project at https://supabase.com
2. Go to SQL Editor
3. Run the contents of `supabase-schema.sql`

### Tables

| Table | Purpose |
|-------|---------|
| `brands` | Brand configurations (tone, guidelines, prompts) |
| `campaigns` | Campaign metadata (topic, audience, status) |
| `content` | Generated content pieces per platform |
| `prompts` | Custom prompt templates (optional) |
| `comments` | Review comments on content (optional) |

### Row Level Security (RLS)
All tables have RLS policies - users can only access their own data.

---

## Core Features

### 1. Campaign Creation
- Input: Topic, audience (optional), intent (optional), tone, platforms
- Output: Full content suite for all selected platforms

### 2. AI Content Generation
- **Text (Claude):** Platform-optimized content with character limits
  - Blog: 800-1500 words, markdown with headings
  - LinkedIn: ~1300 chars, professional tone, hashtags
  - Twitter: 280 chars max, punchy
  - Instagram: Caption + hashtags
  - Facebook: Conversational, medium length
- **Images (DALL-E 3):** Hero images for campaigns

### 3. Brand Management
- Tone of voice settings
- Brand guidelines
- Custom system prompts for AI
- Default platform selection

### 4. Content Review
- Side-by-side platform previews
- Inline editing
- Approve/reject workflow
- Character count display

### 5. Content Calendar
- List view of scheduled content
- Calendar view by month
- Status tracking

---

## API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/campaigns` | GET | List user's campaigns |
| `/api/campaigns` | POST | Create campaign + generate content |
| `/api/brands` | GET | List user's brands |
| `/api/brands` | POST | Create new brand |
| `/api/content` | PATCH | Update content (edit, approve, schedule) |
| `/api/generate/text` | POST | Generate text for single platform |
| `/api/generate/image` | POST | Generate image for topic |

---

## Current State (Prototype)

### What's Working
- Full UI for all pages
- Mock data for testing without backend
- Build passes, deploys successfully
- Graceful handling of missing env vars

### What Needs Configuration
1. Supabase project + env vars
2. Claude API key
3. OpenAI API key
4. Run database schema

### Mock Data Locations
- Dashboard: `src/app/(app)/dashboard/page.tsx` (lines 8-37)
- Campaign Detail: `src/app/(app)/campaigns/[id]/page.tsx` (lines 15-108)
- Brands: `src/app/(app)/brands/page.tsx` (lines 20-47)
- Calendar: `src/app/(app)/calendar/page.tsx` (lines 13-46)

---

## Future Enhancements

### Phase 2 (Post-Prototype)
- [ ] Direct social media publishing APIs
- [ ] Team collaboration / multi-user roles
- [ ] Video/animation generation
- [ ] Advanced calendar (drag-drop scheduling)
- [ ] Usage tracking/billing
- [ ] MCP server exposure

### Integrations to Consider
- Buffer/Hootsuite for publishing
- Google ImageGen as alternative to DALL-E
- Multiple AI models (GPT, Gemini, DeepSeek)

---

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Deploy to Netlify
npx netlify deploy --prod
```

---

## Key Files to Know

| File | What it does |
|------|--------------|
| `src/lib/ai/orchestrator.ts` | Coordinates full content generation |
| `src/lib/ai/prompts.ts` | Platform-specific prompt templates |
| `src/app/api/campaigns/route.ts` | Main campaign creation + generation |
| `src/components/content/ContentPreview.tsx` | Content display/edit component |
| `src/lib/supabase/middleware.ts` | Auth protection for routes |
| `supabase-schema.sql` | Complete database schema with RLS |

---

## Troubleshooting

### "Supabase URL/Key required" error
- Env vars not set - add them to `.env.local` or Netlify

### Content not generating
- Check API keys are valid
- Check Netlify function logs for errors

### Auth not working
- Ensure Supabase project is configured
- Check RLS policies are enabled
- Verify redirect URLs in Supabase Auth settings

---

## Contact / Resources

- **Supabase Docs:** https://supabase.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Claude API:** https://docs.anthropic.com
- **OpenAI API:** https://platform.openai.com/docs

---

*Document generated: December 10, 2024*
