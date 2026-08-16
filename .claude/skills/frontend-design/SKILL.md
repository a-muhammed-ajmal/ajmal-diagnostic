--- 
name: frontend-design 
description: Designs and builds production-grade, mobile-first frontend interfaces for Muhammed Ajmal Consulting. Use websites, landing pages, dashboards, portals, internal tools, web applications, UI components, frontend redesigns, and interface reviews. Follow the Muhammed Ajmal Consulting brand guidelines as the visual source of truth. Default to a compact GitHub-inspired information architecture, Segoe UI typography, Violet + Teal brand colors, Next.js, TypeScript, Tailwind CSS v4, Supabase, and Vercel. 
--- 
 
# Frontend Design 
 
## Purpose 
 
Create production-grade frontend interfaces for Muhammed Ajmal Consulting that feel: 
 
- Structured 
- Compact 
- Professional 
- Fast 
- Scannable 
- Operational 
- Trustworthy 
- Mobile-first 
- Accessible 
- Conversion-aware 
 
The interface should feel like a serious business operating system rather than a generic consulting website or AI-generated SaaS template. 
 
Optimize for: 
 
**CLARITY → CONTROL → ACTION** 
 
Every design decision must improve at least one of: 
 
- Hierarchy 
- Navigation 
- Comprehension 
- Usability 
- Decision-making 
- Conversion 
- Execution speed 
- Information density 
 
Do not add visual complexity merely to make the interface look designed. 
 
--- 
 
# Source of Truth 
 
When this skill is used for Muhammed Ajmal Consulting, also apply the `brand-guidelines` skill. 
 
The brand guidelines are authoritative for: 
 
- Brand colors 
- Typography 
- Logo usage 
- Spacing 
- Border radius 
- Brand visual treatment 
- Light and dark surfaces 
- Brand accessibility requirements 
 
Do not invent alternative brand values when an approved value exists. 
 
If this skill conflicts with the brand guidelines, the brand guidelines win. 
 
--- 
 
# Default Technical Stack 
 
Unless the user explicitly specifies otherwise, use: 
 
- Next.js 
- React 
- TypeScript 
- Tailwind CSS v4 
- Supabase 
- Vercel 
 
Prefer: 
 
- Server Components where appropriate 
- Progressive enhancement 
- Semantic HTML 
- Native browser capabilities before unnecessary libraries 
- Small reusable components 
- Explicit TypeScript types 
- Accessible component primitives 
- Minimal client-side JavaScript 
- Performance-conscious rendering 
 
Do not introduce dependencies without a clear functional reason. 
 
--- 
 
# Design Direction 
 
Use a GitHub-inspired functional design philosophy. 
 
This means: 
 
- High information density 
- Strong hierarchy 
- Compact controls 
- Clear borders 
- Organized navigation 
- Structured lists 
- Practical tabs 
- Explicit states 
- Efficient mobile navigation 
- Minimal decorative whitespace 
- Content-first composition 
 
Do not copy: 
 
- GitHub trademarks 
- GitHub logos 
- Proprietary assets 
- Exact GitHub page compositions 
- Exact proprietary components 
 
Borrow the design principles, not the identity. 
 
--- 
 
# Core Design Philosophy 
 
## 1. Function before decoration 
 
Start with: 
 
1. User task 
2. Information 
3. Hierarchy 
4. Navigation 
5. Interaction 
6. State 
7. Visual treatment 
 
Never reverse this order. 
 
Do not begin with gradients, illustrations, animations, cards, or visual effects. 
 
--- 
 
## 2. Density before emptiness 
 
Prefer structured density over oversized empty spaces. 
 
Use: 
 
- Borders 
- Dividers 
- Section headers 
- Lists 
- Tabs 
- Tables 
- Compact cards 
- Metadata 
- Grouped controls 
 
before adding large vertical gaps. 
 
The interface should make productive use of the screen. 
 
Density must never reduce readability or accessibility. 
 
--- 
 
## 3. Hierarchy before color 
 
Establish hierarchy using: 
 
