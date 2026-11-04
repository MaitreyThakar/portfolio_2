/**
 * PORTFOLIO CONTENT REPOSITORY
 * Maitrey Thakar - Full-Stack & GenAI Developer
 * 
 * All portfolio textual and data assets originate from this file.
 * To update your portfolio, edit values here.
 * Any missing or pending personal data is marked with "TODO:".
 */

export const portfolioData = {
  personal: {
    name: "Maitrey Thakar",
    firstName: "Maitrey",
    lastName: "Thakar",
    tagline: "Full-Stack & GenAI Developer",
    status: "Final-year B.Tech IT/CS student at CHARUSAT, graduating 2026",
    location: "Gujarat, India",
    focus: ["full-stack development", "AI/ML", "GenAI"],
    bio: "Final-year B.Tech IT/CS student at CHARUSAT, graduating 2026. Based in Gujarat, India. Specialized in full-stack development, AI/ML, and GenAI, engineering end-to-end intelligent systems and high-performance web applications.",
    quote: "Building at the intersection of robust architecture, intuitive design, and intelligent machine systems.",
    avatar: "assets/img/me.png",
    // Fallback indicator if custom portrait photo is not yet provided
    avatarPlaceholder: "assets/img/silhouette.svg"
  },

  links: {
    github: "https://github.com/MaitreyThakar",
    linkedin: "https://linkedin.com/in/maitrey-thakar-87b218273",
    // TODO: Replace 'your@email.com' with your official personal contact email address
    email: "officialmaitrey@email.com",
    // TODO: Add your custom domain URL when deployed (e.g. https://maitreythakar.github.io)
    canonicalUrl: "https://maitreythakar.github.io"
  },

  nav: [
    { label: "Work", href: "#work" },
    { label: "About", href: "#about" },
    { label: "Journey", href: "#journey" },
    { label: "Contact", href: "#contact" }
  ],

  floatingCursors: [
    { label: "Python", color: "#C6FF3D", initialX: "12%", initialY: "28%" },
    { label: "React", color: "#C6FF3D", initialX: "78%", initialY: "22%" },
    { label: "RAG", color: "#C6FF3D", initialX: "85%", initialY: "65%" },
    { label: "n8n", color: "#C6FF3D", initialX: "18%", initialY: "72%" },
    { label: "FastAPI", color: "#C6FF3D", initialX: "52%", initialY: "82%" }
  ],

  marqueeTech: [
    "Python",
    "FastAPI",
    "ChromaDB",
    "Ollama",
    "Streamlit",
    "n8n",
    "JavaScript",
    "React",
    "SQL",
    "Git",
    "Docker",
    "REST APIs",
    "GenAI",
    "Machine Learning",
    "TypeScript",
    "Tailwind CSS",
    "Node.js"
  ],

  stats: [
    {
      label: "Projects Built",
      value: 4,
      suffix: "+",
      description: "Production and research systems delivered"
    },
    {
      label: "Internships",
      value: 2,
      suffix: "",
      description: "Industry software engineering internships"
    },
    {
      label: "B.Tech CGPA",
      value: 7.8,
      suffix: "/10",
      description: "CHARUSAT academic distinction"
    },
    {
      // TODO: Update certifications count once more official credentials are listed
      label: "Certifications",
      value: 3,
      suffix: "",
      description: "Specialized tech and development credentials"
    }
  ],

  projects: [
    {
      id: "hr-policy-assistant",
      title: "HR Policy Q&A Assistant",
      category: "GenAI",
      // Verbatim 2-line description using only stated specifications
      tagline: "Fully offline local RAG over an HR policy PDF.",
      description: "Powered by FastAPI, Streamlit, ChromaDB, and Ollama for secure private retrieval.",
      stack: ["FastAPI", "Streamlit", "ChromaDB", "Ollama", "Python"],
      image: "assets/img/project-rag.svg",
      featured: true,
      // TODO: Provide live demo URL if hosted locally or on server
      demoUrl: "#",
      // TODO: Provide repository URL for HR Policy Q&A Assistant
      repoUrl: "#"
    },
    {
      id: "ai-security-analyst",
      title: "AI Security Analyst",
      category: "AI/ML",
      // Verbatim 2-line description using only stated specifications
      tagline: "Academic AI-driven security analysis platform.",
      description: "Intelligent threat detection and vulnerability assessment system.",
      stack: ["Python", "Machine Learning", "Security Analysis", "Data Analytics"],
      image: "assets/img/project-security.svg",
      featured: true,
      // TODO: Provide live demo URL if deployed
      demoUrl: "#",
      // TODO: Provide repository URL for AI Security Analyst
      repoUrl: "#"
    },
    {
      id: "real-estate-scanning",
      title: "Real Estate Market Scanning",
      category: "Automation",
      // Verbatim 2-line description using only stated specifications
      tagline: "n8n Cloud workflow that scans BatchData hourly for high-equity absentee-owner property leads.",
      description: "Automatically alerts via email and Slack with filtered actionable prospects.",
      stack: ["n8n Cloud", "BatchData", "Slack API", "Email Automation", "Webhooks"],
      image: "assets/img/project-automation.svg",
      featured: true,
      // TODO: Provide demo workflow link or video
      demoUrl: "#",
      // TODO: Provide workflow export or repository URL
      repoUrl: "#"
    },
    {
      id: "wayfarer",
      title: "Wayfarer",
      category: "Full-stack",
      // Verbatim 2-line description using only stated specifications
      tagline: "Browser-based open-world exploration game.",
      description: "Full-stack game client and backend featuring interactive world navigation.",
      stack: ["JavaScript", "HTML5 Canvas", "Node.js", "CSS3"],
      image: "assets/img/project-wayfarer.svg",
      featured: true,
      // TODO: Provide playable live URL for Wayfarer game
      demoUrl: "#",
      // TODO: Provide GitHub repository URL for Wayfarer
      repoUrl: "#"
    }
  ],

  showcase: {
    heading: "FROM RAW. TO REAL.",
    subheading: "Interactive architecture comparison",
    description: "Compare raw data inputs and backend workflow logs against real-time AI interface outcomes.",
    beforeLabel: "RAW ARCHITECTURE",
    afterLabel: "REAL INTERFACE",
    beforeImage: "assets/img/showcase-raw.svg",
    afterImage: "assets/img/showcase-real.svg"
  },

  about: {
    title: "NOT JUST CODE. IT'S HOW I BUILD.",
    paragraph1: "I am Maitrey Thakar, a final-year B.Tech IT/CS student at CHARUSAT graduating in 2026, based in Gujarat, India. My core focus centers on full-stack development, AI/ML, and GenAI.",
    paragraph2: "From architecting offline local RAG pipelines with ChromaDB and Ollama to engineering automated n8n cloud monitoring engines and interactive full-stack systems, I develop software that blends performance, security, and clean engineering.",
    quote: "Building software isn't just about syntax. It's about engineering intelligent leverage and frictionless user experiences.",
    quoteAuthor: "Maitrey Thakar"
  },

  skills: [
    {
      group: "Core & Languages",
      items: ["Python", "JavaScript (ES6+)", "TypeScript", "C/C++", "SQL", "HTML5 & CSS3"]
    },
    {
      group: "AI, GenAI & ML",
      items: ["Local RAG", "Ollama", "ChromaDB", "Vector Embeddings", "Model Evaluation", "Prompt Engineering"]
    },
    {
      group: "Frameworks & Backend",
      items: ["FastAPI", "Streamlit", "React.js", "Node.js", "Express", "RESTful Architecture"]
    },
    {
      group: "Automation & Infrastructure",
      items: ["n8n Cloud", "Git & GitHub", "Docker", "BatchData Integration", "Webhooks", "CI/CD Workflows"]
    }
  ],

  education: [
    {
      degree: "B.Tech in IT / Computer Science",
      institution: "CHARUSAT (Charotar University of Science and Technology)",
      score: "CGPA 7.80 / 10",
      status: "Final Year (Graduating 2026)",
      location: "Changa, Gujarat"
    },
    {
      degree: "Diploma in Engineering",
      institution: "GTU (Gujarat Technological University)",
      score: "CGPA 8.70 / 10",
      status: "Completed",
      location: "Gujarat"
    },
    {
      degree: "SSC (Secondary School Certificate)",
      institution: "Sarasvati School, Junagadh (GSEB)",
      score: "94.86%",
      status: "Completed",
      location: "Junagadh, Gujarat"
    }
  ],

  timeline: [
    {
      year: "Schooling",
      title: "SSC (Secondary School Certificate)",
      organization: "Sarasvati School, Junagadh (GSEB)",
      score: "Score: 94.86%",
      type: "education",
      // Verbatim record from user details
      description: "Secondary education completed with 94.86% under Gujarat Secondary Education Board."
    },
    {
      year: "Diploma",
      title: "Diploma in Engineering",
      organization: "GTU (Gujarat Technological University)",
      score: "CGPA: 8.70 / 10",
      type: "education",
      // Verbatim record from user details
      description: "Foundational technical diploma program completed with an 8.70 CGPA."
    },
    {
      year: "2022 — 2026",
      title: "B.Tech in IT / Computer Science",
      organization: "CHARUSAT",
      score: "CGPA: 7.80 / 10",
      type: "education",
      // Verbatim record from user details
      description: "Final-year undergraduate study specializing in full-stack development, AI/ML, and GenAI."
    },
    {
      // TODO: Replace with exact internship tenure dates (e.g., Jun 2024 — Aug 2024)
      year: "TODO: [Dates]",
      title: "Intern",
      organization: "AIQuantum Smart Solutions",
      location: "Mangalore, India",
      type: "work",
      // Verbatim record from user details
      description: "Software engineering internship at AIQuantum Smart Solutions, Mangalore."
    },
    {
      // TODO: Replace with exact internship tenure dates (e.g., Jan 2025 — Apr 2025)
      year: "TODO: [Dates]",
      title: "Intern",
      organization: "BrainyBeam Technology",
      location: "Ahmedabad, India",
      type: "work",
      // Verbatim record from user details
      description: "Software engineering internship at BrainyBeam Technology, Ahmedabad."
    }
  ],

  certifications: [
    // TODO: Add official certification credentials, provider, and verification links
    {
      title: "Machine Learning & AI Foundations",
      issuer: "TODO: Issuer Name",
      year: "2024"
    },
    {
      title: "Full-Stack Web Engineering",
      issuer: "TODO: Issuer Name",
      year: "2024"
    },
    {
      title: "Cloud & Automation Systems",
      issuer: "TODO: Issuer Name",
      year: "2025"
    }
  ]
};

