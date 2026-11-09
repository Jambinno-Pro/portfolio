const PAGE_WIDTH = 595;
const PAGE_HEIGHT = 842;
const MARGIN = 42;

/* =========================================================
   MONOCHROME COLOUR PALETTE
========================================================= */

const BLACK = [0.05, 0.05, 0.05];
const HEADING = [0.1, 0.1, 0.1];
const TEXT = [0.2, 0.2, 0.2];
const MUTED = [0.4, 0.4, 0.4];
const LIGHT = [0.8, 0.8, 0.8];
const PALE = [0.965, 0.965, 0.965];
const WHITE = [1, 1, 1];

/* =========================================================
   BASIC HELPERS
========================================================= */

const normalize = (value) =>
  String(value ?? "")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .trim();

const safeText = (value) =>
  normalize(value)
    .replace(/•/g, "-")
    .replace(/[–—]/g, "-")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/→/g, "->")
    .replace(/[^\x20-\x7E\n\r\t]/g, "?");

const esc = (value) =>
  safeText(value)
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");

function colorString(color) {
  return color.join(" ");
}

/* =========================================================
   TEXT WRAPPING
========================================================= */

function wrap(text, maxChars) {
  const lines = [];

  safeText(text)
    .split("\n")
    .forEach((raw) => {
      if (!raw.trim()) {
        lines.push("");
        return;
      }

      let line = "";

      raw
        .trim()
        .split(/\s+/)
        .forEach((word) => {
          if (word.length > maxChars) {
            if (line) {
              lines.push(line);
            }

            line = "";

            for (let i = 0; i < word.length; i += maxChars) {
              lines.push(word.slice(i, i + maxChars));
            }

            return;
          }

          const next = line ? `${line} ${word}` : word;

          if (next.length <= maxChars) {
            line = next;
          } else {
            if (line) {
              lines.push(line);
            }

            line = word;
          }
        });

      if (line) {
        lines.push(line);
      }
    });

  return lines;
}

function textHeight(text, maxChars, leading) {
  return Math.max(1, wrap(text, maxChars).length) * leading;
}

/* =========================================================
   PDF DRAWING HELPERS
========================================================= */

function fill(c, x, y, w, h, color) {
  c.push(`${colorString(color)} rg`, `${x} ${y} ${w} ${h} re f`);
}

function roundedRect(
  c,
  x,
  y,
  w,
  h,
  r,
  fillColor,
  strokeColor = null,
  width = 0.7,
) {
  const k = 0.5522848;
  const kr = r * k;

  const path = [
    `${x + r} ${y} m`,
    `${x + w - r} ${y} l`,
    `${x + w - r + kr} ${y} ${x + w} ${y + r - kr} ${x + w} ${y + r} c`,
    `${x + w} ${y + h - r} l`,
    `${x + w} ${y + h - r + kr} ${x + w - r + kr} ${y + h} ${x + w - r} ${y + h} c`,
    `${x + r} ${y + h} l`,
    `${x + r - kr} ${y + h} ${x} ${y + h - r + kr} ${x} ${y + h - r} c`,
    `${x} ${y + r} l`,
    `${x} ${y + r - kr} ${x + r - kr} ${y} ${x + r} ${y} c`,
    "h",
  ].join(" ");

  const parts = [];

  if (fillColor) {
    parts.push(`${colorString(fillColor)} rg`);
  }

  if (strokeColor) {
    parts.push(`${colorString(strokeColor)} RG`, `${width} w`);
  }

  const paint = fillColor && strokeColor ? "B" : fillColor ? "f" : "S";

  parts.push(`${path} ${paint}`);

  c.push(parts.join("\n"));
}

function rule(c, x1, y1, x2, y2, color = LIGHT, width = 0.7) {
  c.push(
    `${colorString(color)} RG`,
    `${width} w ${x1} ${y1} m ${x2} ${y2} l S`,
  );
}

