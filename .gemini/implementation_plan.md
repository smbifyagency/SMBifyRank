# SMBifyRank Technical Refactor Implementation Plan

## Executive Summary

Based on the "A to Z Technical Refactor Guide" and analysis of the current codebase, this plan outlines the step-by-step implementation to transform SMBifyRank from an HTML-centric system to a JSON-first CMS architecture.

---

## Current State Analysis

### What's Working Well ✅
1. **TypeScript Types Already Exist**: `PageSection`, `Page`, and `Website` interfaces in `types.ts` already define structured JSON schemas
2. **Database Schema Ready**: `site_config` table already has `pages_data` (JSONB), `blog_data` (JSONB), `seo_data` (JSONB)
3. **Component-Based Rendering**: Templates in `generator/templates.ts` already take structured data and render HTML
4. **Section Types Defined**: `SectionType` enum covers all section types (hero, services-grid, cta, etc.)

### Current Problems ❌
1. **HTML Editing in iframe**: Editor modifies DOM directly via `contentEditable` and `postMessage`
2. **Custom Content Stored as Strings**: `customContent` and `customImages` are flat `Record<string, string>` maps
3. **AI Generates Text Blobs**: AI returns raw text content, not structured JSON
4. **No Section Locking**: No mechanism to prevent AI from overwriting user edits

---

## Refactor Execution Plan

### Phase 1: Enhanced JSON Content Layer (Priority: HIGH)

#### Step 1.1: Define Strict Section Schemas

**File: `src/lib/types.ts`**

Add typed content schemas for each section type:

```typescript
// Section content schemas - each section type has a defined structure
export interface HeroSectionContent {
  headline: string;
  subheadline: string;
  ctaPrimary?: { text: string; link: string };
  ctaSecondary?: { text: string; link: string };
  backgroundImage?: string;
  userEdited?: boolean; // Lock flag for AI
}

export interface ServicesSectionContent {
  title: string;
  subtitle?: string;
  services: Array<{
    id: string;
    name: string;
    description: string;
    icon?: string;
    link?: string;
  }>;
  userEdited?: boolean;
}

export interface AboutSectionContent {
  title: string;
  body: string; // HTML/Markdown content
  image?: string;
  features?: Array<{ icon: string; text: string }>;
  userEdited?: boolean;
}

export interface ContactSectionContent {
  title: string;
  subtitle?: string;
  phone?: string;
  email?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  showMap?: boolean;
  userEdited?: boolean;
}

export interface CTASectionContent {
  headline: string;
  subheadline?: string;
  buttonText: string;
  buttonLink: string;
  userEdited?: boolean;
}

export interface TestimonialsSectionContent {
  title: string;
  testimonials: Array<{
    id: string;
    name: string;
    company?: string;
    quote: string;
    rating?: number;
    image?: string;
  }>;
  userEdited?: boolean;
}

export interface GallerySectionContent {
  title?: string;
  images: Array<{
    id: string;
    src: string;
    alt: string;
    caption?: string;
  }>;
  userEdited?: boolean;
}

export interface FAQSectionContent {
  title: string;
  faqs: Array<{
    id: string;
    question: string;
    answer: string;
  }>;
  userEdited?: boolean;
}

export interface TextBlockSectionContent {
  content: string; // Rich text/HTML
  userEdited?: boolean;
}

// Union type for section content
export type SectionContent = 
  | HeroSectionContent
  | ServicesSectionContent
  | AboutSectionContent
  | ContactSectionContent
  | CTASectionContent
  | TestimonialsSectionContent
  | GallerySectionContent
  | FAQSectionContent
  | TextBlockSectionContent;

// Updated PageSection interface
export interface PageSection {
  id: string;
  type: SectionType;
  content: SectionContent;
  order: number;
  userEdited?: boolean; // Prevents AI overwrite
  lastEditedAt?: string;
  lastEditedBy?: 'user' | 'ai';
}
```

---

### Phase 2: Section-Based JSON Editor

#### Step 2.1: Create Section Editor Components

