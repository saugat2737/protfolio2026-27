// Portfolio Data Store - Saugat Rauniyar
// Single source of truth for projects, achievements, skills, and client work.

export const PROJECTS = [
  {
    id: "impostr",
    title: "IMPOSTR",
    category: "Cybersecurity · Threat Intelligence · AI",
    status: "Live",
    statusType: "live",
    awardBadge: "3rd Place · HackaFest 2026",
    summary: "AI-assisted domain and URL threat-forensics platform aggregating multi-vector telemetry, DNS/WHOIS/SSL data, and NLP-based heuristic analysis to assess suspicious infrastructure.",
    image: "./assets/imposter-img.png",
    imageAlt: "IMPOSTR threat analysis platform dashboard interface",
    tech: ["Python", "FastAPI", "React", "DNS / WHOIS", "SSL Inspection", "OpenPhish", "URLhaus"],
    contribution: "Engineered threat telemetry aggregation pipeline, multi-vector URL forensic scoring engine, and interactive visual graph.",
    links: {
      demo: "https://impostr-virid.vercel.app/",
      github: "https://github.com/saugat2737/Impostr",
      caseStudy: "#impostr-case-study"
    },
    caseStudy: {
      problem: "Traditional phishing detection relies on slow manual blacklists or single-point checks. Attackers quickly cycle disposable domains and polymorphic hosting infrastructure, evading legacy static filters before feeds update.",
      solution: "IMPOSTR aggregates live threat feeds (URLhaus, PhishTank, OpenPhish), automated SSL certificate transparency logs (crt.sh), DNS history, and an NLP scanner into a consolidated forensic score in under 2 seconds.",
      contribution: "Built the multi-source aggregation worker, heuristic scoring parser, frontend investigation interface, and threat-node graph visualization.",
      decisions: [
        {
          title: "Parallel Async Intelligence Querying",
          detail: "Implemented concurrent asynchronous worker tasks to query threat feeds, WHOIS servers, and DNS records in parallel, reducing average report generation latency from 6.8s to 1.4s."
        },
        {
          title: "Weighted Heuristic Verdict Engine",
          detail: "Designed a composite risk formula combining domain age penalties, certificate issuer trust tiers, entropy-based lexical analysis, and NLP keyword indicators."
        }
      ],
      architectureSvg: `<svg viewBox="0 0 760 220" fill="none" xmlns="http://www.w3.org/2000/svg" class="arch-diag">
        <rect x="20" y="80" width="130" height="60" rx="8" stroke="currentColor" stroke-width="1.5" fill="var(--card-bg)"/>
        <text x="85" y="107" text-anchor="middle" fill="currentColor" font-size="12" font-family="var(--m)">Client Input</text>
        <text x="85" y="125" text-anchor="middle" fill="var(--mute)" font-size="10" font-family="var(--m)">URL / Domain</text>

        <path d="M150 110 H 220" stroke="var(--acc)" stroke-width="1.5"/>

        <rect x="220" y="30" width="160" height="160" rx="8" stroke="currentColor" stroke-width="1.5" fill="var(--card-bg)"/>
        <text x="300" y="55" text-anchor="middle" fill="currentColor" font-size="12" font-weight="600" font-family="var(--m)">Ingestion &amp; Lookup</text>
        <text x="300" y="85" text-anchor="middle" fill="var(--mute)" font-size="10" font-family="var(--m)">• DNS / WHOIS / SSL</text>
        <text x="300" y="110" text-anchor="middle" fill="var(--mute)" font-size="10" font-family="var(--m)">• Threat Feeds (URLhaus)</text>
        <text x="300" y="135" text-anchor="middle" fill="var(--mute)" font-size="10" font-family="var(--m)">• OpenPhish &amp; crt.sh</text>
        <text x="300" y="160" text-anchor="middle" fill="var(--mute)" font-size="10" font-family="var(--m)">• Lexical Entropy</text>

        <path d="M380 110 H 450" stroke="var(--acc)" stroke-width="1.5"/>

        <rect x="450" y="50" width="140" height="120" rx="8" stroke="currentColor" stroke-width="1.5" fill="var(--card-bg)"/>
        <text x="520" y="80" text-anchor="middle" fill="currentColor" font-size="12" font-weight="600" font-family="var(--m)">Forensic Engine</text>
        <text x="520" y="105" text-anchor="middle" fill="var(--mute)" font-size="10" font-family="var(--m)">• NLP Text Analysis</text>
        <text x="520" y="125" text-anchor="middle" fill="var(--mute)" font-size="10" font-family="var(--m)">• Graph Mapping</text>
        <text x="520" y="145" text-anchor="middle" fill="var(--mute)" font-size="10" font-family="var(--m)">• Weighted Verdict</text>

        <path d="M590 110 H 640" stroke="var(--acc)" stroke-width="1.5"/>

        <rect x="640" y="80" width="100" height="60" rx="8" stroke="var(--acc)" stroke-width="1.5" fill="var(--card-bg)"/>
        <text x="690" y="107" text-anchor="middle" fill="var(--acc)" font-size="12" font-weight="600" font-family="var(--m)">Verdict</text>
        <text x="690" y="125" text-anchor="middle" fill="var(--mute)" font-size="10" font-family="var(--m)">Risk Score</text>
      </svg>`,
      evidence: "Awarded 3rd Place at HackaFest 2026 (Biratnagar International College) out of multi-institutional engineering teams. Live deployment actively serving test lookups.",
      limitations: "Real-time rate limits on public OSINT APIs; high-volume enterprise queries require dedicated API keys and self-hosted feed mirrors.",
      nextSteps: "Integrating automated sandboxed headless DOM rendering to capture zero-day obfuscated credential harvesters."
    }
  },
  {
    id: "lucerna",
    title: "LUCERNA",
    category: "Healthcare AI · Medical Imaging · Human-in-the-Loop",
    status: "In development",
    statusType: "dev",
    disclaimer: "Prototype under development, not a clinically validated diagnostic product.",
    summary: "AI-assisted radiological imaging review workstation centering on auditable human-in-the-loop oversight, structured reviewability, and clinician verification interfaces.",
    image: "./assets/cover-impostr.png", // Concept illustration
    imageAlt: "LUCERNA medical imaging workstation interface preview (Concept illustration)",
    imageBadge: "Concept illustration",
    tech: ["Python", "Computer Vision", "PyTorch / ONNX", "TypeScript", "Canvas / WebGL"],
    contribution: "Designing the clinician triage UI, reviewability flows, confidence heatmaps, and verification audit trails.",
    links: {
      caseStudy: "#lucerna-case-study"
    },
    caseStudy: {
      problem: "Automated healthcare AI models are frequently treated as 'black boxes', causing clinician distrust, high alert fatigue, and lack of accountability in diagnostic support.",
      solution: "LUCERNA is built around verifiable human-in-the-loop workflows. Rather than declaring diagnoses, it highlights candidate regions of interest, calculates spatial confidence overlays, and mandates explicit clinician sign-off.",
      contribution: "Architected the medical image inspection canvas viewport, multi-layer annotation controls, and human-in-the-loop discrepancy logging schema.",
      decisions: [
        {
          title: "Prioritizing UI Reviewability Over Raw Model Claim",
          detail: "Designed interface with synchronized side-by-side comparison, contrast windowing presets, and mandatory clinician confirmation before findings are committed."
        },
        {
          title: "Zero-Cloud Edge Pre-Processing Prototype",
          detail: "Evaluating client-side WebGL / ONNX inference to protect sensitive patient records from leaving the local clinical intranet."
        }
      ],
      architectureSvg: `<svg viewBox="0 0 760 200" fill="none" xmlns="http://www.w3.org/2000/svg" class="arch-diag">
        <rect x="30" y="70" width="130" height="60" rx="8" stroke="currentColor" stroke-width="1.5" fill="var(--card-bg)"/>
        <text x="95" y="97" text-anchor="middle" fill="currentColor" font-size="12" font-family="var(--m)">DICOM / Scan</text>
        <text x="95" y="115" text-anchor="middle" fill="var(--mute)" font-size="10" font-family="var(--m)">Image Intake</text>

        <path d="M160 100 H 220" stroke="var(--acc)" stroke-width="1.5"/>

        <rect x="220" y="50" width="160" height="100" rx="8" stroke="currentColor" stroke-width="1.5" fill="var(--card-bg)"/>
        <text x="300" y="80" text-anchor="middle" fill="currentColor" font-size="12" font-weight="600" font-family="var(--m)">Vision Pre-processor</text>
        <text x="300" y="105" text-anchor="middle" fill="var(--mute)" font-size="10" font-family="var(--m)">• Feature Segmentation</text>
        <text x="300" y="125" text-anchor="middle" fill="var(--mute)" font-size="10" font-family="var(--m)">• Attention Heatmap</text>

        <path d="M380 100 H 450" stroke="var(--acc)" stroke-width="1.5"/>

        <rect x="450" y="40" width="160" height="120" rx="8" stroke="var(--acc)" stroke-width="1.5" fill="var(--card-bg)"/>
        <text x="530" y="70" text-anchor="middle" fill="var(--acc)" font-size="12" font-weight="600" font-family="var(--m)">Review Workstation</text>
        <text x="530" y="95" text-anchor="middle" fill="currentColor" font-size="11" font-family="var(--m)">Clinician Overlay</text>
        <text x="530" y="115" text-anchor="middle" fill="var(--mute)" font-size="10" font-family="var(--m)">• Side-by-side Inspection</text>
        <text x="530" y="135" text-anchor="middle" fill="var(--mute)" font-size="10" font-family="var(--m)">• Manual Override</text>

        <path d="M610 100 H 660" stroke="var(--acc)" stroke-width="1.5"/>

        <rect x="660" y="70" width="80" height="60" rx="8" stroke="currentColor" stroke-width="1.5" fill="var(--card-bg)"/>
        <text x="700" y="97" text-anchor="middle" fill="currentColor" font-size="11" font-family="var(--m)">Audit Log</text>
        <text x="700" y="115" text-anchor="middle" fill="var(--mute)" font-size="10" font-family="var(--m)">Verified</text>
      </svg>`,
      evidence: "Interactive prototype research project focusing on clinician ergonomics and safety UX paradigms.",
      limitations: "Model training dataset strictly limited to open-access anonymized research benchmarks. Not certified as medical software.",
      nextSteps: "Conducting structured usability trials with medical trainees to measure review speed vs. false-positive confirmation rates."
    }
  },
  {
    id: "dormex",
    title: "DORMEX",
    category: "Full-Stack · Workflow Automation · Student Services",
    status: "In development",
    statusType: "dev",
    summary: "Hostel and campus accommodation management platform streamlining room allocation, vacancy locks, and maintenance complaint lifecycles.",
    image: "./assets/cover.png", // Concept illustration
    imageAlt: "DORMEX campus hostel allocation system conceptual preview (Concept illustration)",
    imageBadge: "Concept illustration",
    tech: ["JavaScript", "Node.js", "Express", "PostgreSQL", "Tailwind CSS"],
    contribution: "Full-stack architecture, relational database schema design, and server-authoritative seat allocation engine.",
    links: {
      github: "https://github.com/saugat2737/DORMEX",
      caseStudy: "#dormex-case-study"
    },
    caseStudy: {
      problem: "University hostel allocation often depends on paper forms, untracked spreadsheets, and disorganized counter queues, resulting in double-booked beds and lost maintenance requests.",
      solution: "DORMEX provides an integrated platform separating student portals, warden verification panels, and real-time room capacity tracking with automated waitlisting.",
      contribution: "Designed the relational data schema (students, rooms, blocks, maintenance tickets), partial unique index constraints (`uq_seat_current`, `uq_student_current`), and server-authoritative allocation engine.",
      implementedVsPlanned: {
        implemented: [
          "Authentication & role-based access control (Student, Proctor, Warden, Chief Warden, Super Admin)",
          "Relational PostgreSQL schema with partial unique indexes (`uq_seat_current`, `uq_student_current`, `uq_pool_one_turn`)",
          "Server-authoritative allocation engine preventing race conditions and lateness manipulation",
          "Digital maintenance ticket submission & complaint lifecycle with public/private visibility",
          "Zero-dependency test harness supporting live PostgreSQL and embedded in-memory database (`pg-mem`)"
        ],
        planned: [
          "Interactive SVG floor plan visual bed map selection",
          "Automated SMS/Email notifications for fee receipt verification",
          "Digital gate-pass issuance and QR code scanning for campus security",
          "Payment gateway integration for room deposit collection"
        ]
      },
      decisions: [
        {
          title: "Partial Unique Indexes for Concurrency Guarantees",
          detail: "Enforced database-level integrity via PostgreSQL partial unique indexes (`uq_seat_current`, `uq_student_current`), strictly preventing double-allocation even under high concurrent checkout spikes."
        },
        {
          title: "Server-Authoritative Turn Execution",
          detail: "Client clocks and declared priorities are treated as untrusted; turn deadlines, lateness penalties, and allocations are strictly evaluated against server-side timestamps."
        }
      ],
      architectureSvg: `<svg viewBox="0 0 760 200" fill="none" xmlns="http://www.w3.org/2000/svg" class="arch-diag">
        <rect x="30" y="40" width="120" height="50" rx="8" stroke="currentColor" stroke-width="1.5" fill="var(--card-bg)"/>
        <text x="90" y="65" text-anchor="middle" fill="currentColor" font-size="11" font-family="var(--m)">Student UI</text>
        <text x="90" y="80" text-anchor="middle" fill="var(--mute)" font-size="9" font-family="var(--m)">Room Selection</text>

        <rect x="30" y="110" width="120" height="50" rx="8" stroke="currentColor" stroke-width="1.5" fill="var(--card-bg)"/>
        <text x="90" y="135" text-anchor="middle" fill="currentColor" font-size="11" font-family="var(--m)">Admin / Warden</text>
        <text x="90" y="150" text-anchor="middle" fill="var(--mute)" font-size="9" font-family="var(--m)">Verification</text>

        <path d="M150 65 H 230" stroke="var(--acc)" stroke-width="1.5"/>
        <path d="M150 135 H 230" stroke="var(--acc)" stroke-width="1.5"/>

        <rect x="230" y="50" width="170" height="100" rx="8" stroke="currentColor" stroke-width="1.5" fill="var(--card-bg)"/>
        <text x="315" y="80" text-anchor="middle" fill="currentColor" font-size="12" font-weight="600" font-family="var(--m)">API Gateway &amp; Auth</text>
        <text x="315" y="105" text-anchor="middle" fill="var(--mute)" font-size="10" font-family="var(--m)">• JWT Authorization</text>
        <text x="315" y="125" text-anchor="middle" fill="var(--mute)" font-size="10" font-family="var(--m)">• Role-Based Guard</text>

        <path d="M400 100 H 470" stroke="var(--acc)" stroke-width="1.5"/>

        <rect x="470" y="40" width="150" height="120" rx="8" stroke="var(--acc)" stroke-width="1.5" fill="var(--card-bg)"/>
        <text x="545" y="70" text-anchor="middle" fill="var(--acc)" font-size="12" font-weight="600" font-family="var(--m)">Business Logic</text>
        <text x="545" y="95" text-anchor="middle" fill="currentColor" font-size="11" font-family="var(--m)">Allocation Engine</text>
        <text x="545" y="115" text-anchor="middle" fill="var(--mute)" font-size="10" font-family="var(--m)">• uq_seat_current</text>
        <text x="545" y="135" text-anchor="middle" fill="var(--mute)" font-size="10" font-family="var(--m)">• Turn Scheduler</text>

        <path d="M620 100 H 670" stroke="var(--acc)" stroke-width="1.5"/>

        <rect x="670" y="65" width="80" height="70" rx="8" stroke="currentColor" stroke-width="1.5" fill="var(--card-bg)"/>
        <text x="710" y="95" text-anchor="middle" fill="currentColor" font-size="11" font-family="var(--m)">Database</text>
        <text x="710" y="115" text-anchor="middle" fill="var(--mute)" font-size="9" font-family="var(--m)">PostgreSQL</text>
      </svg>`,
      evidence: "Active open-source repository at github.com/saugat2737/DORMEX containing domain modular services and complete schema test harnesses.",
      limitations: "Frontend visual SVG floor plan mapping actively in progress; currently fully functional via tested API endpoints.",
      nextSteps: "Integrating SVG coordinate overlays for interactive graphic seat picking."
    }
  }
];