1. Position 
2. Grouping 
3. Typography 
4. Weight 
5. Size 
6. Borders 
7. Spacing 
8. Color 
 
Do not use additional colors to compensate for weak hierarchy. 
 
--- 
 
## 4. One dominant action 
 
Each page or task state should have one clearly dominant primary action. 
 
Examples: 
 
- Book a consultation 
- Start assessment 
- Save changes 
- Generate report 
- Add process 
- Create KPI 
 
Secondary actions must remain visually secondary. 
 
Do not place multiple competing primary CTAs inside the same decision area. 
 
--- 
 
# Pre-Design Reasoning 
 
Before coding or designing a page, resolve the following. 
 
## Purpose 
 
State the user's main task in one sentence. 
 
Example: 
 
> Help an SME founder identify operational bottlenecks and begin a structured assessment. 
 
--- 
 
## Business outcome 
 
State the intended observable outcome. 
 
Example: 
 
> Convert qualified visitors into diagnostic consultation requests. 
 
--- 
 
## Audience 
 
Use the audience supplied by the user. 
 
If none is provided for Muhammed Ajmal Consulting, default to: 
 
- Founder-led SMEs 
- UAE 
- GCC 
- South Asia 
 
--- 
 
## Primary action 
 
Identify exactly one primary action for the page or current task state. 
 
--- 
 
## Information hierarchy 
 
Classify supplied content as: 
 
### Primary 
Required to understand the page or complete the main task. 
 
### Secondary 
Helps evaluate, compare, or make a decision. 
 
### Supporting 
Context, metadata, evidence, explanations, or references. 
 
Do this before choosing the layout. 
 
--- 
 
## Evidence validation 
 
Never invent: 
 
- Testimonials 
- Client names 
- Client logos 
- Revenue numbers 
- Business metrics 
- Certifications 
- Awards 
- Partner relationships 
- Case-study results 
- Customer counts 
- Performance improvements 
- Geographic presence 
- Legal claims 
 
If required information is missing, use: 
 
`[TO CONFIRM]` 
 
Do not manufacture realistic placeholders that could be mistaken for real business evidence. 
 
--- 
 
# Mobile-First Rule 
 
Design the **360px viewport first**. 
 
Desktop is an expansion of the mobile architecture, not a separate design. 
 
Always consider 320px overflow even though 360px is the primary baseline. 
 
--- 
 
# Responsive Breakpoints 
 
Use: 
 