**Files to Create:**
- `src/components/sections/HeroEditor.tsx`
- `src/components/sections/ServicesEditor.tsx`
- `src/components/sections/AboutEditor.tsx`
- `src/components/sections/ContactEditor.tsx`
- `src/components/sections/CTAEditor.tsx`
- `src/components/sections/TestimonialsEditor.tsx`
- `src/components/sections/GalleryEditor.tsx`
- `src/components/sections/FAQEditor.tsx`
- `src/components/sections/TextBlockEditor.tsx`

**Example: HeroEditor.tsx**
```tsx
interface HeroEditorProps {
  content: HeroSectionContent;
  onChange: (content: HeroSectionContent) => void;
}

export function HeroEditor({ content, onChange }: HeroEditorProps) {
  return (
    <div className={styles.sectionEditor}>
      <label>Headline</label>
      <input 
        value={content.headline}
        onChange={(e) => onChange({ ...content, headline: e.target.value, userEdited: true })}
      />
      
      <label>Subheadline</label>
      <textarea 
        value={content.subheadline}
        onChange={(e) => onChange({ ...content, subheadline: e.target.value, userEdited: true })}
      />
      
      <label>Primary CTA Text</label>
      <input 
        value={content.ctaPrimary?.text || ''}
        onChange={(e) => onChange({ 
          ...content, 
          ctaPrimary: { ...content.ctaPrimary, text: e.target.value },
          userEdited: true 
        })}
      />
      {/* ... more fields */}
    </div>
  );
}
```

#### Step 2.2: Refactor Editor Page

**File: `src/app/editor/[id]/page.tsx`**

Replace iframe-based HTML editing with panel-based JSON editing:

```tsx
// Current (problematic):
// - Edits happen in iframe via postMessage
// - DOM mutations stored as customContent strings

// New approach:
// - Section list in left panel
// - Section editor form in right panel  
// - Preview iframe is READ-ONLY
// - All changes go through updateSection()

const updateSection = (sectionId: string, content: SectionContent) => {
  setWebsite(prev => ({
    ...prev,
    pages: prev.pages.map(page => 
      page.id === currentPage?.id 
        ? {
            ...page,
            content: page.content.map(section =>
              section.id === sectionId
                ? { ...section, content, userEdited: true, lastEditedAt: new Date().toISOString() }
                : section
            )
          }
        : page
    )
  }));
  
  // Trigger preview refresh
  refreshPreview();
};
```

---

### Phase 3: AI Integration Refactor

#### Step 3.1: AI Returns JSON Only

**File: `src/lib/ai.ts`**

Update prompts to return structured JSON:

```typescript
export interface AIGeneratedSection {
  type: SectionType;
  content: SectionContent;
}

export async function generateSectionContent(
  params: {
    sectionType: SectionType;
    businessName: string;
    industry: string;
    keywords?: string[];
    existingContent?: SectionContent; // For regeneration
  }
): Promise<SectionContent> {
  
  const prompt = `Generate content for a ${params.sectionType} section for a ${params.industry} business called "${params.businessName}".

Return ONLY valid JSON matching this schema:
${getSchemaForSectionType(params.sectionType)}

Do not include any explanation, just the JSON.`;

  const response = await callOpenAI(apiKey, prompt);
  return JSON.parse(response) as SectionContent;
}

// AI can only regenerate unlocked sections
export async function regenerateSection(
  section: PageSection,
  businessContext: BusinessContext
): Promise<PageSection | null> {
  
  if (section.userEdited) {
    console.log(`Section ${section.id} is locked by user - skipping AI regeneration`);
    return null;
  }
  
  const newContent = await generateSectionContent({
    sectionType: section.type,
    ...businessContext
  });
  
  return {
    ...section,
    content: newContent,
    lastEditedAt: new Date().toISOString(),
    lastEditedBy: 'ai'
  };
}
```

---

### Phase 4: Publishing Pipeline

#### Step 4.1: Stateless HTML Generation

**File: `src/lib/generator/sectionRenderer.ts` (NEW)**

Create pure functions that render sections from JSON:

