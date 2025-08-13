You are to generate a complete responsive landing page for the **Virgin Fund: GenEric TraDer AI** trading platform.  
The landing page must meet the following requirements:

---

## 1. **Core Landing Page Goals**
- Funnel visitors into:
  - Trying the service for free (CTA: "Start Free")
  - Viewing available pricing plans
  - Learning about the advantages of Virgin Fund (AI trading automation, backtesting tools, calculators)
- Demonstrate how the platform can generate hundreds of automated trades or backtests per month with minimal manual work.
- Make the conversion funnel obvious with sections for:
  1. Hero Section with CTA
  2. Feature Highlights (cards or grid)
  3. Plans & Pricing
  4. Demo / Proof Section (graphs, screenshots)
  5. Blog / Educational Content Section (from /blog/ folder)
  6. Final Call-to-Action

---

## 2. **Technical Requirements**
- **Framework:** React (latest) with Next.js or Vite + React Router  
- **Styling:** TailwindCSS with dark/light theme toggle
- **Layout:** Mobile-first responsive grid and flexbox
- **SEO:** Meta tags, Open Graph, schema.org JSON-LD for articles
- **Accessibility:** Use semantic HTML and aria attributes

---

## 3. **Blog Posts**
- Blog posts are stored as markdown files in `/blog/` folder
- Each markdown file:
  - Has YAML frontmatter with `title`, `date`, `author`, and `description`
  - Content body supports headings, code blocks, tables, and images
- Blog section on landing page:
  - Show latest 3–4 posts in card layout with title, excerpt, date, and “Read More” link
  - Clicking opens dedicated blog post page rendered from markdown
- Must include a **blog index page** (`/blog`) showing all posts, paginated if > 10
- Blog rendering: use a markdown parser (`remark`, `react-markdown`) and syntax highlighting for code

---

## 4. **Theme & Branding**
- **Theme colors:** Dark mode default with electric green accents (#00FF85) and white text; light mode with charcoal text and green CTA buttons
- Use a clean, modern sans-serif font (Inter or similar)
- Subtle animations for section reveals (Framer Motion)
- CTA buttons stand out with gradient backgrounds

---

## 5. **Extra Functionality**
- Newsletter signup form integrated with Mailchimp or SendGrid API
- Pricing plans displayed with monthly/yearly toggle
- Feature section includes icons (lucide-react or heroicons)
- Performance metrics section showing example trading statistics
- Testimonials section (static mock data)

---

## 6. **Output Expectations**
- Full code scaffold including:
  - Landing page component
  - Blog index page
  - Blog post dynamic route
  - Tailwind config for dark mode toggle
  - Markdown loading and parsing logic
- Include mock `/blog/*.md` files with realistic posts about trading strategies, backtesting, and financial planning
- Provide clear instructions in README for:
  - Adding new markdown posts
  - Running the project locally
  - Deploying to production (Vercel/Netlify)

---

Generate the **complete** landing page project as described.