function txt(c, text, x, y, size, color = TEXT, font = "F1") {
  if (!safeText(text)) {
    return;
  }

  c.push(
    `${colorString(color)} rg`,
    `BT /${font} ${size} Tf ${x} ${y} Td (${esc(text)}) Tj ET`,
  );
}

function block(c, text, x, y, options = {}) {
  const size = options.size || 9;
  const leading = options.leading || 12;
  const maxChars = options.maxChars || 60;
  const color = options.color || TEXT;
  const font = options.font || "F1";

  const lines = wrap(text, maxChars);

  if (!lines.length) {
    return y;
  }

  c.push(`${colorString(color)} rg`, `BT /${font} ${size} Tf ${x} ${y} Td`);

  lines.forEach((line, index) => {
    if (index) {
      c.push(`0 -${leading} Td`);
    }

    c.push(`(${esc(line)}) Tj`);
  });

  c.push("ET");

  return y - lines.length * leading;
}

/* =========================================================
   SECTION HEADING
========================================================= */

function sectionHeading(c, number, title, x, y, width) {
  txt(c, String(number).padStart(2, "0"), x, y, 9, MUTED, "F2");

  txt(c, title.toUpperCase(), x + 22, y, 11.5, HEADING, "F2");

  rule(c, x + 22, y - 8, x + width, y - 8, LIGHT, 0.8);
}

/* =========================================================
   DOCUMENT HEADER
========================================================= */

function header(c, resume, continuation = false) {
  if (continuation) {
    txt(c, "PROFESSIONAL RESUME", MARGIN, PAGE_HEIGHT - 44, 9, MUTED, "F2");

    txt(
      c,
      resume.fullName || "Professional Resume",
      MARGIN,
      PAGE_HEIGHT - 73,
      20,
      BLACK,
      "F2",
    );

    rule(
      c,
      MARGIN,
      PAGE_HEIGHT - 88,
      PAGE_WIDTH - MARGIN,
      PAGE_HEIGHT - 88,
      LIGHT,
      0.9,
    );

    return PAGE_HEIGHT - 112;
  }

  txt(c, "PROFESSIONAL RESUME", MARGIN, PAGE_HEIGHT - 44, 9, MUTED, "F2");

  txt(
    c,
    resume.fullName || "Professional Resume",
    MARGIN,
    PAGE_HEIGHT - 82,
    30,
    BLACK,
    "F2",
  );

  txt(
    c,
    resume.title || "Professional",
    MARGIN,
    PAGE_HEIGHT - 105,
    13,
    MUTED,
    "F2",
  );

  const contactItems = [
    resume.email,
    resume.phone,
    resume.location,
    resume.website,
  ].filter(Boolean);

  const contact = contactItems.join("   |   ");

  if (contact) {
    block(c, contact, MARGIN, PAGE_HEIGHT - 130, {
      size: 8.5,
      leading: 11,
      maxChars: 105,
      color: MUTED,
    });
  }

  rule(
    c,
    MARGIN,
    PAGE_HEIGHT - 151,
    PAGE_WIDTH - MARGIN,
    PAGE_HEIGHT - 151,
    LIGHT,
    0.9,
  );

  return PAGE_HEIGHT - 171;
}

/* =========================================================
   PROFILE
========================================================= */

function drawProfile(c, resume, y, width) {
  if (!resume.bio) {
    return y;
  }

  sectionHeading(c, 1, "Professional Profile", MARGIN, y, width);

  y -= 27;

  const maxChars = Math.max(35, Math.floor((width - 22) / 5.2));

  const lines = wrap(resume.bio, maxChars);

  const height = Math.max(48, lines.length * 12.5 + 22);

  roundedRect(c, MARGIN, y - height + 8, width, height, 4, PALE, LIGHT, 0.7);

  block(c, resume.bio, MARGIN + 12, y - 10, {
    size: 9.2,
    leading: 12.5,
    maxChars,
    color: TEXT,
  });

  return y - height - 16;
}

/* =========================================================
   EXPERIENCE
========================================================= */

