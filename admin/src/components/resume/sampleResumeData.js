export const samplePersonas = {
  software_engineer: {
    id: 'software_engineer',
    name: 'Alex Morgan',
    title: 'Senior Full-Stack Engineer & Architect',
    email: 'alex.morgan@example.com',
    phone: '+1 (555) 349-8201',
    location: 'San Francisco, CA',
    website: 'https://alexmorgan.dev',
    linkedin: 'linkedin.com/in/alex-morgan-dev',
    github: 'github.com/alexm-eng',
    photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    summary: 'Senior Software Engineer with 7+ years of experience designing resilient distributed microservices and modern web applications. Proven track record leading cross-functional teams, reducing API latencies by 42%, and architecting platforms serving over 3 million monthly active users.',
    experience: [
      {
        id: 'exp-1',
        title: 'Lead Software Engineer',
        company: 'Veloce Cloud Systems',
        location: 'San Francisco, CA',
        period: '2022 - Present',
        description: [
          'Spearheaded migration of legacy monolith to Kubernetes-orchestrated microservices, improving deployment frequency by 300%.',
          'Architected high-throughput data processing pipeline using Node.js, Kafka, and Redis, reducing p99 latency from 450ms to 85ms.',
          'Mentored 6 junior and mid-level engineers, implemented strict automated CI/CD code quality gates with 95% test coverage.'
        ]
      },
      {
        id: 'exp-2',
        title: 'Senior Frontend Engineer',
        company: 'HyperScale AI',
        location: 'Austin, TX (Remote)',
        period: '2020 - 2022',
        description: [
          'Engineered real-time analytics dashboard with React, TypeScript, and WebSockets handling 100k+ live events per second.',
          'Built design system component library adopted across 8 engineering squads, decreasing frontend feature turnaround by 35%.',
          'Optimized bundle sizes and core web vitals, raising Google Lighthouse performance score from 68 to 98.'
        ]
      },
      {
        id: 'exp-3',
        title: 'Full-Stack Developer',
        company: 'Nexus Digital Labs',
        location: 'Seattle, WA',
        period: '2018 - 2020',
        description: [
          'Developed customer-facing onboarding flows and payment integration with Stripe, boosting trial-to-paid conversion by 22%.',
          'Collaborated with product and UX teams to build responsive web apps with React, Express, PostgreSQL, and AWS S3.'
        ]
      }
    ],
    education: [
      {
        id: 'edu-1',
        degree: 'B.S. in Computer Science',
        institution: 'University of Washington',
        location: 'Seattle, WA',
        period: '2014 - 2018',
        grade: 'Magna Cum Laude (3.85 GPA)'
      }
    ],
    skills: [
      { category: 'Frontend', items: ['React 19', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Redux / Zustand', 'Vite'] },
      { category: 'Backend & Cloud', items: ['Node.js', 'Express', 'Python', 'PostgreSQL', 'Redis', 'Docker', 'AWS', 'Kubernetes'] },
      { category: 'Architecture', items: ['Microservices', 'GraphQL', 'REST APIs', 'CI/CD Pipelines', 'System Design'] }
    ],
    projects: [
      {
        id: 'proj-1',
        name: 'AutoDoc AI — Resume & Document Intelligence',
        role: 'Creator & Lead Developer',
        link: 'https://autodoc.ai',
        description: 'Open-source multimodal document parsing engine leveraging LLMs and OCR to extract structured schemas with 99.2% accuracy.'
      },
      {
        id: 'proj-2',
        name: 'PulseFlow — Real-time Web Event Streamer',
        role: 'Solo Project',
        link: 'https://github.com/alexm-eng/pulseflow',
        description: 'Lightweight distributed pub/sub client library built with Rust and WebSockets for edge messaging under 5ms.'
      }
    ],
    certifications: [
      { id: 'cert-1', name: 'AWS Certified Solutions Architect – Professional', issuer: 'Amazon Web Services', year: '2023' },
      { id: 'cert-2', name: 'CKA: Certified Kubernetes Administrator', issuer: 'Cloud Native Computing Foundation', year: '2022' }
    ],
    languages: [
      { name: 'English', proficiency: 'Native / Bilingual' },
      { name: 'Spanish', proficiency: 'Professional Working' },
      { name: 'German', proficiency: 'Conversational' }
    ],
    awards: [
      { id: 'award-1', title: 'Top Engineering Innovator Award', issuer: 'Veloce Cloud Systems', year: '2023' }
    ]
  },

  product_designer: {
    id: 'product_designer',
    name: 'Sophia Martinez',
    title: 'Staff Product Designer & Design Strategist',
    email: 'sophia.martinez@design.co',
    phone: '+1 (555) 782-9912',
    location: 'New York, NY',
    website: 'https://sophiamartinez.design',
    linkedin: 'linkedin.com/in/sophia-martinez-ux',
    github: 'dribbble.com/sophiam',
    photo_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    summary: 'Strategic Staff Product Designer with 8+ years crafting intuitive consumer experiences, design systems, and enterprise SaaS platforms. Expert in user-centered discovery, high-fidelity interactive prototyping, and cross-discipline collaboration between business, data, and engineering.',
    experience: [
      {
        id: 'exp-1',
        title: 'Staff Product Designer',
        company: 'Stripe Horizon',
        location: 'New York, NY',
        period: '2021 - Present',
        description: [
          'Led end-to-end design for developer billing workflows, increasing self-serve checkout completion by 28%.',
          'Established multi-platform token design system used by 120+ designers and engineers globally.',
          'Conducted over 60 qualitative user discovery sessions and usability testing rounds across enterprise accounts.'
        ]
      },
      {
        id: 'exp-2',
        title: 'Senior UX Designer',
        company: 'Fintech Spark',
        location: 'San Francisco, CA',
        period: '2018 - 2021',
        description: [
          'Reimagined mobile wealth management experience from ground up, contributing to a 4.8-star App Store rating.',
          'Partnered closely with product leaders to define product roadmaps, user personas, and OKRs.'
        ]
      }
    ],
    education: [
      {
        id: 'edu-1',
        degree: 'B.F.A. in Interaction Design',
        institution: 'Rhode Island School of Design (RISD)',
        location: 'Providence, RI',
        period: '2014 - 2018',
        grade: 'Honors'
      }
    ],
    skills: [
      { category: 'Design & UX', items: ['Design Systems', 'Figma', 'User Research', 'Information Architecture', 'Prototyping', 'Usability Testing'] },
      { category: 'Methods & Tools', items: ['Framer', 'Design Sprints', 'Wireframing', 'WCAG Accessibility', 'A/B Experimentation'] }
    ],
    projects: [
      {
        id: 'proj-1',
        name: 'Horizon Design System',
        role: 'Design System Lead',
        link: 'https://horizon.design',
        description: 'Comprehensive multi-brand design tokens, components, and documentation published on Figma Community.'
      }
    ],
    certifications: [
      { id: 'cert-1', name: 'Nielsen Norman Group UX Master Certified', issuer: 'NN/g', year: '2021' }
    ],
    languages: [
      { name: 'English', proficiency: 'Native' },
      { name: 'French', proficiency: 'Fluent' }
    ],
    awards: [
      { id: 'award-1', title: 'Best Mobile Fintech UX', issuer: 'Design Week Awards', year: '2021' }
    ]
  },

  marketing_lead: {
    id: 'marketing_lead',
    name: 'Daniel Chen',
    title: 'Head of Growth & Digital Strategy',
    email: 'daniel.chen@growth.io',
    phone: '+1 (555) 914-2200',
    location: 'Chicago, IL',
    website: 'https://danielchen.growth',
    linkedin: 'linkedin.com/in/daniel-chen-growth',
    github: 'twitter.com/daniel_growth',
    photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    summary: 'Data-driven Growth Marketing Executive with 9+ years scaling B2B SaaS ARR from $2M to $25M. Proven authority in multi-channel acquisition, product-led growth (PLG) loops, brand storytelling, and high-velocity conversion optimization.',
    experience: [
      {
        id: 'exp-1',
        title: 'Vice President of Growth Marketing',
        company: 'Acrobat Analytics',
        location: 'Chicago, IL',
        period: '2022 - Present',
        description: [
          'Scaled annual recurring revenue (ARR) from $8M to $24M in 24 months through combined PLG and enterprise sales funnels.',
          'Managed $4.5M annual marketing budget across Paid Search, LinkedIn Ads, Content, and Partner sponsorships.',
          'Built and led an international team of 14 growth marketers, content creators, and data analysts.'
        ]
      },
      {
        id: 'exp-2',
        title: 'Director of Demand Generation',
        company: 'CloudPulse Technologies',
        location: 'Boston, MA',
        period: '2019 - 2022',
        description: [
          'Decreased customer acquisition cost (CAC) by 34% while growing qualified sales leads (SQLs) by 140% YoY.',
          'Implemented HubSpot and Salesforce marketing attribution pipelines with real-time lifecycle tracking.'
        ]
      }
    ],
    education: [
      {
        id: 'edu-1',
        degree: 'B.A. in Marketing & Economics',
        institution: 'Northwestern University',
        location: 'Evanston, IL',
        period: '2013 - 2017',
        grade: 'Dean’s List'
      }
    ],
    skills: [
      { category: 'Growth Strategy', items: ['PLG Loops', 'CAC / LTV Optimization', 'SEO Strategy', 'Demand Gen', 'Funnel Analytics'] },
      { category: 'Stack', items: ['HubSpot', 'Google Analytics 4', 'Mixpanel', 'Semrush', 'Looker', 'Salesforce'] }
    ],
    projects: [
      {
        id: 'proj-1',
        name: 'The SaaS Growth Engine Playbook',
        role: 'Author & Curator',
        link: 'https://saasgrowth.guide',
        description: 'Comprehensive tactical guide downloaded by 35,000+ founders and CMOs worldwide.'
      }
    ],
    certifications: [
      { id: 'cert-1', name: 'Reforge Growth Series Graduate', issuer: 'Reforge', year: '2020' }
    ],
    languages: [
      { name: 'English', proficiency: 'Native' },
      { name: 'Mandarin Chinese', proficiency: 'Fluent' }
    ],
    awards: [
      { id: 'award-1', title: 'Top 50 B2B Marketers to Watch', issuer: 'SaaS Mag', year: '2023' }
    ]
  }
};
