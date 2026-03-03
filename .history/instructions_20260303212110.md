You are redesigning the complete UI of **Bookish**, a React SPA for discovering and
tracking books via OpenLibrary + Firebase. Redesign every component and page listed
below with a cohesive, production-grade aesthetic.

---

## DESIGN DIRECTION: "LITERARY EDITORIAL"

Aesthetic: A warm, editorial magazine-meets-independent-bookshop feel.
Think: Monocle Magazine × The New Yorker × a cozy library at golden hour.

Palette:
  --ink:        #1C1612      /*near-black warm ink */
  --paper:      #F5F0E8      /* aged parchment background */
  --cream:      #EDE6D6      /* card surfaces */
  --amber:      #C9813A      /* primary accent — warm amber */
  --rust:       #9B3D2B      /* secondary accent — deep rust red */
  --sage:       #4A6741      /* tertiary — muted sage green */
  --muted:      #8C7B6B      /* body text, secondary labels */
  --border:     #D9CEBB      /* subtle warm dividers*/

Typography:

- Display/Headings: 'Playfair Display' (Google Fonts) — serif, editorial weight
- Body/UI: 'DM Sans' (Google Fonts) — clean, modern humanist sans
- Accent labels/tags: 'DM Mono' — for metadata, ISBNs, page counts
  Import: @import url('<https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400&display=swap>');

Visual Language:

- Subtle paper texture via CSS noise (use SVG feTurbulence or ::before pseudo-elements)
- Warm drop shadows: box-shadow: 4px 6px 20px rgba(28,22,18,0.10)
- Border-radius: tight — 6px for cards, 3px for inputs/buttons
- Ruled-line underlines on section headings (amber bottom-border)
- Book spine color strips on the left edge of BookCards
- Generous whitespace, asymmetric section padding
- Hover animations: subtle lift + shadow deepen (transform: translateY(-3px))

---

## GLOBAL STYLES — index.css + App.css

- Set body background to var(--paper) with a faint noise texture overlay
- Apply Playfair Display to all h1–h3, DM Sans to body/p/labels
- Define all CSS variables in :root
- Add a global ::selection with amber highlight
- Smooth scroll behavior, antialiased text rendering
- Remove all default blue link colors; replace with var(--amber) underlines

---

## COMPONENT REDESIGNS

### Navbar.jsx

- Full-width, sticky top bar
- Left: "Bookish" wordmark in Playfair Display italic, amber color, ~28px
- Center: navigation links (Home, My List, Profile) in DM Sans 500, small caps style
- Right: search icon + avatar/login button
- Background: var(--ink) with var(--amber) left border-bottom accent line (3px)
- Text: var(--paper)
- On scroll: add a warm blur backdrop-filter + reduced opacity
- Mobile: collapse to hamburger with slide-down drawer

### SearchBar.jsx

- Full-width pill-shaped input on Home page, centered in a hero area
- Background: var(--cream), border: 1.5px solid var(--border)
- Placeholder: "Search for a title, author, or ISBN..." in DM Sans light italic
- Left icon: a small open-book SVG icon in var(--muted)
- Submit button: var(--amber) filled, "Search" in DM Sans 500, no border-radius on right (flush with input)
- Focus state: border-color transitions to var(--amber), soft amber glow shadow
- Search results dropdown (if any): paper-bg card, each result has a tiny book cover thumbnail

### BookCard.jsx

- Tall portrait card (aspect ratio ~2:3, like a book cover)
- Top: book cover image (fill), fallback = colored spine pattern with title initials
- LEFT edge: 8px colored strip (rotate through amber/rust/sage based on genre or index)
- Bottom panel: var(--cream) bg
  - Title in Playfair Display 600, 15px, 2-line clamp
  - Author in DM Sans 400 var(--muted), 12px
  - Small metadata row: year + page count in DM Mono 11px
- Hover: card lifts (translateY -4px), shadow deepens, cover image scales 1.04
- "Add to List" button appears on hover overlay: semi-transparent ink bg, amber text
- Already-in-list state: sage green checkmark badge top-right corner

### BookList.jsx

- Section heading: Playfair Display italic "Your Reading List" with amber ruled underline
- Grid layout: responsive — 2 cols mobile, 3 tablet, 4–5 desktop
- Empty state: centered illustration (open book SVG outline), headline "Your shelf is empty",
  subtext "Start searching to add books", amber CTA button
- Subtle entrance animation: cards stagger-fade in with 60ms delays (CSS animation-delay)

### Card.jsx (generic container)

- Background: var(--cream)
- Border: 1px solid var(--border)
- Box-shadow: 4px 6px 20px rgba(28,22,18,0.08)
- Padding: 24px
- Border-radius: 6px
- Optional header slot with Playfair Display title + amber bottom rule

### Button.jsx