export const CLIENT_WORK = [
  {
    id: "capital-marketing",
    client: "Capital Marketing",
    domain: "capitalmarketingnp.com",
    tagline: "Corporate Gifting & Merchandising Website",
    description: "Production commercial website built for a Nepal-based corporate gifting firm. Features catalog presentation, company background, and client inquiry generation workflows.",
    desktopImage: "./assets/capital.png",
    url: "https://capitalmarketingnp.com",
    repo: "https://github.com/saugat2737/capitalmarketingnp",
    deliverables: ["Product Showcase", "Inquiry Workflow", "Responsive Multi-Screen UI", "SEO & Meta Optimization"]
  },
  {
    id: "shubhlabh",
    client: "ShubhLabh Construction",
    domain: "shubhlabhconstruction.com.np",
    tagline: "Commercial Construction Firm Presence",
    description: "Responsive corporate website for an engineering and construction enterprise, showcasing civil project portfolios, equipment capabilities, and client contact channels.",
    desktopImage: "./assets/shubh.png",
    url: "https://shubhlabhconstruction.com.np/",
    repo: "https://github.com/saugat2737/shubhlabhconstruction",
    deliverables: ["Project Portfolio Grid", "Service Architecture", "Mobile Performance", "Domain & DNS Deployment"]
  }
];

