/**
 * HTML Template Renderer for Resume PDF Generation
 * Produces clean, ATS-optimized, high-fidelity A4 printable HTML matching the frontend preview.
 */

const escapeHtml = (str) => {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

// Lucide-style clean SVG icons for high-resolution print rendering
const SVG_ICONS = {
  mail: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -1.5px; display: inline-block;"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`,
  phone: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -1.5px; display: inline-block;"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
  mapPin: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -1.5px; display: inline-block;"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>`,
  globe: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -1.5px; display: inline-block;"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>`,
  linkedin: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -1.5px; display: inline-block;"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>`,
  github: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -1.5px; display: inline-block;"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>`,
};

export const renderResumeHtml = (content = {}, templateConfig = null, documentTitle = 'Resume') => {
  const design = templateConfig?.design_config || {};
  const primaryColor = design.primaryColor || '#2563eb';
  const headingColor = design.headingColor || '#0f172a';
  const textColor = design.textColor || '#1e293b';
  const fontFamily = design.fontFamily || "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  const headingFontFamily = design.headingFontFamily || fontFamily;

  // Font scaling
  const fontSize = design.fontSize || '10pt';
  const fontSizes = {
    '7pt': { base: '7pt', name: '17pt', title: '7.8pt', section: '8.8pt', small: '6.2pt' },
    '7.5pt': { base: '7.5pt', name: '18pt', title: '8.4pt', section: '9.4pt', small: '6.6pt' },
    '8pt': { base: '8pt', name: '19pt', title: '9pt', section: '10pt', small: '7pt' },
    '8.5pt': { base: '8.5pt', name: '20pt', title: '9.5pt', section: '10.6pt', small: '7.5pt' },
    '9pt': { base: '9pt', name: '21pt', title: '10.1pt', section: '11.3pt', small: '8pt' },
    '9.5pt': { base: '9.5pt', name: '22pt', title: '10.6pt', section: '11.9pt', small: '8.4pt' },
    '10pt': { base: '10pt', name: '22pt', title: '11pt', section: '12pt', small: '8.6pt' },
    '10.5pt': { base: '10.5pt', name: '23.5pt', title: '11.6pt', section: '12.8pt', small: '9pt' },
    '11pt': { base: '11pt', name: '25pt', title: '12.2pt', section: '13.5pt', small: '9.5pt' },
    '11.5pt': { base: '11.5pt', name: '26pt', title: '12.8pt', section: '14.2pt', small: '10pt' },
    '12pt': { base: '12pt', name: '27pt', title: '13.4pt', section: '15pt', small: '10.5pt' },
    '12.5pt': { base: '12.5pt', name: '28pt', title: '14pt', section: '15.6pt', small: '11pt' },
    '13pt': { base: '13pt', name: '29pt', title: '14.6pt', section: '16.3pt', small: '11.4pt' },
    '14pt': { base: '14pt', name: '31pt', title: '15.7pt', section: '17.5pt', small: '12.2pt' },
  }[fontSize] || { base: '10pt', name: '22pt', title: '11pt', section: '12pt', small: '8.6pt' };

  const {
    fullName = '',
    jobTitle = '',
    email = '',
    phone = '',
    location = '',
    website = '',
    linkedin = '',
    github = '',
    summary = '',
    experiences = content.experience || [],
    education = content.educations || [],
    skills = [],
    projects = [],
    certifications = [],
    photo = '',
    photo_url = '',
  } = content;

  const candidatePhoto = photo || photo_url;
  const showPhoto = design.showPhoto !== false && Boolean(candidatePhoto);
  const photoShape = design.photoShape || 'circle';
  const photoRadius = photoShape === 'circle' ? '50%' : photoShape === 'rounded' ? '8px' : '2px';

  // Contact items with clean SVG icons
  const contactItems = [];
  if (email) {
    contactItems.push(`<span><span class="icon">${SVG_ICONS.mail}</span> ${escapeHtml(email)}</span>`);
  }
  if (phone) {
    contactItems.push(`<span><span class="icon">${SVG_ICONS.phone}</span> ${escapeHtml(phone)}</span>`);
  }
  if (location) {
    contactItems.push(`<span><span class="icon">${SVG_ICONS.mapPin}</span> ${escapeHtml(location)}</span>`);
  }
  if (website) {
    contactItems.push(`<span><span class="icon">${SVG_ICONS.globe}</span> <a href="${escapeHtml(website)}" target="_blank">${escapeHtml(website.replace(/^https?:\/\//i, ''))}</a></span>`);
  }
  if (linkedin) {
    contactItems.push(`<span><span class="icon">${SVG_ICONS.linkedin}</span> <a href="${escapeHtml(linkedin)}" target="_blank">${escapeHtml(linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//i, 'linkedin.com/in/'))}</a></span>`);
  }
  if (github) {
    contactItems.push(`<span><span class="icon">${SVG_ICONS.github}</span> <a href="${escapeHtml(github)}" target="_blank">${escapeHtml(github.replace(/^https?:\/\/(www\.)?github\.com\//i, 'github.com/'))}</a></span>`);
  }

  // Experiences HTML
  const experiencesList = Array.isArray(experiences) ? experiences : [];
  const experiencesHtml = experiencesList.length > 0
    ? `
      <section class="section">
        <h2 class="section-title">Work Experience</h2>
        <div class="items">
          ${experiencesList.map(exp => {
            const periodStr = exp.period || (exp.startDate ? `${exp.startDate} - ${exp.endDate || (exp.current ? 'Present' : '')}` : '');
            const bullets = Array.isArray(exp.bullets) ? exp.bullets : (Array.isArray(exp.description) ? exp.description : (typeof exp.description === 'string' && exp.description ? [exp.description] : []));
            return `
              <div class="item">
                <div class="item-header">
                  <div>
                    <div class="item-role">${escapeHtml(exp.position || exp.title || '')}</div>
                    <div class="item-company">${escapeHtml(exp.company || '')} ${exp.location ? `• <span class="muted">${escapeHtml(exp.location)}</span>` : ''}</div>
                  </div>
                  ${periodStr ? `<div class="item-date">${escapeHtml(periodStr)}</div>` : ''}
                </div>
                ${bullets.length > 0 ? `
                  <ul class="bullets">
                    ${bullets.map(b => `<li>${escapeHtml(b)}</li>`).join('')}
                  </ul>
                ` : ''}
              </div>
            `;
          }).join('')}
        </div>
      </section>
    `
    : '';

  // Education HTML
  const educationList = Array.isArray(education) ? education : [];
  const educationHtml = educationList.length > 0
    ? `
      <section class="section">
        <h2 class="section-title">Education</h2>
        <div class="items">
          ${educationList.map(edu => {
            const periodStr = edu.period || edu.year || (edu.startDate ? `${edu.startDate} - ${edu.endDate || (edu.current ? 'Present' : '')}` : '');
            return `
              <div class="item">
                <div class="item-header">
                  <div>
                    <div class="item-role">${escapeHtml(edu.degree || '')}</div>
                    <div class="item-company">${escapeHtml(edu.school || edu.institution || '')} ${edu.location ? `• <span class="muted">${escapeHtml(edu.location)}</span>` : ''}</div>
                  </div>
                  <div class="text-right">
                    ${periodStr ? `<div class="item-date">${escapeHtml(periodStr)}</div>` : ''}
                    ${edu.gpa ? `<div class="muted text-xs mt-0-5">GPA: ${escapeHtml(edu.gpa)}</div>` : ''}
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </section>
    `
    : '';

  // Skills HTML
  const skillsList = Array.isArray(skills) ? skills : [];
  const skillsHtml = skillsList.length > 0
    ? `
      <section class="section">
        <h2 class="section-title">Skills & Proficiencies</h2>
        <div class="skills-grid">
          ${skillsList.map(skill => {
            const name = typeof skill === 'string' ? skill : skill.name;
            return `<span class="skill-badge">${escapeHtml(name)}</span>`;
          }).join('')}
        </div>
      </section>
    `
    : '';

  // Projects HTML
  const projectsList = Array.isArray(projects) ? projects : [];
  const projectsHtml = projectsList.length > 0
    ? `
      <section class="section">
        <h2 class="section-title">Key Projects</h2>
        <div class="items">
          ${projectsList.map(proj => {
            const bullets = Array.isArray(proj.bullets) && proj.bullets.length > 0
              ? proj.bullets
              : (Array.isArray(proj.description) ? proj.description : (typeof proj.description === 'string' && (proj.description.includes('•') || proj.description.includes('\n')))
                ? proj.description.split(/\n+|•|\r+/).map(s => s.trim()).filter(Boolean)
                : proj.description ? [proj.description] : []);

            return `
              <div class="item">
                <div class="item-header">
                  <div>
                    <span class="item-role">${escapeHtml(proj.name || proj.title || '')}</span>
                    ${proj.role ? `<span class="role-badge">${escapeHtml(proj.role)}</span>` : ''}
                  </div>
                  ${proj.link ? `<a href="${escapeHtml(proj.link)}" class="item-link" target="_blank">${escapeHtml(proj.link.replace(/^https?:\/\//i, ''))}</a>` : ''}
                </div>
                ${bullets.length > 0 ? `
                  <ul class="bullets">
                    ${bullets.map(b => `<li>${escapeHtml(b)}</li>`).join('')}
                  </ul>
                ` : ''}
                ${Array.isArray(proj.tech) && proj.tech.length > 0 ? `
                  <div class="skills-grid mt-1">
                    ${proj.tech.map(t => `<span class="skill-badge">${escapeHtml(t)}</span>`).join('')}
                  </div>
                ` : ''}
              </div>
            `;
          }).join('')}
        </div>
      </section>
    `
    : '';

  // Certifications HTML
  const certsList = Array.isArray(certifications) ? certifications : [];
  const certsHtml = certsList.length > 0
    ? `
      <section class="section">
        <h2 class="section-title">Certifications</h2>
        <div class="items">
          ${certsList.map(c => `
            <div class="item">
              <div class="item-header">
                <div>
                  <div class="item-role">${escapeHtml(c.name || '')}</div>
                  ${c.issuer ? `<div class="muted text-xs">${escapeHtml(c.issuer)}</div>` : ''}
                </div>
                ${c.year ? `<div class="item-date">${escapeHtml(c.year)}</div>` : ''}
              </div>
            </div>
          `).join('')}
        </div>
      </section>
    `
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${escapeHtml(documentTitle)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Merriweather:ital,wght@0,300;0,400;0,700;1,400&family=Outfit:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Poppins:wght@400;500;600;700&family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
  <style>
    @page {
      size: A4;
      margin: 12mm 14mm;
    }
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: ${fontFamily};
      color: ${textColor};
      background: #ffffff;
      font-size: ${fontSizes.base};
      line-height: 1.45;
      -webkit-font-smoothing: antialiased;
    }
    .header {
      padding-bottom: 10px;
      margin-bottom: 14px;
    }
    .header-layout {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }
    .header-text {
      flex: 1;
    }
    .header-photo {
      width: 72px;
      height: 72px;
      border-radius: ${photoRadius};
      object-fit: cover;
      border: 2px solid ${primaryColor};
      flex-shrink: 0;
    }
    .name {
      font-family: ${headingFontFamily};
      font-size: ${fontSizes.name};
      font-weight: 800;
      color: ${headingColor};
      letter-spacing: -0.5px;
      line-height: 1.15;
    }
    .title {
      font-family: ${headingFontFamily};
      font-size: ${fontSizes.title};
      font-weight: 600;
      color: ${primaryColor};
      text-transform: uppercase;
      letter-spacing: 0.04em;
      margin-top: 3px;
    }
    .contacts {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 12px;
      margin-top: 8px;
      font-size: ${fontSizes.small};
      color: #475569;
    }
    .contacts span {
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }
    .contacts a {
      color: #475569;
      text-decoration: none;
    }
    .contacts .icon {
      color: ${primaryColor};
      display: inline-flex;
      align-items: center;
      flex-shrink: 0;
    }
    .section {
      margin-bottom: 14px;
      page-break-inside: auto;
      break-inside: auto;
    }
    .page-break-before {
      page-break-before: always !important;
      break-before: page !important;
    }
    .section-title {
      font-family: ${headingFontFamily};
      font-size: ${fontSizes.section};
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: ${headingColor};
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 3px;
      margin-bottom: 9px;
      display: flex;
      align-items: center;
      break-after: avoid !important;
      page-break-after: avoid !important;
    }
    .summary-text {
      font-size: ${fontSizes.base};
      line-height: 1.5;
      color: #334155;
    }
    .items {
      display: block;
    }
    .item {
      margin-bottom: 11px;
      page-break-inside: avoid;
      break-inside: avoid;
    }
    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      gap: 8px;
    }
    .item-role {
      font-size: ${fontSizes.base};
      font-weight: 700;
      color: ${headingColor};
    }
    .item-company {
      font-size: ${fontSizes.small};
      font-weight: 600;
      color: ${primaryColor};
      margin-top: 1px;
    }
    .item-date {
      display: inline-block;
      padding: 1.5px 8px;
      border-radius: 9999px;
      font-size: ${fontSizes.small};
      font-weight: 600;
      color: ${primaryColor};
      background: ${primaryColor}14;
      border: 1px solid ${primaryColor}30;
      white-space: nowrap;
      flex-shrink: 0;
    }
    .role-badge {
      display: inline-block;
      padding: 1.5px 7px;
      border-radius: 4px;
      font-size: ${fontSizes.small};
      font-weight: 600;
      color: ${primaryColor};
      background: ${primaryColor}14;
      border: 1px solid ${primaryColor}25;
      white-space: nowrap;
      margin-left: 6px;
    }
    .muted {
      color: #64748b;
      font-weight: 400;
    }
    .text-xs {
      font-size: ${fontSizes.small};
    }
    .mt-0-5 {
      margin-top: 2px;
    }
    .mt-1 {
      margin-top: 4px;
    }
    .text-right {
      text-align: right;
    }
    .bullets {
      margin-top: 4px;
      padding-left: 18px;
      list-style-type: disc;
    }
    .bullets li {
      font-size: ${fontSizes.base};
      line-height: 1.45;
      color: #334155;
      margin-bottom: 2.5px;
    }
    .skills-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 4px;
    }
    .skill-badge {
      display: inline-block;
      padding: 2.5px 8px;
      background: #f1f5f9;
      border: 1px solid #e2e8f0;
      border-radius: 4px;
      font-size: ${fontSizes.small};
      font-weight: 500;
      color: #334155;
    }
    .item-link {
      font-size: ${fontSizes.small};
      color: ${primaryColor};
      text-decoration: none;
      word-break: break-all;
    }
  </style>
</head>
<body>
  <header class="header">
    <div class="header-layout">
      <div class="header-text">
        <h1 class="name">${escapeHtml(fullName || 'Alex Rivera')}</h1>
        ${jobTitle ? `<div class="title">${escapeHtml(jobTitle)}</div>` : ''}
        ${contactItems.length > 0 ? `<div class="contacts">${contactItems.join('')}</div>` : ''}
      </div>
      ${showPhoto ? `<img src="${candidatePhoto}" alt="${escapeHtml(fullName || 'Profile')}" class="header-photo" />` : ''}
    </div>
  </header>

  ${(() => {
    const sectionsMap = {
      summary: summary ? `
        <section class="section">
          <h2 class="section-title">Professional Summary</h2>
          <p class="summary-text">${escapeHtml(summary)}</p>
        </section>
      ` : '',
      experience: experiencesHtml,
      education: educationHtml,
      skills: skillsHtml,
      projects: projectsHtml,
      certifications: certsHtml,
    };

    const sectionOrder = Array.isArray(content.sectionOrder) && content.sectionOrder.length > 0
      ? content.sectionOrder
      : ['summary', 'experience', 'projects', 'education', 'skills', 'certifications'];

    return sectionOrder
      .filter(type => !content.hiddenSections?.[type])
      .map(type => {
        let html = sectionsMap[type] || '';
        if (html && content.pageBreaks?.[type] && !html.includes('page-break-before')) {
          html = html.replace('class="section"', 'class="section page-break-before"');
        }
        return html;
      })
      .filter(Boolean)
      .join('\n');
  })()}
</body>
</html>`;
};