```txt 
Base: 0px 
sm:   480px / 30rem 
md:   768px / 48rem 
lg:   1024px / 64rem 
xl:   1280px / 80rem 
2xl:  1536px / 96rem 

 

Page Padding 

Use: 

360px:  16px 
480px:  24px 
768px:  32px 
1024px: 48px 
1280px: 64px 

Standard page content should normally not exceed: 

1200px 

 

Spacing System 

Use the approved 8px spacing system. 

Approved values: 

4px 
8px 
12px 
16px 
24px 
32px 
40px 
48px 
64px 
80px 
96px 

Use 4px only as an intentional half-step. 

Recommended relationships: 

Icon → text:                  4–8px 
Tightly related controls:    8–12px 
Standard content groups:     16px 
Major mobile modules:        24–32px 
Large structural separation: 40–64px when justified 

Do not create 80–120px empty gaps simply to make a page feel premium. 

 

Typography 

Use: 

font-family: 
  "Segoe UI", 
  -apple-system, 
  BlinkMacSystemFont, 
  "Helvetica Neue", 
  Arial, 
  sans-serif; 

Do not introduce decorative fonts. 

Do not use Google Fonts merely to add personality. 

Do not bundle proprietary Segoe UI font files. 

Allow the system fallback stack to operate naturally. 

 

Typography Scale 

At the 360px baseline: 

H1 
24px / 1.500rem 
Weight: 600 
Line-height: 30px / 1.25 
 
H2 
20px / 1.250rem 
Weight: 600 
Line-height: 25px / 1.25 
 
H3 
16px / 1.000rem 
Weight: 600 
Line-height: 20px / 1.25 
 
Lead 
18px / 1.125rem 
Weight: 400 
Line-height: 27px / 1.50 
 
Body prose 
16px / 1.000rem 
Weight: 400 
Line-height: 24px / 1.50 
 
Compact UI 
14px / 0.875rem 
Weight: 400 or 500 
Line-height: 20px / 1.43 
 
Metadata 
12px / 0.750rem 
Weight: 400 
Line-height: 16px / 1.33 
 
Buttons 
14px / 0.875rem 
Weight: 500 or 600 
Line-height: 20px / 1.43 

Never reduce long-form mobile body prose below 16px. 

 

Font Weight Rules 

Use: 

400 → body copy 
500 → buttons, tabs, compact navigation, emphasized UI 
600 → headings, selected navigation, key metrics, important labels 
700 → exceptional numerical emphasis only 

Do not use faux bold. 

Avoid using more than four font weights on one page. 

 

Text Rules 

Use: 

Sentence case for headings 

Sentence case for buttons 

Sentence case for navigation 

Sentence case for labels 

Active voice 

Concrete operational language 

Left-aligned body copy 

Avoid: 

Full-sentence ALL CAPS 

Justified text 

Unsupported superlatives 

Vague AI terminology 

Unnecessary jargon 

Generic SaaS language 

Prefer words such as: 

Revenue 

Margin 

Capacity 

Process 

Workflow 

KPI 

Accountability 

Execution 

System 

Automation 

Data 

Decision 

Keep normal prose between: 

60–75 characters per line 

Target: 

≈68 characters 

Use one H1 per page. 

Do not skip heading levels. 

Keep H1 to approximately 12 words or fewer where possible. 

Keep primary button labels to approximately four words or fewer. 

 

Brand Color System 

Use approved brand tokens. 

Core 

Brand Violet 
#5B21B6 
 
Deep Violet 
#3B167A 
 
Ink 
#111827 
 
White 
#FFFFFF 
 
Canvas 
#F8FAFC 
 
Surface 
#F1F5F9 
 
Border 
#D0D7DE 
 
Muted 
#475569 

Secondary / Dark 

Teal 
#0F766E 
 
Bright Teal 
#0D9488 
 
Dark Surface 
#0D1117 
 
Dark Raised 
#161B22 
 
Dark Border 
#30363D 

 

Color Roles 

Map colors semantically. 

Primary action 
→ Brand Violet 
 
Primary hover / pressed 
→ Deep Violet 
 
Secondary action 
→ Teal 
 
Primary text 
→ Ink 
 
Secondary text 
→ Muted 
 
Primary light background 
→ White / Canvas 
 
Secondary light surface 
→ Surface 
 
Light border 
→ Border 
 
Primary dark background 
→ Dark Surface 
 
Raised dark surface 
→ Dark Raised 
 
Dark boundary 
→ Dark Border 

Do not substitute default Tailwind colors where an approved brand token exists. 

 

Violet + Teal Rule 

Violet is dominant. 

Teal supports the system. 

Do not distribute Violet and Teal equally across every component. 

Use Violet primarily for: 

Main CTA 

Selected primary action 

Important brand moments 

Key navigation emphasis 

Use Teal primarily for: 

Supporting states 

Secondary active controls 

Data highlights 

System indicators 

Complementary brand moments 

Do not make Violet automatically mean error. 

Do not make Teal automatically mean success. 

Use separate semantic colors for: 

Success 

Warning 

Error 

Information 

 

Gradients 

Do not use gradients as the default brand treatment. 

Especially avoid: 

Violet-to-Teal hero gradients 

Purple AI gradients 

Gradient text everywhere 

Gradient borders 

Gradient card backgrounds 

A gradient may be used only when the user explicitly requests it or when it has a clear information/design purpose. 

The logo must never depend on a gradient for recognition. 

 

Borders 

Use borders as a primary structural tool. 

Standard light border: 

#D0D7DE 

Standard dark border: 

#30363D 

Default: 

1px 

Prefer boundaries and dividers over excessive whitespace. 

Avoid overly faint borders that disappear at normal display brightness. 

 

Border Radius 

Use: 

6px 
→ buttons 
→ inputs 
→ selects 
→ dropdowns 
→ compact controls 
→ menus 
 
8px 
→ cards 
→ panels 
→ standard containers 
 
12px 
→ major visual containers 
→ app-icon presentations 

Do not use standard 20px, 24px, or 32px SaaS-card radii. 

Do not make everything pill-shaped. 

Reserve pill geometry for: 

Tags 

Badges 

Status labels 

Compact filters 

Segmented controls 

 

Surfaces 

Default to flat, structured surfaces. 

Preferred surfaces: 

White 

Canvas 

Surface 

Dark Surface 

Dark Raised 

Avoid by default: 

Glassmorphism 

Frosted panels 

Glow effects 

Gradient meshes 

Noise 

Grain 

Floating translucent cards 

Decorative blur clouds 

 

Logo 

Use the approved Muhammed Ajmal Consulting symbol. 

The logo direction is: 

Scalable System / Connected Foundation 

Preserve: 

One central core 

Three equally important outer nodes 

Three rounded connecting arc segments 

Circular balance 

Rotational balance 

The core represents the business operating core. 

The outer nodes represent integrated operating system pillars. 

Do not permanently assign public pillar names unless the user explicitly approves them. 

Do not replace the mark with: 

MA 

A 

AJ 

Initials 

Arrows 

Gears 

Brains 

Circuit-board motifs 

Infinity symbols 

AI sparkles 

The symbol may appear independently at small sizes. 

Do not force the full company name into: 

Favicons 

Compact mobile icons 

App icons 

Do not use the logo repeatedly as decorative background material. 

 

Layout Architecture 

Mobile 

Below 768px: 

Prefer one primary content column 

Avoid side-by-side content unless essential 

Keep actions reachable 

Collapse secondary navigation intelligently 

Avoid horizontal scrolling 

Make tables responsive intentionally 

Keep important destinations within one menu interaction 

 

Desktop 

Expand the mobile information architecture. 

Use additional columns only when they improve: 

Comparison 

Navigation 

Scanning 

Data visibility 

Task efficiency 

Do not spread content across the viewport merely because more width exists. 

 

Header 

Use a compact, bordered header. 

Mobile header height: 

48–56px 

Requirements: 

Clear logo or symbol 

Clear navigation state 

Minimum 44×44px menu trigger 

Accessible menu control 

Visible focus state 

Make the header sticky only when persistent navigation provides meaningful task value. 

Do not make sticky headers unnecessarily tall. 

 

Navigation 

Navigation should be: 

Compact 

Predictable 

Clearly grouped 

Keyboard accessible 

Easy to scan 

Easy to operate on mobile 

Use approximately: 

14px 
500–600 weight 

Clearly expose the current location. 

Do not communicate the active state through color alone. 

Use one or more of: 

Weight 

Border 

Background 

Icon 

Position 

Marker 

Important destinations should normally be reachable within one mobile menu interaction. 

 

Hero 

A standard hero should contain: 

One H1 

One supporting paragraph 

One primary CTA 

Maximum one secondary CTA 

Do not automatically add: 

Decorative dashboard mockups 

Glowing objects 

Floating cards 

AI illustrations 

Giant gradients 

Random metrics 

Logo clouds 

Use evidence only when supplied or confirmed. 

 

Buttons 

Primary 

Minimum: 

Height: 44px 
Text: 14px 
Weight: 500 or 600 
Radius: 6px 

Use Brand Violet. 

 

Secondary 

Minimum: 

Height: 44px 
Text: 14px 
Radius: 6px 
Border: 1px visible 

Use Teal or neutral styling according to hierarchy. 

 

Icon button 

Minimum touch target: 

44 × 44px 

Every icon button must have an accessible name. 

Do not rely on icons whose meaning is unclear without labels or tooltips. 

 

Forms 

Inputs and controls must be operational, compact, and accessible. 

Input 

Minimum: 

Height: 44px 
Radius: 6px 
Border: 1px 

Requirements: 

Visible label 

Clear focus state 

Accessible description where required 

Explicit validation state 

Corrective error text 

Appropriate autocomplete 

Correct input type 

Do not use placeholders as a substitute for labels. 

 

Select 

Use full width on mobile where appropriate. 

Minimum interactive height: 

44px 

 

Dropdown 

Use: 

Compact rows 

Keyboard navigation 

Visible selected state 

6px outer radius 

Clear hover state 

Clear focus state 

 

Cards 

Standard card: 

Border: 1px 
Radius: 8px 
Mobile padding: 12–16px 

Compact dashboard card: 

Padding: 8–12px 

Before creating another card, ask: 

Can this information be combined into an existing scannable module? 

Do not turn every paragraph into a separate card. 

Avoid nested-card clutter. 

 

Tabs 

Use approximately: 

14px 

Expose the selected state using more than color alone. 

Tabs must be keyboard operable. 

Do not hide critical workflows behind excessive tab depth. 

 

Accordion 

Interactive header: 

minimum 44px 

Indicate: 

Expanded state 

Collapsed state 

Keyboard focus 

Do not place essential always-needed information inside unnecessary accordions. 

 

Tables 

Use real semantic table markup when the content is tabular. 

Requirements: 

Semantic headers 

Proper scope relationships 

14px compact data text where appropriate 

Clear column alignment 

Tabular numerals for aligned metrics where useful 

Responsive strategy 

Accessible sorting state where applicable 

Do not convert every table into decorative cards on mobile automatically. 

Choose the mobile behavior according to the data. 

Possible strategies: 

Horizontal scroll 

Priority-column reduction 

Row expansion 

Stacked details 

Responsive comparison view 

 

KPI Components 

A KPI should normally include: 

Label 

Value 

Unit where applicable 

Comparison period when comparison exists 

Trend explanation where needed 

Do not show an unexplained percentage or arrow. 

Do not invent historical data. 

 

Badges 

Use approximately: 

12px 

Pill geometry is acceptable for badges. 

Use badges for: 

Status 

Category 

Compact metadata 

Do not use badges as decoration. 

 

Alerts 

Every alert must communicate meaning using more than color. 

Use: 

Icon 

Label 

Text 

Color 

as appropriate. 

 

Breadcrumbs 

Use breadcrumbs only when the interface has at least two meaningful hierarchy levels. 

Do not add breadcrumbs to shallow marketing pages without functional value. 

 

Modals 

A modal must: 

Trap focus 

Support Escape 

Provide explicit close control 

Restore focus after closing 

Prevent accidental background interaction 

Use correct dialog semantics 

Do not place large multistep workflows inside a modal unless justified. 

 

Toasts 

Use toasts only for temporary confirmation or secondary information. 

Never put information required to complete a task exclusively inside a toast. 

 

Empty States 

Every empty state should answer: 

What is empty? 

Why might it be empty? 

What can the user do next? 

Provide the next valid action where possible. 

Avoid cute illustrations unless the user explicitly requests them. 

 

Error States 

Every error state should explain: 

What failed 

Where it failed 

What the user can do next 

Avoid generic: 

Something went wrong. 

when more specific guidance is available. 

 

Loading States 

Preserve layout dimensions where possible. 

Avoid excessive layout shift. 

Use the simplest loading treatment that accurately communicates state. 

Do not add decorative loaders that delay perceived performance. 

 

Footer 

Use compact grouped navigation. 

Avoid oversized marketing footers containing large amounts of decorative space. 

Include only relevant destinations. 

 

Motion 

Motion must support function. 

Standard interface transition: 

120–200ms 

Non-essential entrance animation: 

≤300ms 

Prefer animating: 

Opacity 

Transform 

Avoid unnecessarily animating layout-triggering properties. 

Use motion for: 

State changes 

Menus 

Accordions 

Selection feedback 

Confirmation 

Context preservation 

Do not animate merely because an element enters the viewport. 

Always respect: 

@media (prefers-reduced-motion: reduce) 

 

Hover and Focus 

Every interactive component requires intentional states. 

Consider: 

Default 

Hover 

Focus-visible 

Active 

Selected 

Disabled 

Loading 

Error 

Success 

Hover must never be the only way to discover required information. 

Keyboard users must receive equivalent access. 

 

Touch Targets 

Primary interactive targets must be at least: 

44 × 44px 

Do not shrink targets below this minimum in the name of information density. 

Density comes from layout efficiency, not unusably small controls. 

 

Accessibility 

Accessibility is part of implementation, not a final polish step. 

Verify: 

One H1 per page 

Logical heading hierarchy 

Semantic HTML 

Body prose at least 16px on mobile 

Normal text contrast ≥ 4.5:1 

WCAG-defined large text contrast ≥ 3:1 

44×44px primary touch targets 

Keyboard access to all functionality 

Visible keyboard focus 

Focus not hidden behind sticky UI 

Accessible control labels 

Proper names, roles, states, and values 

Field-level error identification 

Corrective error instructions 

Meaningful alt text 

Decorative images ignored by assistive technology 

Information not communicated by color alone 

200% browser zoom usability 

Responsive reflow 

Reduced-motion support 

Keyboard-equivalent hover interactions 

Accessible dialogs 

Accessible dropdowns 

Accessible tabs 

Accessible tables 

Light-mode contrast 

Dark-mode contrast 

 

Dark Mode 

Treat dark mode as a complete design state. 

Use: 

Primary background: 
#0D1117 
 
Raised surface: 
#161B22 
 
Boundary: 
#30363D 

Recheck: 

Text contrast 

Border visibility 

Disabled states 

Focus states 

Hover states 

Violet interactions 

Teal interactions 

Charts 

Forms 

Do not simply invert the light interface. 

 

Tailwind CSS v4 

Define brand colors using Tailwind v4 theme variables. 

Use semantic tokens instead of scattered hex values. 

Example direction: 

@theme { 
  --color-brand-violet: #5B21B6; 
  --color-brand-violet-deep: #3B167A; 
  --color-brand-teal: #0F766E; 
  --color-brand-teal-bright: #0D9488; 
 
  --color-brand-ink: #111827; 
  --color-brand-white: #FFFFFF; 
  --color-brand-canvas: #F8FAFC; 
  --color-brand-surface: #F1F5F9; 
  --color-brand-border: #D0D7DE; 
  --color-brand-muted: #475569; 
 
  --color-brand-dark: #0D1117; 
  --color-brand-dark-raised: #161B22; 
  --color-brand-dark-border: #30363D; 
} 

Avoid repeated raw hex values throughout components when a token exists. 

Use separate semantic tokens for: 

Success 

Warning 

Error 

Information 

 

Component Architecture 

Create components based on actual repeated UI or behavioral responsibility. 

Good candidates: 

SiteHeader 

MobileNavigation 

PrimaryButton 

SecondaryButton 

SectionHeader 

MetricRow 

KpiCard 

StatusBadge 

ProcessList 

DataTable 

EmptyState 

ErrorState 

FormField 

Modal 

Tabs 

Accordion 

Avoid premature abstraction. 

Do not create a universal component with dozens of variants simply to appear architecturally sophisticated. 

Start concrete. 

Abstract repeated patterns after their similarities are proven. 

 

React and Next.js Rules 

Prefer Server Components unless client behavior is required. 

Use "use client" only where needed for: 

Local interaction state 

Browser APIs 

Event-driven behavior 

Client-only libraries 

Keep client boundaries small. 

Prefer: 

URL state for shareable navigation state 

Server-side data fetching where appropriate 

Explicit loading and error boundaries 

Predictable form handling 

Progressive enhancement 

Avoid turning an entire page into a Client Component because one dropdown needs state. 

 

TypeScript Rules 

Do not use any unless unavoidable and justified. 

Prefer: 

Explicit domain types 

Narrow unions 

Typed component props 

Typed Supabase responses 

Typed form schemas 

Exhaustive state handling where useful 

Avoid overly complex generics for simple UI. 

Code should be easier to maintain after typing, not harder. 

 

Supabase Rules 

When Supabase is required: 

Keep database access appropriately separated 

Protect secrets 

Never expose service-role keys to the client 

Use Row Level Security where appropriate 

Handle loading states 

Handle empty states 

Handle database errors 

Validate user input 

Treat authorization separately from authentication 

Do not assume that hiding a frontend control provides authorization. 

 

Performance 

Prefer measurable speed over visual spectacle. 

Optimize: 

JavaScript shipped to client 

Image dimensions 

Font loading 

Server/client boundaries 

Layout stability 

Network requests 

Component rendering 

Third-party scripts 

Avoid unnecessary: 

Animation libraries 

UI libraries 

Icon libraries 

Large chart packages 

Client-side data fetching 

Carousels 

Video backgrounds 

Use them only when the requirement justifies their cost. 

 

Images 

Use images only when they improve understanding, trust, evidence, or conversion. 

If real business photography or visual evidence has not been supplied, do not invent it as factual company evidence. 

Decorative images should never dominate the information architecture. 

Always provide appropriate: 

Alt text for meaningful images 

Empty alt text for decorative images where appropriate 

Explicit dimensions 

Responsive sizing 

 

Icons 

Use a consistent icon family. 

Icons should support comprehension. 

Do not use: 

Emoji as interface icons 

Mixed icon styles 

Decorative icons beside every heading 

Generic AI sparkles 

Brain icons 

Circuit icons 

Important icon-only controls require accessible names. 

 

AI Aesthetic Anti-Patterns 

Never default to stereotypical AI/SaaS styling. 

Avoid: 

Purple-blue gradient backgrounds 

Violet-to-Teal gradient branding 

Glowing AI brains 

Circuit patterns 

Floating glass cards 

Neon borders 

Sparkles 

Decorative node networks 

Giant abstract orbs 

Gradient blobs 

Mesh gradients 

Grain overlays 

Noise textures 

Custom cursors 

Excessive shadows 

Oversized rounded cards 

Huge empty hero sections 

Fake dashboards 

Random statistic tiles 

Generic logo clouds 

Excessive entrance animations 

Muhammed Ajmal Consulting should feel like a business operating system, not an AI startup template. 

 

Copy Integration 

Frontend design should reinforce the business positioning: 

AI-Powered Business Operating Systems for growing SMEs 

Core transformation: 

CHAOS → CONTROL → SCALE 

Lead with: 

Business problems 

Operational consequences 

Systems 

Decision clarity 

Accountability 

Execution 

Measurable outcomes 

Avoid vague statements such as: 

Revolutionize your business 

Unlock your potential 

Transform your future 

Next-generation AI solutions 

Seamless innovation 

Supercharge your workflow 

Cutting-edge intelligence 

Prefer specific operational language. 

 

SEO and Metadata 

Where relevant, verify: 

Page title 

Meta description 

Canonical behavior 

Open Graph metadata 

Social metadata 

Robots behavior 

Heading structure 

Semantic page landmarks 

Do not invent structured-data claims that the supplied business information does not support. 

 

Implementation Workflow 

Use this sequence. 

Step 1 — Understand 

Determine: 

User task 

Business outcome 

Audience 

Primary CTA 

Required content 

Required states 

 

Step 2 — Structure 

Define: 

Page hierarchy 

Navigation 

Content groups 

Mobile sequence 

Primary action location 

Do not style yet. 

 

Step 3 — Mobile layout 

Design at 360px. 

Verify: 

No overflow 

Readable hierarchy 

Reachable controls 

Logical navigation 

Appropriate density 

Correct touch targets 

 

Step 4 — Apply brand system 

Apply: 

Segoe UI 

Violet 

Teal 

Ink 

Canvas 

Surface 

Borders 

Approved spacing 

Approved radius 

 

Step 5 — Implement interaction states 

Implement all relevant: 

Default 

Hover 

Focus 

Active 

Selected 

Disabled 

Loading 

Empty 

Error 

Success 

 

Step 6 — Expand responsively 

Refine for: 

480px 

768px 

1024px 

1280px 

1536px 

Do not redesign the information architecture unnecessarily. 

 

Step 7 — Accessibility QA 

Complete keyboard, contrast, semantics, zoom, touch, reflow, and reduced-motion testing. 

 

Step 8 — Production QA 

Check: 

Functionality 

Responsiveness 

Performance 

Metadata 

Visual consistency 

Brand compliance 

Missing evidence 

Error handling 

Then ship. 

 

Pre-Ship Checklist 

Viewports 

Test 320px for overflow 

Test 360px 

Test 480px 

Test 768px 

Test 1024px 

Test 1280px 

Test 1536px 

Typography 

Segoe UI is primary 

Mobile body prose is at least 16px 

Compact UI text is not used for long-form prose 

One H1 exists 

Heading hierarchy is logical 

Prose line length is approximately 60–75 characters where possible 

Layout 

Mobile architecture was designed before desktop refinement 

No unintended horizontal overflow 

Spacing follows the approved system 

Density improves scanning 

Large blank spaces are justified 

Controls 

Primary touch targets are at least 44×44px 

Button labels are concise 

Form controls have labels 

Keyboard interaction works 

Focus states are visible 

Disabled states are clear 

Accessibility 

Normal text contrast is at least 4.5:1 

WCAG-defined large text contrast is at least 3:1 

Information is not communicated through color alone 

200% zoom works 

Reduced motion works 

Keyboard-only primary journeys work 

Focus is never hidden behind sticky UI 

Images have appropriate alt treatment 

Brand 

Brand Violet is the primary brand/action color 

Teal remains secondary 

No unapproved gradient treatment exists 

Standard controls use 6px radius 

Standard cards use 8px radius 

Standard structural borders are 1px 

Approved light/dark surfaces are used 

Logo geometry has not been altered 

Logo has not been replaced with initials 

No generic AI motifs are present 

States 

Loading states exist where required 

Empty states exist where required 

Error states exist where required 

Success states exist where required 

Disabled states exist where required 

Selected states use more than color alone 

Technical 

Tailwind v4 uses theme variables 

TypeScript types are meaningful 

Client Components are limited to actual client requirements 

Supabase credentials are secure 

Authorization is enforced server-side/database-side where required 

No unnecessary dependencies were added 

Layout shift is controlled 

Images are properly sized 

Content 

No testimonials were invented 

No client logos were invented 

No metrics were invented 

No awards or certifications were invented 

No case-study results were invented 

Unknown evidence is marked [TO CONFIRM] 

Metadata 

Page title is correct 

Meta description is correct 

Canonical behavior is correct where required 

Social metadata is present where required 

 

Decision Rules 

When uncertain, choose the option that: 

Makes the user's task clearer 

Reduces interaction cost 

Improves scanning 

Preserves accessibility 

Uses fewer unnecessary components 

Matches the brand system 

Works better on mobile 

Requires less frontend complexity 

Makes the primary action more obvious 

Produces a more maintainable production interface 

 

Final Standard 

A successful interface should answer yes to these questions: 

Can the user understand the page within seconds? 

Is the primary action obvious? 

Can the page be scanned quickly? 

Does mobile feel intentionally designed? 

Is important information compact without becoming cramped? 

Does the interface feel operational rather than decorative? 

Does the design clearly belong to Muhammed Ajmal Consulting? 

Is Violet dominant and Teal supporting? 

Is Segoe UI used correctly? 

Are borders, spacing, and radius consistent? 

Can every important interaction be completed with a keyboard? 

Does the interface work at 200% zoom? 

Are all important states covered? 

Is every business claim supported? 

Is unnecessary visual complexity absent? 

Would removing an element make the page less useful? 

If the answer to the final question is no, strongly consider removing that element. 

 

Final Principle 

Build the interface like a business operating system. 

Do not optimize for visual spectacle. 

Optimize for: 

Clarity, density, speed, consistency, trust, decision-making, and execution. 

 