// Additional technical builds from previous version
export const MORE_BUILDS = [
  { title: "AI Quiz Generator", tag: "AI", note: "Academic build" },
  { title: "Vehicle Number Plate Detection / Parking System", tag: "Computer Vision", note: "OpenCV pipeline" },
  { title: "ATM Management System", tag: "Software", note: "Object-oriented systems" },
  { title: "Obstacle Avoiding Robot", tag: "Hardware / Robotics", note: "Microcontroller sensors" },
  { title: "Student Portfolio Dashboard", tag: "Web", note: "Academic portal" },
  { title: "Wearable SpO₂ Monitoring System", tag: "Hardware", note: "Embedded sensor telemetry" }
];

export const ACHIEVEMENTS = {
  featured: {
    id: "hackafest-2026",
    title: "3rd Place · HackaFest 2026",
    awarder: "Biratnagar International College",
    date: "2026",
    project: "IMPOSTR (Team Incognitus)",
    description: "Built and demonstrated IMPOSTR under intensive 36-hour hackathon constraints. Pitched domain telemetry scoring, automated threat-source cross-referencing, and live URL analysis to judges.",
    contribution: "Co-developer: Built the frontend analysis interface, browser extension integration, and threat-correlation engine.",
    certificateImage: "./assets/1.jpeg",
    teamImage: "./assets/impostr-teammate.jpg",
    dashboardImage: "./assets/imposter-img.png",
    proofUrl: "./assets/1.jpeg"
  },
  categories: [
    {
      name: "Awards & Hackathons",
      items: [
        {
          title: "3rd Place · HackaFest 2026",
          organization: "Biratnagar International College",
          date: "2026",
          context: "Team Incognitus / IMPOSTR Project",
          detail: "Selected as 3rd place winners after intensive live demonstration of the multi-vector web threat forensics tool.",
          proofType: "Certificate",
          proofLink: "./assets/1.jpeg"
        }
      ]
    },
    {
      name: "Publications & Technical Writing",
      items: [
        {
          title: "From URL to Verdict: Constructing a Multi-Vector Web Threat Forensics Engine",
          organization: "Medium",
          date: "August 2026",
          context: "11 min in-depth technical engineering walkthrough",
          detail: "Documented the architecture, telemetry aggregation pipeline, and DNS/SSL heuristics developed during the IMPOSTR build.",
          proofType: "Article",
          proofLink: "https://medium.com/@saugat.rauniyar.work/from-url-to-verdict-constructing-a-multi-vector-web-threat-forensics-engine-c9eb4722d352"
        }
      ]
    },
    {
      name: "Certifications & Learning",
      // Sorted newest first: 2026 -> 2025
      items: [
        {
          title: "APIsec Certified Practitioner (ACP)",
          organization: "APIsec University",
          date: "October 2026",
          score: "93 / 100",
          summary: "Covered API authentication & authorization flaws, OWASP API Security Top 10 vulnerabilities, API documentation audits, and server hardening.",
          proofType: "Verification & Social Proof",
          proofLink: "https://www.linkedin.com/feed/update/urn:li:activity:7506570341339561984/",
          verificationLink: "https://app.kajabi.com/certificates/2cc65bcc"
        },
        {
          title: "Prompt Engineering",
          organization: "Infosys Springboard",
          date: "2026",
          summary: "Structured prompt methodologies, context distillation, and LLM orchestration workflows.",
          proofType: "Credential",
          proofLink: null
        },
        {
          title: "Claude Code in Action",
          organization: "Anthropic",
          date: "2026",
          summary: "Agentic coding environments, tool use orchestration, and terminal workflow integration.",
          proofType: "Credential",
          proofLink: null
        },
        {
          title: "Getting Started with AI on Jetson Nano",
          organization: "NVIDIA",
          date: "2025",
          summary: "Embedded computer vision, edge deep learning deployment, and TensorRT inference pipeline setup.",
          proofType: "Credential",
          proofLink: null
        },
        {
          title: "Neural Network & NLP Implementation",
          organization: "Infosys Springboard",
          date: "2025",
          summary: "Fundamentals of dense neural architectures, sequence modeling, and tokenization techniques.",
          proofType: "Credential",
          proofLink: null
        },
        {
          title: "Generative AI Literacy",
          organization: "NASSCOM FutureSkills Prime",
          date: "2025",
          summary: "Foundational generative model capabilities, evaluation metrics, and responsible AI governance.",
          proofType: "Credential",
          proofLink: null
        }
      ]
    }
  ]
};