- Variants:
  PRIMARY: bg var(--amber), text var(--ink), DM Sans 500, px-6 py-2.5, border-radius 3px
           hover: bg var(--rust), transition 200ms
  SECONDARY: bg transparent, border 1.5px var(--amber), text var(--amber)
             hover: bg amber at 10% opacity
  GHOST: no border, text var(--muted), hover: text var(--ink)
  DANGER: bg var(--rust), text white
- All buttons: letter-spacing 0.02em, no default outline, custom focus ring in amber

### SkeletonCard.jsx

- Match BookCard dimensions exactly
- Animate with a warm shimmer (gradient sweep left-to-right)
- Use rgba(201,129,58,0.08) → rgba(201,129,58,0.18) for the shimmer gradient
- Spine color strip: static warm gray placeholder

---

## PAGE REDESIGNS

### home.js

Layout:

  1. HERO SECTION — full viewport height
     - Background: var(--ink) with a subtle warm radial gradient and noise texture
     - Large Playfair Display headline (italic): "Find your next great read."
     - Subheadline in DM Sans 300, var(--muted-light)
     - SearchBar centered below
     - Faint decorative: scattered book-spine rectangles in background (CSS only,
       rotated slightly, low opacity)
  2. TRENDING / FEATURED SECTION
     - Paper-bg section, "Trending Now" heading with amber underline
     - Horizontal scroll row of BookCards on mobile, grid on desktop
  3. READING LIST PREVIEW
     - If user has books: "Continue Reading" section with horizontal BookCard row
     - If empty: editorial empty state with quote about reading

### book.js (Book Detail Page)

Layout: Two-column on desktop (40/60 split), single column mobile
  LEFT COLUMN:
    - Large book cover image with warm drop shadow and slight rotation (2deg)
    - Below cover: Add to List / Remove button (full width)
    - Metadata card: Publisher, Year, Pages, ISBN in DM Mono grid
  RIGHT COLUMN:
    - Breadcrumb: "Home › Search Results › Book Title" in DM Mono muted
    - Title: Playfair Display 700, 36px, var(--ink)
    - Author: DM Sans 400 18px, var(--amber), with small author icon
    - Divider: amber rule line
    - Description: DM Sans 300 16px, 1.8 line-height, var(--ink)
    - Subject tags: small pill badges, var(--cream) bg, var(--amber) text, DM Mono
  Background: var(--paper) with faint diagonal ruled lines (CSS repeating-linear-gradient)

### read.js (Reading List Page)

- Page header: full-width ink-colored banner, "My Bookshelf" in Playfair Display white
    with a faint open-book watermark behind it
- Filter/sort bar below header: "All | Reading | Finished | Want to Read"
    pill tab switcher in amber
- Book grid using BookCard components
- Progress tracker per book (if applicable): thin amber progress bar on card bottom
- Bulk actions toolbar (select all, remove): appears when cards are checked

### profile.js

- Top section: ink-colored card with user avatar (circular, amber ring border),
    display name in Playfair Display, email in DM Mono
- Stats row: "Books Saved · X" | "Reading · X" | "Finished · X"
    each in a cream stat card with amber accent number
- Settings section: list of options (Sign Out, Notifications, etc.) in clean
    DM Sans rows with chevron icons, bordered by var(--border) dividers
- Sign out button: GHOST variant, rust red text

### RootLayout.js

- Wrap all pages with: Navbar at top, main content area with min-height calc,
    Footer at bottom
- Footer: ink background, centered "Bookish · Built with OpenLibrary" in DM Mono
    muted, amber dot separator

---

## MICRO-INTERACTIONS & ANIMATIONS

- All interactive elements: transition: all 200ms ease
- BookCard hover: transform translateY(-4px) + shadow
- Button press: transform scale(0.97) on :active
- Page transitions: fade-in (opacity 0→1, 300ms) using React useEffect + CSS class toggle
- Skeleton shimmer: @keyframes shimmer with background-position animation
- Navbar scroll: addEventListener scroll → add .scrolled class → backdrop-filter blur

---

## RESPONSIVE BREAKPOINTS

  Mobile:  < 640px  — 1 col grid, stacked layouts, hamburger nav
  Tablet:  640–1024px — 2–3 col grid
  Desktop: > 1024px — full layout, side-by-side columns

---

## DO NOT

- Use purple gradients, blue accents, or white/gray cold palettes
- Use Inter, Roboto, or system-ui fonts
- Use Material UI or Bootstrap component defaults
- Add excessive rounded corners (keep it editorial, not bubbly)
- Use generic stock placeholder patterns

## MUST PRESERVE

- All existing prop interfaces and component names
- Firebase auth logic and state
- OpenLibrary API calls and data shapes
- React Router structure (home, /book/:id, /read, /profile)