const EXPERIENCE_TITLE_SIZE = 10.5;
const EXPERIENCE_BODY_SIZE = 9;
const EXPERIENCE_BODY_LEADING = 12.3;

function experienceLayout(item, width, maxChars) {
  const position = safeText(item.position || "Role");
  const company = safeText(item.company || "");
  const period = safeText(item.period || "");
  const description = safeText(item.description || "");

  const titleMaxChars = Math.max(24, Math.floor(width / 5.1));
  const titleLines = wrap(position, titleMaxChars).length;

  const descriptionLines = description ? wrap(description, maxChars).length : 0;

  const titleHeight = titleLines * 13;
  const companyHeight = company ? 13 : 0;
  const periodHeight = period ? 12 : 0;
  const descriptionHeight = descriptionLines
    ? descriptionLines * EXPERIENCE_BODY_LEADING + 8
    : 0;

  const totalHeight =
    titleHeight + companyHeight + periodHeight + descriptionHeight + 12;

  return {
    position,
    company,
    period,
    description,
    titleMaxChars,
    titleLines,
    descriptionLines,
    totalHeight,
  };
}

function experienceHeight(item, maxChars, width) {
  return experienceLayout(item, width, maxChars).totalHeight;
}

function drawExperienceEntry(c, item, x, y, width, maxChars) {
  const layout = experienceLayout(item, width, maxChars);

  block(c, layout.position, x, y, {
    size: EXPERIENCE_TITLE_SIZE,
    leading: 13,
    maxChars: layout.titleMaxChars,
    color: HEADING,
    font: "F2",
  });

  y -= layout.titleLines * 13;

  if (layout.company) {
    txt(c, layout.company, x, y, 9.5, TEXT, "F2");
    y -= 13;
  }

  if (layout.period) {
    txt(c, layout.period, x, y, 8.5, MUTED);
    y -= 12;
  }

  if (layout.description) {
    y = block(c, layout.description, x, y, {
      size: EXPERIENCE_BODY_SIZE,
      leading: EXPERIENCE_BODY_LEADING,
      maxChars,
      color: TEXT,
    });

    y -= 8;
  }

  return y - 4;
}

function drawExperience(c, resume, x, y, width, bottomLimit) {
  const experience = Array.isArray(resume.experience) ? resume.experience : [];

  if (!experience.length) {
    return { y, used: 0 };
  }

  sectionHeading(c, 2, "Professional Experience", x, y, width);

  y -= 29;

  let used = 0;

  for (let i = 0; i < experience.length; i += 1) {
    const item = experience[i];

    const height = experienceHeight(item, 61, width);

    if (y - height < bottomLimit && used > 0) {
      break;
    }

    y = drawExperienceEntry(c, item, x, y, width, 61);

    if (i < experience.length - 1) {
      rule(c, x, y + 1, x + width, y + 1, LIGHT, 0.5);
      y -= 9;
    }

    used += 1;
  }

  return { y, used };
}

/* =========================================================
   SIDEBAR CARD
========================================================= */

function drawSidebarCard(c, x, top, width, number, title, height) {
  const bottom = top - height;

  roundedRect(c, x, bottom, width, height, 4, PALE, LIGHT, 0.7);

  const innerX = x + 11;
  const innerW = width - 22;
  const headingY = top - 16;

  txt(c, String(number).padStart(2, "0"), innerX, headingY, 8.5, MUTED, "F2");

  txt(c, title.toUpperCase(), innerX + 21, headingY, 9.5, HEADING, "F2");

  rule(c, innerX + 21, headingY - 8, innerX + innerW, headingY - 8, LIGHT, 0.6);

  return {
    bottom,
    innerX,
    innerW,
    contentY: top - 39,
  };
}

/* =========================================================
   SIDEBAR CONTENT HELPERS
========================================================= */