export const SKILLS_DATA = [
  {
    category: "Languages",
    id: "languages",
    skills: [
      { name: "Python", project: "impostr", projectName: "IMPOSTR & Lucerna" },
      { name: "JavaScript / TypeScript", project: "impostr", projectName: "IMPOSTR & DORMEX" },
      { name: "C / C++", project: null, projectName: "SIT Academic Systems" },
      { name: "Java", project: null, projectName: "Object-Oriented Architecture" },
      { name: "SQL", project: "dormex", projectName: "DORMEX Relational Models" }
    ]
  },
  {
    category: "Frontend & Interfaces",
    id: "frontend",
    skills: [
      { name: "HTML5 & Semantic CSS3", project: "capital-marketing", projectName: "Client Portfolios" },
      { name: "Tailwind CSS", project: "dormex", projectName: "DORMEX UI" },
      { name: "React.js / Next.js", project: "impostr", projectName: "IMPOSTR Web UI" },
      { name: "Canvas 2D / WebGL", project: "hero", projectName: "Portfolio Sculptures & Lucerna" }
    ]
  },
  {
    category: "Backend & Systems",
    id: "backend",
    skills: [
      { name: "Node.js & Express", project: "dormex", projectName: "DORMEX Backend" },
      { name: "FastAPI / Python Services", project: "impostr", projectName: "IMPOSTR Threat Engine" },
      { name: "PostgreSQL & MySQL", project: "dormex", projectName: "DORMEX Relational DB" },
      { name: "REST APIs & Webhooks", project: "impostr", projectName: "OSINT Threat Aggregation" }
    ]
  },
  {
    category: "AI, Security & Computer Vision",
    id: "ai-sec",
    skills: [
      { name: "Threat Forensics & OSINT", project: "impostr", projectName: "IMPOSTR Platform" },
      { name: "DNS / WHOIS / SSL Forensics", project: "impostr", projectName: "IMPOSTR Analysis" },
      { name: "OpenCV & OCR", project: "lucerna", projectName: "Lucerna & Academic Vision" },
      { name: "Prompt Engineering & Agents", project: "writing", projectName: "LLM Orchestration" },
      { name: "API Security & OWASP Top 10", project: "achievements", projectName: "APIsec Certified" }
    ]
  },
  {
    category: "Tools & Infrastructure",
    id: "tools",
    skills: [
      { name: "Git & GitHub", project: "dormex", projectName: "Version Control" },
      { name: "Vercel / Cloud Deployment", project: "impostr", projectName: "IMPOSTR Production" },
      { name: "VS Code & Terminal Tooling", project: null, projectName: "Primary Engineering Stack" },
      { name: "Google Colab & Linux", project: "impostr", projectName: "Model Exploration" }
    ]
  }
];

