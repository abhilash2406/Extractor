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
    experienceYears: '7+ Years',
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
    ],
    volunteering: [
      { role: 'Open Source Mentor', organization: 'Code2Success Foundation', period: '2021 - Present', description: 'Coached underrepresented university students in web development and algorithmic problem solving.' }
    ],
    publications: [
      { title: 'Scaling Distributed Document Parsing on Micro-VMs', publisher: 'IEEE Cloud & Systems Letters', year: '2023', link: 'https://ieee.org/papers/scaling-parsing' }
    ],
    coursework: [
      'Distributed Systems', 'Advanced Database Internals', 'Cloud Infrastructure', 'Concurrent Programming'
    ],
    hobbies: [
      'Open-source hardware', 'Trail marathon runner', 'Chess (1950 Elo)'
    ],
    references: 'Available upon request'
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
    experienceYears: '8+ Years',
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
    experienceYears: '9+ Years',
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
  },

  student_fresher: {
    id: 'student_fresher',
    name: 'Liam Parker',
    title: 'Computer Science Senior & ML Researcher',
    email: 'liam.parker@berkeley.edu',
    phone: '+1 (510) 642-1190',
    location: 'Berkeley, CA',
    website: 'https://liamparker.ai',
    linkedin: 'linkedin.com/in/liam-parker-cs',
    github: 'github.com/liamparker',
    photo_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80',
    experienceYears: 'Fresher / Graduating 2025',
    summary: 'High-achieving Computer Science senior at UC Berkeley (GPA 3.92) with deep interest in generative AI and distributed systems. Built open-source multimodal tooling with 1,200+ GitHub stars. Proven capability translating theoretical algorithms into production code through SWE internships.',
    education: [
      {
        id: 'edu-student-1',
        degree: 'B.S. in Computer Science (Honors)',
        institution: 'University of California, Berkeley',
        location: 'Berkeley, CA',
        period: '2021 - May 2025 (Expected)',
        grade: 'GPA: 3.92 / 4.00 (EECS Dean\'s Honor List, all semesters)'
      }
    ],
    projects: [
      {
        id: 'proj-student-1',
        name: 'NeuralDiff — Fast Latent Consistency Tool',
        role: 'Author & Lead Developer',
        link: 'https://github.com/liamparker/neuraldiff',
        description: 'Open-source acceleration engine for latent diffusion inference. Reduced step computation time by 48% using PyTorch TensorRT integration. Starred by 1.2k developers.'
      },
      {
        id: 'proj-student-2',
        name: 'CampusFleet — Real-Time Transit Tracker',
        role: 'Team Lead (Hackathon Winner)',
        link: 'https://campusfleet.live',
        description: 'Full-stack campus shuttle navigation app with WebSocket geospatial tracking, serving 8,500 daily active Berkeley students.'
      },
      {
        id: 'proj-student-3',
        name: 'Distributed KV Store with Raft Consensus',
        role: 'Coursework Capstone',
        link: 'https://github.com/liamparker/raft-kv',
        description: 'Fault-tolerant consensus algorithm implementation in Go supporting leader election, log replication, and snapshotting under network partitions.'
      }
    ],
    experience: [
      {
        id: 'exp-student-1',
        title: 'Software Engineering Intern',
        company: 'Scale AI',
        location: 'San Francisco, CA',
        period: 'Summer 2024',
        description: [
          'Engineered synthetic data validation pipeline in Python and Ray, processing 500k+ tokens/sec with 99.8% uptime.',
          'Built evaluation dashboard with Next.js and Tailwind CSS used by 30+ internal machine learning scientists.'
        ]
      }
    ],
    skills: [
      { category: 'Programming & ML', items: ['Python', 'TypeScript', 'Go', 'PyTorch', 'C++', 'SQL'] },
      { category: 'Web & Infrastructure', items: ['React', 'Next.js', 'FastAPI', 'Docker', 'PostgreSQL', 'Git'] }
    ],
    coursework: [
      'CS 162: Operating Systems',
      'CS 189: Machine Learning',
      'CS 170: Efficient Algorithms',
      'CS 186: Database Systems'
    ],
    awards: [
      { id: 'aw-1', title: '1st Place Winner — CalHacks XI (AI Track)', issuer: 'UC Berkeley', year: '2024' },
      { id: 'aw-2', title: 'Regents’ and Chancellor’s Scholar', issuer: 'UC Berkeley', year: '2021' }
    ],
    languages: [
      { name: 'English', proficiency: 'Native' },
      { name: 'Mandarin', proficiency: 'Conversational' }
    ],
    hobbies: [
      'Competitive Hackathons', 'Open Source', 'Bouldering'
    ],
    references: 'Available upon request'
  },

  executive_leader: {
    id: 'executive_leader',
    name: 'Marcus Vance',
    title: 'Chief Technology Officer & VP Engineering',
    email: 'm.vance@vanceholdings.com',
    phone: '+1 (415) 890-4412',
    location: 'San Francisco, CA',
    website: 'https://marcusvance.exec',
    linkedin: 'linkedin.com/in/marcus-vance-cto',
    photo_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    experienceYears: '15+ Years Executive',
    summary: 'Transformational Technology Executive with 15+ years leading global engineering and product organizations through rapid scale, IPO preparation, and multi-cloud transformation. Scaled engineering from 25 to 180+ across 4 global hubs while sustaining 99.99% enterprise SLA and trimming infrastructure COGS by 38%.',
    experience: [
      {
        id: 'exp-exec-1',
        title: 'Chief Technology Officer',
        company: 'OmniCloud Technologies (Series D)',
        location: 'San Francisco, CA',
        period: '2021 - Present',
        description: [
          'Direct enterprise technology roadmap and $32M annual engineering budget across 140 engineers, PMs, and DevOps leads.',
          'Spearheaded enterprise AI modernization, unlocking $28M in new annual contract value (ACV) within Fortune 500 accounts.',
          'Maintained SOC 2 Type II, ISO 27001, and FedRAMP readiness with zero critical compliance breaches.'
        ]
      },
      {
        id: 'exp-exec-2',
        title: 'Vice President of Engineering',
        company: 'Stratos Data Systems (Acquired for $220M)',
        location: 'Palo Alto, CA',
        period: '2016 - 2021',
        description: [
          'Scaled global engineering org from 22 to 95 personnel, reducing employee turnover to under 6% through mentorship programs.',
          'Re-architected core analytical streaming platform, handling 4 billion daily events while cutting AWS infrastructure spend by $2.4M annually.',
          'Partnered with CEO and board of directors through successful Series B ($35M) and M&A due diligence.'
        ]
      },
      {
        id: 'exp-exec-3',
        title: 'Director of Systems Architecture',
        company: 'Apex Global Networks',
        location: 'Mountain View, CA',
        period: '2011 - 2016',
        description: [
          'Led architecture of low-latency distributed edge proxy layer processing over 15% of North American commercial CDN traffic.',
          'Authored 4 US patents in distributed cache eviction and real-time load balancing.'
        ]
      }
    ],
    education: [
      {
        id: 'edu-exec-1',
        degree: 'M.S. in Electrical Engineering & Computer Systems',
        institution: 'Stanford University',
        location: 'Stanford, CA',
        period: '2009 - 2011'
      },
      {
        id: 'edu-exec-2',
        degree: 'B.S. in Computer Science',
        institution: 'Carnegie Mellon University',
        location: 'Pittsburgh, PA',
        period: '2005 - 2009',
        grade: 'University Honors'
      }
    ],
    skills: [
      { category: 'Executive Competencies', items: ['Global Engineering Scale', 'M&A Tech Diligence', 'Budget & P&L ($30M+)', 'Board Advisory', 'Enterprise Security & SOC-2', 'Talent Retention'] },
      { category: 'Technology Domains', items: ['Enterprise Cloud & Multi-Region', 'Distributed Systems', 'LLM Platforms', 'FinOps & Cost Optimization', 'Kubernetes', 'Cybersecurity'] }
    ],
    projects: [
      {
        id: 'proj-exec-1',
        name: 'Enterprise Multi-Cloud Resilience Transformation',
        role: 'Executive Sponsor',
        description: 'Complete zero-downtime migration of 14 petabytes of enterprise financial data from private data centers to AWS/GCP hybrid mesh.'
      }
    ],
    certifications: [
      { id: 'cert-exec-1', name: 'NACD Directorship Certified', issuer: 'National Association of Corporate Directors', year: '2023' }
    ],
    languages: [
      { name: 'English', proficiency: 'Native' },
      { name: 'German', proficiency: 'Professional' }
    ],
    awards: [
      { id: 'aw-exec-1', title: 'Bay Area CTO of the Year Finalist', issuer: 'SF Business Times', year: '2023' }
    ],
    references: 'Executive references available from Board Directors upon request'
  }
};