function drawSidebarText(c, text, x, y, options = {}) {
  return block(c, text, x, y, {
    size: options.size || 8.5,
    leading: options.leading || 10.5,
    maxChars: options.maxChars || 29,
    color: options.color || TEXT,
    font: options.font || "F1",
  });
}

function drawSidebarDivider(c, x, y, width) {
  rule(c, x, y, x + width, y, LIGHT, 0.45);
}

/* =========================================================
   PROFESSIONAL SKILLS
========================================================= */

function drawSkillsCard(c, skills, x, y, width) {
  if (!skills.length) {
    return y;
  }

  const rows = skills.map((item) => {
    const name = safeText(item.name || "Skill");
    const level = safeText(item.level || "");

    const nameLines = wrap(name, 25).length;
    const levelLines = level ? wrap(level, 28).length : 0;

    return {
      name,
      level,
      nameLines,
      levelLines,
      height: nameLines * 10.5 + (level ? levelLines * 9.5 + 2 : 0) + 7,
    };
  });

  const contentHeight = rows.reduce((sum, row) => sum + row.height, 0);
  const height = 39 + contentHeight + 9;

  const card = drawSidebarCard(
    c,
    x,
    y,
    width,
    3,
    "Professional Skills",
    height,
  );

  let contentY = card.contentY;

  rows.forEach((row, index) => {
    contentY = drawSidebarText(c, row.name, card.innerX, contentY, {
      size: 8.7,
      leading: 10.5,
      maxChars: 25,
      color: HEADING,
      font: "F2",
    });

    if (row.level) {
      contentY = drawSidebarText(c, row.level, card.innerX, contentY - 1, {
        size: 8,
        leading: 9.5,
        maxChars: 28,
        color: MUTED,
      });
    }

    contentY -= 7;

    if (index < rows.length - 1) {
      drawSidebarDivider(c, card.innerX, contentY + 3, card.innerW);
    }
  });

  return card.bottom - 8;
}

/* =========================================================
   EDUCATION
========================================================= */

function drawEducationCard(c, education, x, y, width) {
  if (!education.length) {
    return y;
  }

  const rows = education.map((item) => {
    const qualification = safeText(item.qualification || "");
    const school = safeText(item.school || "");
    const period = safeText(item.period || "");

    const qualificationHeight = qualification
      ? textHeight(qualification, 28, 10.5)
      : 0;

    const schoolHeight = school ? textHeight(school, 28, 10) : 0;

    const periodHeight = period ? textHeight(period, 28, 9.5) : 0;

    return {
      qualification,
      school,
      period,
      height: qualificationHeight + schoolHeight + periodHeight + 8,
    };
  });

  const contentHeight = rows.reduce((sum, row) => sum + row.height, 0);
  const height = 39 + contentHeight + 9;

  const card = drawSidebarCard(c, x, y, width, 4, "Education", height);

  let contentY = card.contentY;

  rows.forEach((row, index) => {
    if (row.qualification) {
      contentY = drawSidebarText(c, row.qualification, card.innerX, contentY, {
        size: 8.7,
        leading: 10.5,
        maxChars: 28,
        color: HEADING,
        font: "F2",
      });
    }

    if (row.school) {
      contentY = drawSidebarText(c, row.school, card.innerX, contentY - 1, {
        size: 8.2,
        leading: 10,
        maxChars: 28,
        color: TEXT,
      });
    }

    if (row.period) {
      contentY = drawSidebarText(c, row.period, card.innerX, contentY - 1, {
        size: 8,
        leading: 9.5,
        maxChars: 28,
        color: MUTED,
      });
    }

    contentY -= 8;

    if (index < rows.length - 1) {
      drawSidebarDivider(c, card.innerX, contentY + 3, card.innerW);
    }
  });

  return card.bottom - 8;
}

/* =========================================================
   CERTIFICATES
========================================================= */