export const EDUCATION_DATA = [
  {
    institution: "Siddaganga Institute of Technology",
    location: "Tumakuru / Bengaluru, India",
    degree: "B.E. Computer Science and Engineering",
    period: "2025 — 2029",
    metric: "CGPA 9.5",
    isCurrent: true
  },
  {
    institution: "Shikshadeep Higher Secondary School",
    location: "Biratnagar, Nepal",
    degree: "Higher Secondary (Science)",
    period: "2023 — 2025",
    metric: "GPA 3.46 / 4.0",
    isCurrent: false
  },
  {
    institution: "DAV School",
    location: "Biratnagar, Nepal",
    degree: "Secondary Education",
    period: "2023",
    metric: "GPA 3.14 / 4.0",
    isCurrent: false
  }
];

export const TEAM_MEMBERS = [
  {
    roleId: "01",
    name: "Saugat Rauniyar",
    role: "Browser Extension, Threat Detection Engine, Frontend",
    link: "https://www.linkedin.com/in/saugat-rauniyar",
    linkLabel: "LinkedIn"
  },
  {
    roleId: "02",
    name: "Eshan Agarwal",
    role: "Forensic Engine, Backend Services",
    link: "https://www.eshaanagrawal.me/",
    linkLabel: "Portfolio"
  },
  {
    roleId: "03",
    name: "Prem Soni",
    role: "API Development & Integration",
    link: "https://www.linkedin.com/in/prem-gopal-soni",
    linkLabel: "LinkedIn"
  }
];