```typescript
export function renderSection(section: PageSection, website: Website): string {
  switch (section.type) {
    case 'hero':
      return renderHeroSection(section.content as HeroSectionContent, website);
    case 'services-grid':
      return renderServicesSection(section.content as ServicesSectionContent, website);
    case 'about-intro':
      return renderAboutSection(section.content as AboutSectionContent, website);
    // ... all section types
  }
}

function renderHeroSection(content: HeroSectionContent, website: Website): string {
  return `
    <section class="hero">
      <div class="container">
        <h1>${escapeHtml(content.headline)}</h1>
        <p>${escapeHtml(content.subheadline)}</p>
        ${content.ctaPrimary ? `
          <a href="${content.ctaPrimary.link}" class="btn btn-primary">
            ${escapeHtml(content.ctaPrimary.text)}
          </a>
        ` : ''}
      </div>
    </section>
  `;
}
```

#### Step 4.2: Clean Publishing Flow

```
┌─────────────────┐
│  User clicks    │
│   "Publish"     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Load website   │
│  JSON from DB   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  For each page: │
│  renderPage()   │
│  → Static HTML  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Bundle files:  │
│  HTML, CSS, JS  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Deploy to      │
│  Netlify/Vercel │
└────────┴────────┘

❌ NO DATABASE WRITES DURING PUBLISH
✅ Publish is READ-ONLY from DB
```

---

## Implementation Order

### Phase 1: Foundation ✅ COMPLETE (Dec 24, 2024)
- [x] Add section content type definitions to `types.ts`
- [x] Create `sectionHelpers.ts` with type guards and utilities
- [x] Add `userEdited` flags to PageSection interface
- [x] Create `sectionRenderer.ts` for pure JSON→HTML rendering

### Phase 2: Editor Components ✅ COMPLETE (Dec 24, 2024)
- [x] Create section editor components (Hero, Services, About, Contact, CTA, Testimonials, FAQ, Features, TextBlock, Generic)
- [x] Create `SectionEditor.tsx` router component
- [x] Add section locking UI (🔒 badge, unlock button)
- [x] Add `SectionEditor.module.css` with premium styling

### Phase 3: AI JSON Generation ✅ COMPLETE (Dec 24, 2024)
- [x] Create `aiSections.ts` for JSON generation
- [x] Add section-specific prompts
- [x] Use OpenAI JSON mode (response_format: json_object)
- [x] Implement `regenerateSection()` with lock check
- [x] Add fallback content for no-API scenarios

### Phase 4: Editor Integration (NEXT)
- [ ] Integrate SectionEditor into main editor page
- [ ] Make iframe preview read-only
- [ ] Add "Regenerate with AI" button per section
- [ ] Connect section updates to auto-save

### Phase 5: Polish & Deploy
- [ ] Testing all section types
- [ ] Migration script for existing websites
- [ ] Documentation update

---

## Database Migrations Required

```sql
-- Add userEdited tracking to pages_data sections
-- This is done at application level since pages_data is JSONB

-- Add publish_history table for audit trail
CREATE TABLE IF NOT EXISTS public.publish_history (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  site_id uuid REFERENCES public.sites(id) ON DELETE CASCADE,
  published_at timestamptz DEFAULT now(),
  pages_snapshot jsonb NOT NULL, -- Snapshot of pages at publish time
  deployed_url text,
  status text DEFAULT 'success'
);
```

---

## Success Criteria

After refactor:
1. ✅ Editor edits JSON fields, not DOM
2. ✅ Preview is rendered from JSON (read-only)
3. ✅ AI returns JSON structures, not HTML/text
4. ✅ User-edited sections are locked from AI overwrite
5. ✅ Publishing reads JSON → generates HTML → deploys (no writes)
6. ✅ All content changes are auditable with timestamps

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/lib/types.ts` | Add section content schemas |
| `src/app/editor/[id]/page.tsx` | Refactor to panel-based JSON editing |
| `src/lib/ai.ts` | Return JSON instead of text |
| `src/lib/generator/templates.ts` | Ensure pure rendering from JSON |
| `src/lib/export.ts` | Read-only publish pipeline |
| `src/components/sections/*` | New section editor components |

---

## Questions for User

1. **Should we migrate existing websites?** Existing sites have `customContent` as string maps. We can either:
   - Auto-migrate to new structure
   - Keep old data, new structure for new sites only

2. **Preview mode preference?**
   - Live preview while editing (may be slower)
   - Manual "Preview" button click

3. **AI regeneration scope?**
   - Per-section regeneration only
   - Full page regeneration (with lock warnings)

---

*Plan created: December 24, 2024*
*Based on: SMBifyRank A to Z Technical Refactor Guide*
