


# Saugat Rauniyar — Engineering Portfolio (2026—27)

A premium, highly refined personal portfolio engineered with semantic HTML5, modern tokenized CSS, and vanilla ES modules (no frameworks, zero heavy dependencies).

Built for high-performance delivery, complete keyboard accessibility, dark/light theme versatility, and SEO optimization.

---

## 🏗️ Architecture & File Structure

```text
├── index.html           # Semantic document markup with proper section flow & ARIA dialogs
├── styles.css           # Tokenized design system (8px grid, dark/light themes, animations)
├── script.js            # Interactive controller (Canvas, compact scroll, terminal, modals)
├── data.js              # Single source of truth for projects, achievements, skills, & credentials
├── assets/              # Verified visual assets, screenshots, certificates, and PDF résumé
├── sitemap.xml          # Search engine indexing map
├── robots.txt           # Crawler instructions
├── TODO.md              # Actionable checklist for missing evidence/links
└── README.md            # Repository documentation
```

---

## 🎨 Design Direction

- **Editorial Dark & Polished Light Modes**: Respects system `prefers-color-scheme` on first visit and persists manual preferences via `localStorage`. Both themes provide WCAG AAA text contrast and adapted canvas particle colors.
- **Strict Color Tokens**:
  - Background: `#0A0B0D` (Dark) / `#F7F6F2` (Light)
  - Ink: `#ECEAE4` (Dark) / `#111216` (Light)
  - Interactive Accent: `#5B8CFF` (Dark) / `#2255D6` (Light)
  - Recognition & Awards: `#C9984F` (Bronze)
- **Mathematical 8px Spacing Scale**: Consistent card padding, border radii, and 1px subtle borders without loud neon glows or glassmorphism noise.
- **Responsive Layout**: Full support across mobile (360px+), tablet, laptop, and ultra-wide viewports. Flagship cards utilize 3 columns on desktop, 2 on tablet, and 1 on mobile.

---

## 🚀 Sections Overview

1. **Hero**: Headline, roles, dual CTAs ("Explore Selected Work" and "Download Résumé"), and an offscreen-paused, style-cached 3D geometric ring canvas.
2. **Selected Projects (3 Flagship Cards)**:
   - **IMPOSTR**: Live AI-assisted domain & URL threat forensics engine (HackaFest 3rd place).
   - **LUCERNA**: Healthcare AI medical imaging review workstation (In development; human-in-the-loop reviewability focus).
   - **DORMEX**: Campus hostel allocation platform (In development; relational concurrency locking).
   - *Each flagship features an interactive Case Study dialog with Problem, Solution Flow, Contribution, inline SVG Architecture, Engineering Decisions, Evidence, Limitations, and Next Steps.*
   - *Includes a compact 120vh scroll showcase on desktop that gracefully shifts to a clean static timeline on mobile.*
3. **Achievements Archive**:
   - Featured HackaFest 2026 3rd place podium card with real certificate inspection.
   - Categorized archive: Awards & Hackathons, Publications & Technical Writing, Certifications & Learning.
4. **Client Work**:
   - Commercial production deployments for **Capital Marketing** and **ShubhLabh Construction** with real screenshots and verified deliverables.
5. **Technical Writing**:
   - Featured engineering walkthrough published on Medium: *"From URL to Verdict: Constructing a Multi-Vector Web Threat Forensics Engine"*.
6. **Skills & Education**:
   - Semantic `<button aria-expanded="..." aria-controls="...">` accordion linking every tool to its real-world implementation.
   - Academic timeline highlighting Computer Science & Engineering @ Siddaganga Institute of Technology (CGPA 9.5).
7. **About & Contact**:
   - Professional bio, spoken languages, direct inquiry channels, and social profiles.
8. **SAUGAT.OS Terminal**:
   - Keyboard shortcut (`⌘K` / `Ctrl+K`), sanitize/escaped inputs (XSS vulnerability fixed), and full focus-trapping.

---

## 🛠️ How to Edit Projects and Content

All dynamic content is organized in **`data.js`**. You do not need to modify HTML structures to update projects, certifications, or team details:

1. **Add or Edit a Flagship Project**:
   Open `data.js` and modify entries in the `PROJECTS` array:
   ```javascript
   {
     id: "new-project",
     title: "PROJECT NAME",
     category: "Category Description",
     status: "Live" | "In development",
     statusType: "live" | "dev",
     summary: "One sentence summary...",
     image: "./assets/your-image.png",
     tech: ["Tech 1", "Tech 2"],
     contribution: "What you specifically built...",
     links: { demo: "...", github: "...", caseStudy: "#..." },
     caseStudy: { ... }
   }
   ```

2. **Add a Certification or Award**:
   In `data.js`, add an item to the appropriate category in `ACHIEVEMENTS.categories`.

3. **Update Skills**:
   In `data.js`, edit `SKILLS_DATA`. Every skill can specify `project: "project-id"` and `projectName: "Label"` to link to that project on the page.

---

## 🌐 Local Development & Deployment

### Local Preview
Run any local static server:
```bash
# Python
python -m http.server 8000

# Node / npx
npx serve .
```
Navigate to `http://localhost:8000`.

### Deploying to GitHub Pages / Vercel
- **GitHub Pages**: Go to Repository Settings → Pages → Deploy from branch `main` (root `/`).
- **Vercel**: Run `vercel` or link the GitHub repository. Zero build configuration required.

---

## 📌 Suggested GitHub Repository Metadata

- **Description**: `Personal engineering portfolio of Saugat Rauniyar — Software Engineer specializing in AI, Cybersecurity & Full-Stack Systems. Built with Vanilla JS & Modern CSS tokens.`
- **Topics**: `portfolio`, `vanilla-javascript`, `cybersecurity`, `threat-intelligence`, `dark-theme`, `accessibility`, `css-design-system`, `bricolage-grotesque`