function drawCertificatesCard(c, certificates, x, y, width) {
  if (!certificates.length) {
    return y;
  }

  const rows = certificates.map((item) => {
    const name = safeText(item.name || "");
    const issuer = safeText(item.issuer || "");
    const year = safeText(item.year || "");
    const meta = [issuer, year].filter(Boolean).join(" - ");

    const nameHeight = name ? textHeight(name, 28, 10.5) : 0;
    const metaHeight = meta ? textHeight(meta, 28, 9.5) : 0;

    return {
      name,
      meta,
      height: nameHeight + metaHeight + 8,
    };
  });

  const contentHeight = rows.reduce((sum, row) => sum + row.height, 0);
  const height = 39 + contentHeight + 9;

  const card = drawSidebarCard(c, x, y, width, 5, "Certificates", height);

  let contentY = card.contentY;

  rows.forEach((row, index) => {
    if (row.name) {
      contentY = drawSidebarText(c, row.name, card.innerX, contentY, {
        size: 8.5,
        leading: 10.5,
        maxChars: 28,
        color: HEADING,
        font: "F2",
      });
    }

    if (row.meta) {
      contentY = drawSidebarText(c, row.meta, card.innerX, contentY - 1, {
        size: 8,
        leading: 9.5,
        maxChars: 28,
        color: MUTED,
      });
    }

    contentY -= 8;

    if (index < rows.length - 1) {
      drawSidebarDivider(c, card.innerX, contentY + 3, card.innerW);
    }
  });

  return card.bottom - 8;
}

/* =========================================================
   LANGUAGES
========================================================= */

function drawLanguagesCard(c, languages, x, y, width) {
  if (!languages.length) {
    return y;
  }

  const rows = languages.map((item) => {
    const name = safeText(item.name || "");
    const level = safeText(item.level || "");

    const nameHeight = name ? textHeight(name, 28, 10.5) : 0;
    const levelHeight = level ? textHeight(level, 28, 9.5) : 0;

    return {
      name,
      level,
      height: nameHeight + levelHeight + 8,
    };
  });

  const contentHeight = rows.reduce((sum, row) => sum + row.height, 0);
  const height = 39 + contentHeight + 9;

  const card = drawSidebarCard(c, x, y, width, 6, "Languages", height);

  let contentY = card.contentY;

  rows.forEach((row, index) => {
    if (row.name) {
      contentY = drawSidebarText(c, row.name, card.innerX, contentY, {
        size: 8.7,
        leading: 10.5,
        maxChars: 28,
        color: HEADING,
        font: "F2",
      });
    }

    if (row.level) {
      contentY = drawSidebarText(c, row.level, card.innerX, contentY - 1, {
        size: 8,
        leading: 9.5,
        maxChars: 28,
        color: MUTED,
      });
    }

    contentY -= 8;

    if (index < rows.length - 1) {
      drawSidebarDivider(c, card.innerX, contentY + 3, card.innerW);
    }
  });

  return card.bottom - 8;
}

/* =========================================================
   CONNECT
========================================================= */

function drawConnectCard(c, links, x, y, width) {
  if (!links.length) {
    return y;
  }

  const rows = links.map((link) => ({
    text: safeText(link),
    height: textHeight(link, 28, 10) + 7,
  }));

  const contentHeight = rows.reduce((sum, row) => sum + row.height, 0);
  const height = 39 + contentHeight + 9;

  const card = drawSidebarCard(c, x, y, width, 7, "Connect", height);

  let contentY = card.contentY;

  rows.forEach((row, index) => {
    contentY = drawSidebarText(c, row.text, card.innerX, contentY, {
      size: 8,
      leading: 10,
      maxChars: 28,
      color: TEXT,
    });

    contentY -= 7;

    if (index < rows.length - 1) {
      drawSidebarDivider(c, card.innerX, contentY + 3, card.innerW);
    }
  });

  return card.bottom - 8;
}

/* =========================================================
   SIDEBAR
========================================================= */

function drawSidebar(c, resume, x, y, width) {
  const skills = Array.isArray(resume.skills)
    ? resume.skills.filter(
        (item) => item && (normalize(item.name) || normalize(item.level)),
      )
    : [];

  const education = Array.isArray(resume.education)
    ? resume.education.filter(
        (item) =>
          item &&
          (normalize(item.qualification) ||
            normalize(item.school) ||
            normalize(item.period)),
      )
    : [];

  const certificates = Array.isArray(resume.certificates)
    ? resume.certificates.filter(
        (item) =>
          item &&
          (normalize(item.name) ||
            normalize(item.issuer) ||
            normalize(item.year)),
      )
    : [];

  const languages = Array.isArray(resume.languages)
    ? resume.languages.filter(
        (item) => item && (normalize(item.name) || normalize(item.level)),
      )
    : [];

  const links = [
    resume.github && `GitHub: ${resume.github}`,
    resume.linkedin && `LinkedIn: ${resume.linkedin}`,
  ].filter(Boolean);

  let sy = y;

  sy = drawSkillsCard(c, skills, x, sy, width);
  sy = drawEducationCard(c, education, x, sy, width);
  sy = drawCertificatesCard(c, certificates, x, sy, width);
  sy = drawLanguagesCard(c, languages, x, sy, width);
  sy = drawConnectCard(c, links, x, sy, width);

  return sy;
}

/* =========================================================
   FOOTER
========================================================= */

function drawFooter(c, resume, page, total) {
  rule(c, MARGIN, 48, PAGE_WIDTH - MARGIN, 48, LIGHT, 0.8);

  txt(c, "Available for professional opportunities", MARGIN, 34, 7.5, MUTED);

  if (resume.website) {
    const website = safeText(resume.website);

    txt(
      c,
      website,
      PAGE_WIDTH - MARGIN - Math.min(165, website.length * 4),
      34,
      7.5,
      MUTED,
    );
  }

  txt(c, `${page} / ${total}`, PAGE_WIDTH - MARGIN - 25, 25, 7, MUTED);
}

/* =========================================================
   PAGE FRAME
========================================================= */

function drawPageFrame(c) {
  roundedRect(
    c,
    24,
    24,
    PAGE_WIDTH - 48,
    PAGE_HEIGHT - 48,
    5,
    null,
    LIGHT,
    0.7,
  );
}

/* =========================================================
   FIRST PAGE
========================================================= */

function buildFirstPage(resume) {
  const page = [];

  drawPageFrame(page);

  const headerY = header(page, resume, false);

  const contentWidth = PAGE_WIDTH - MARGIN * 2;
  const gap = 18;

  const rightWidth = 172;
  const leftWidth = contentWidth - rightWidth - gap;

  const rightX = MARGIN + leftWidth + gap;
  const columnsTop = headerY - 10;

  // Right column: skills, education, certificates, languages, links.
  drawSidebar(page, resume, rightX, columnsTop, rightWidth);

  // Left column: profile and professional experience.
  let leftY = columnsTop;

  if (resume.bio) {
    leftY = drawProfile(page, resume, leftY, leftWidth);
  }

  const bottomLimit = 60;

  const experienceResult = drawExperience(
    page,
    resume,
    MARGIN,
    leftY,
    leftWidth,
    bottomLimit,
  );

  const experience = Array.isArray(resume.experience) ? resume.experience : [];

  return {
    page,
    remaining: experience.slice(experienceResult.used),
  };
}

/* =========================================================
   CONTINUATION EXPERIENCE PAGE
========================================================= */

function buildExperiencePage(resume, remaining) {
  const page = [];

  drawPageFrame(page);

  let y = header(page, resume, true);

  const contentWidth = PAGE_WIDTH - MARGIN * 2;

  sectionHeading(
    page,
    2,
    "Professional Experience - Continued",
    MARGIN,
    y,
    contentWidth,
  );

  y -= 30;

  const bottomLimit = 60;
  let consumed = 0;

  for (let i = 0; i < remaining.length; i += 1) {
    const item = remaining[i];

    const height = experienceHeight(item, 100, contentWidth);

    if (y - height < bottomLimit && consumed > 0) {
      break;
    }

    y = drawExperienceEntry(page, item, MARGIN, y, contentWidth, 100);

    if (i < remaining.length - 1) {
      rule(page, MARGIN, y + 1, PAGE_WIDTH - MARGIN, y + 1, LIGHT, 0.5);

      y -= 9;
    }

    consumed += 1;
  }

  // Safety guard against an endless pagination loop.
  if (!consumed) {
    consumed = 1;
  }

  return {
    page,
    remaining: remaining.slice(consumed),
  };
}

/* =========================================================
   BUILD ALL PAGES
========================================================= */

function buildPages(resume) {
  const pages = [];

  const first = buildFirstPage(resume);

  pages.push(first.page);

  let remaining = first.remaining;

  while (remaining.length) {
    const next = buildExperiencePage(resume, remaining);

    pages.push(next.page);

    remaining = next.remaining;
  }

  const total = pages.length;

  pages.forEach((commands, index) => {
    drawFooter(commands, resume, index + 1, total);
  });

  return pages;
}

/* =========================================================
   BUILD PDF
========================================================= */

function buildPdf(resume) {
  const safeResume = resume || {};

  const normalizedResume = {
    ...safeResume,

    skills: Array.isArray(safeResume.skills) ? safeResume.skills : [],

    experience: Array.isArray(safeResume.experience)
      ? safeResume.experience
      : [],

    education: Array.isArray(safeResume.education) ? safeResume.education : [],

    certificates: Array.isArray(safeResume.certificates)
      ? safeResume.certificates
      : [],

    languages: Array.isArray(safeResume.languages) ? safeResume.languages : [],
  };

  const pages = buildPages(normalizedResume);

  const objects = [];
  const offsets = [];

  const add = (body) => {
    objects.push(body);
    offsets.push(0);
    return objects.length;
  };

  const catalog = add("<< /Type /Catalog /Pages 2 0 R >>");

  const pagesObject = add("");

  const regular = add(
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>",
  );

  const bold = add(
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>",
  );

  const pageRefs = [];

  pages.forEach((commands) => {
    const stream = commands.join("\n") + "\n";

    const byteLength =
      typeof Buffer !== "undefined"
        ? Buffer.byteLength(stream, "latin1")
        : new TextEncoder().encode(stream).length;

    const content = add(
      `<< /Length ${byteLength} >>\nstream\n${stream}endstream`,
    );

    pageRefs.push(
      add(
        `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] /Resources << /Font << /F1 ${regular} 0 R /F2 ${bold} 0 R >> >> /Contents ${content} 0 R >>`,
      ),
    );
  });

  objects[pagesObject - 1] = `<< /Type /Pages /Kids [${pageRefs
    .map((ref) => `${ref} 0 R`)
    .join(" ")}] /Count ${pageRefs.length} >>`;

  let pdf = "%PDF-1.4\n%\xFF\xFF\xFF\xFF\n";

  objects.forEach((body, index) => {
    offsets[index] =
      typeof Buffer !== "undefined"
        ? Buffer.byteLength(pdf, "latin1")
        : new TextEncoder().encode(pdf).length;

    pdf += `${index + 1} 0 obj\n` + `${body}\n` + `endobj\n`;
  });

  const xref =
    typeof Buffer !== "undefined"
      ? Buffer.byteLength(pdf, "latin1")
      : new TextEncoder().encode(pdf).length;

  pdf += `xref\n0 ${objects.length + 1}\n` + "0000000000 65535 f \n";

  offsets.forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });

  pdf +=
    `trailer\n<< /Size ${objects.length + 1} /Root ${catalog} 0 R >>\n` +
    `startxref\n${xref}\n` +
    "%%EOF";

  return typeof Buffer !== "undefined"
    ? Buffer.from(pdf, "latin1")
    : new TextEncoder().encode(pdf);
}

/* =========================================================
   EXPORT
========================================================= */

module.exports = {
  buildPdf,
};
