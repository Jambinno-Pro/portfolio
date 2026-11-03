// ============================================================
// PROFESSIONAL RESUME PDF GENERATOR
// Layout: A4, navy header, two-column body, clean Word-style fonts
// Fonts: Helvetica / Helvetica-Bold (PDF standard Arial-style fonts)
// ============================================================

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;

const COLORS = {
  navy: [0.02, 0.13, 0.36],
  navyText: [0.05, 0.16, 0.29],
  text: [0.12, 0.14, 0.17],
  muted: [0.36, 0.39, 0.43],
  line: [0.84, 0.85, 0.87],
  white: [1, 1, 1],
};

const FONT = {
  regular: "F1",
  bold: "F2",
};

const PAGE = {
  margin: 36,
  headerHeight: 118,
  leftWidth: 158,
  columnGap: 24,
  bottom: 42,
};

const CONTENT_TOP = PAGE_HEIGHT - PAGE.headerHeight - 30;
const LEFT_X = PAGE.margin;
const RIGHT_X = PAGE.margin + PAGE.leftWidth + PAGE.columnGap;
const RIGHT_WIDTH = PAGE_WIDTH - PAGE.margin - RIGHT_X;
const LEFT_WIDTH = PAGE.leftWidth;

// ------------------------------------------------------------
// TEXT UTILITIES
// ------------------------------------------------------------

function normalizeText(value) {
  return String(value ?? "")
    .replace(/\r\n?/g, "\n")
    .replace(/\u00a0/g, " ")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[–—]/g, "-")
    .replace(/•/g, "-")
    .replace(/…/g, "...")
    .replace(/[^\x20-\x7E\n\t]/g, "");
}

function pdfEscape(value) {
  return normalizeText(value)
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");
}

function approxTextWidth(text, fontSize) {
  // Helvetica average character width approximation.
  return normalizeText(text).length * fontSize * 0.51;
}

function wrapText(value, maxWidth, fontSize, font = FONT.regular) {
  const text = normalizeText(value);
  if (!text) return [];

  const lines = [];

  for (const paragraph of text.split("\n")) {
    if (!paragraph.trim()) {
      lines.push("");
      continue;
    }

    let line = "";
    for (const word of paragraph.trim().split(/\s+/)) {
      const candidate = line ? `${line} ${word}` : word;

      if (approxTextWidth(candidate, fontSize) <= maxWidth) {
        line = candidate;
        continue;
      }

      if (line) lines.push(line);

      // Break a single exceptionally long word safely.
      if (approxTextWidth(word, fontSize) > maxWidth) {
        let fragment = "";
        for (const char of word) {
          const next = fragment + char;
          if (fragment && approxTextWidth(next, fontSize) > maxWidth) {
            lines.push(fragment);
            fragment = char;
          } else {
            fragment = next;
          }
        }
        line = fragment;
      } else {
        line = word;
      }
    }

    if (line) lines.push(line);
  }

  return lines;
}

function colorCommand(color, stroke = false) {
  return `${color.map((n) => Number(n.toFixed(3))).join(" ")} ${stroke ? "RG" : "rg"}`;
}

// ------------------------------------------------------------
// PDF DRAWING PRIMITIVES
// ------------------------------------------------------------

function addRect(commands, x, y, width, height, color) {
  commands.push(
    colorCommand(color),
    `${x.toFixed(2)} ${y.toFixed(2)} ${width.toFixed(2)} ${height.toFixed(2)} re f`,
  );
}

function addLine(
  commands,
  x1,
  y1,
  x2,
  y2,
  color = COLORS.line,
  thickness = 0.8,
) {
  commands.push(
    colorCommand(color, true),
    `${thickness} w ${x1.toFixed(2)} ${y1.toFixed(2)} m ${x2.toFixed(2)} ${y2.toFixed(2)} l S`,
  );
}

function addText(
  commands,
  value,
  x,
  y,
  size = 9,
  color = COLORS.text,
  font = FONT.regular,
) {
  const text = normalizeText(value);
  if (!text) return;

  commands.push(
    colorCommand(color),
    `BT /${font} ${size} Tf 1 0 0 1 ${x.toFixed(2)} ${y.toFixed(2)} Tm (${pdfEscape(text)}) Tj ET`,
  );
}

function addParagraph(commands, value, x, y, width, options = {}) {
  const size = options.size ?? 9;
  const leading = options.leading ?? 13;
  const color = options.color ?? COLORS.text;
  const font = options.font ?? FONT.regular;
  const lines = wrapText(value, width, size, font);

  lines.forEach((line, index) => {
    addText(commands, line, x, y - index * leading, size, color, font);
  });

  return y - lines.length * leading;
}

function addSectionHeading(commands, title, x, y, width, compact = false) {
  const size = compact ? 10 : 11;
  addText(
    commands,
    String(title).toUpperCase(),
    x,
    y,
    size,
    COLORS.navyText,
    FONT.bold,
  );
  const lineY = y - 7;
  addLine(commands, x, lineY, x + width, lineY, COLORS.line, 0.9);
  return y - 23;
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function firstValue(...values) {
  return values.find(
    (value) =>
      value !== undefined && value !== null && String(value).trim() !== "",
  );
}

function formatLocation(item) {
  return [item?.city, item?.state, item?.location]
    .filter(Boolean)
    .map(normalizeText)
    .join(", ");
}

// ------------------------------------------------------------
// HEADER
// ------------------------------------------------------------

function drawHeader(commands, resume, continuation = false) {
  const height = continuation ? 78 : PAGE.headerHeight;
  const y = PAGE_HEIGHT - height;

  addRect(commands, 0, y, PAGE_WIDTH, height, COLORS.navy);

  if (!continuation) {
    const name = firstValue(resume.fullName, resume.name, "YOUR NAME");
    const title = firstValue(
      resume.title,
      resume.professionalTitle,
      "PROFESSIONAL TITLE",
    );

    const nameSize = name.length > 28 ? 25 : name.length > 19 ? 29 : 34;
    const nameWidth = approxTextWidth(name, nameSize);
    const nameX = Math.max(PAGE.margin, (PAGE_WIDTH - nameWidth) / 2);

    addText(
      commands,
      name.toUpperCase(),
      nameX,
      PAGE_HEIGHT - 67,
      nameSize,
      COLORS.white,
      FONT.bold,
    );

    const titleText = normalizeText(title).toUpperCase();
    const titleWidth = approxTextWidth(titleText, 10);
    addText(
      commands,
      titleText,
      Math.max(PAGE.margin, (PAGE_WIDTH - titleWidth) / 2),
      PAGE_HEIGHT - 94,
      10,
      COLORS.white,
      FONT.bold,
    );
  } else {
    const name = firstValue(resume.fullName, resume.name, "YOUR NAME");
    addText(
      commands,
      name.toUpperCase(),
      PAGE.margin,
      PAGE_HEIGHT - 48,
      19,
      COLORS.white,
      FONT.bold,
    );
    addText(
      commands,
      "PROFESSIONAL RESUME - CONTINUED",
      PAGE.margin,
      PAGE_HEIGHT - 65,
      8,
      COLORS.white,
    );
  }

  return PAGE_HEIGHT - height - 28;
}

// ------------------------------------------------------------
// SIDEBAR SECTIONS
// ------------------------------------------------------------

function drawContact(commands, resume, y) {
  y = addSectionHeading(commands, "Contact", LEFT_X, y, LEFT_WIDTH, true);

  const contacts = [
    ["Phone", firstValue(resume.phone, resume.mobile)],
    ["Email", resume.email],
    ["Location", firstValue(resume.location, formatLocation(resume))],
    ["Website", resume.website],
    ["LinkedIn", resume.linkedin],
    ["GitHub", resume.github],
  ].filter(([, value]) => value);

  if (!contacts.length) {
    addText(commands, "Add contact details", LEFT_X, y, 8.5, COLORS.muted);
    return y - 20;
  }

  contacts.forEach(([label, value]) => {
    addText(commands, label, LEFT_X, y, 7.5, COLORS.muted, FONT.bold);
    y -= 11;
    y =
      addParagraph(commands, value, LEFT_X, y, LEFT_WIDTH, {
        size: 8.5,
        leading: 11,
        color: COLORS.text,
      }) - 9;
  });

  return y;
}

function drawEducation(commands, resume, y) {
  const education = asArray(resume.education);
  if (!education.length) return y;

  y = addSectionHeading(commands, "Education", LEFT_X, y, LEFT_WIDTH, true);

  education.forEach((item) => {
    const school = firstValue(
      item.school,
      item.institution,
      item.schoolName,
      item.name,
    );
    const degree = firstValue(
      item.degree,
      item.qualification,
      item.course,
      item.title,
    );
    const period = firstValue(item.period, item.year, item.date);
    const location = firstValue(item.location, formatLocation(item));

    if (school) {
      y =
        addParagraph(commands, school, LEFT_X, y, LEFT_WIDTH, {
          size: 8.7,
          leading: 11,
          font: FONT.bold,
          color: COLORS.text,
        }) - 1;
    }

    if (degree) {
      y =
        addParagraph(commands, degree, LEFT_X, y, LEFT_WIDTH, {
          size: 8.2,
          leading: 10.5,
          color: COLORS.text,
        }) - 1;
    }

    if (location) {
      y =
        addParagraph(commands, location, LEFT_X, y, LEFT_WIDTH, {
          size: 7.8,
          leading: 10,
          color: COLORS.muted,
        }) - 1;
    }

    if (period) {
      y =
        addParagraph(commands, period, LEFT_X, y, LEFT_WIDTH, {
          size: 7.8,
          leading: 10,
          color: COLORS.muted,
        }) - 1;
    }

    y -= 9;
  });

  return y;
}

function drawSkills(commands, resume, y) {
  const skills = asArray(resume.skills);
  if (!skills.length) return y;

  y = addSectionHeading(commands, "Key Skills", LEFT_X, y, LEFT_WIDTH, true);

  skills.forEach((skill) => {
    const label =
      typeof skill === "string"
        ? skill
        : firstValue(skill.name, skill.title, skill.skill, skill.label);

    if (!label) return;

    addText(commands, "-", LEFT_X + 1, y, 9, COLORS.navyText, FONT.bold);
    y =
      addParagraph(commands, label, LEFT_X + 12, y, LEFT_WIDTH - 12, {
        size: 8.5,
        leading: 11,
        color: COLORS.text,
      }) - 4;
  });

  return y;
}

function drawCertificates(commands, resume, y) {
  const certificates = asArray(resume.certificates);
  if (!certificates.length) return y;

  y = addSectionHeading(commands, "Certificates", LEFT_X, y, LEFT_WIDTH, true);

  certificates.forEach((item) => {
    const name =
      typeof item === "string"
        ? item
        : firstValue(item.name, item.title, item.certificate);

    if (!name) return;

    y =
      addParagraph(commands, name, LEFT_X, y, LEFT_WIDTH, {
        size: 8.3,
        leading: 10.5,
        font: FONT.bold,
      }) - 1;

    const meta = [item.issuer, item.year, item.date]
      .filter(Boolean)
      .join(" | ");
    if (meta) {
      y =
        addParagraph(commands, meta, LEFT_X, y, LEFT_WIDTH, {
          size: 7.6,
          leading: 9.5,
          color: COLORS.muted,
        }) - 5;
    } else {
      y -= 5;
    }
  });

  return y;
}

function drawLanguages(commands, resume, y) {
  const languages = asArray(resume.languages);
  if (!languages.length) return y;

  y = addSectionHeading(commands, "Languages", LEFT_X, y, LEFT_WIDTH, true);

  languages.forEach((item) => {
    const name =
      typeof item === "string" ? item : firstValue(item.name, item.language);
    const level =
      typeof item === "string" ? "" : firstValue(item.level, item.proficiency);
    if (!name) return;

    const line = level ? `${name} - ${level}` : name;
    y =
      addParagraph(commands, line, LEFT_X, y, LEFT_WIDTH, {
        size: 8.2,
        leading: 10.5,
      }) - 4;
  });

  return y;
}

function drawSidebar(commands, resume, startY) {
  let y = startY;
  y = drawContact(commands, resume, y);
  y -= 7;
  y = drawEducation(commands, resume, y);
  y -= 7;
  y = drawSkills(commands, resume, y);
  y -= 7;
  y = drawCertificates(commands, resume, y);
  y -= 7;
  y = drawLanguages(commands, resume, y);
  return y;
}

// ------------------------------------------------------------
// MAIN COLUMN SECTIONS
// ------------------------------------------------------------

function drawSummary(commands, resume, y) {
  const summary = firstValue(
    resume.bio,
    resume.summary,
    resume.professionalSummary,
  );
  if (!summary) return y;

  y = addSectionHeading(
    commands,
    "Professional Summary",
    RIGHT_X,
    y,
    RIGHT_WIDTH,
  );

  y = addParagraph(commands, summary, RIGHT_X, y, RIGHT_WIDTH, {
    size: 9,
    leading: 13.2,
    color: COLORS.text,
  });

  return y - 19;
}

function splitDescription(value) {
  if (Array.isArray(value)) {
    return value
      .map((item) =>
        normalizeText(
          typeof item === "string"
            ? item
            : firstValue(item.text, item.description, item.name),
        ),
      )
      .filter(Boolean);
  }

  const text = normalizeText(value);
  if (!text) return [];

  // Accept newline-separated responsibilities and common bullet characters.
  const lines = text
    .split(/\n|(?<=\.)\s+(?=[A-Z0-9-])/)
    .map((line) => line.replace(/^\s*[-*•]\s*/, "").trim())
    .filter(Boolean);

  return lines.length ? lines : [text];
}

function drawExperienceItem(commands, item, y, width = RIGHT_WIDTH) {
  const position = firstValue(
    item.position,
    item.jobTitle,
    item.title,
    "Position",
  );
  const period = firstValue(item.period, item.duration, item.date);
  const company = firstValue(item.company, item.employer, item.organization);
  const location = firstValue(item.location, formatLocation(item));

  addText(
    commands,
    normalizeText(position).toUpperCase(),
    RIGHT_X,
    y,
    9.5,
    COLORS.navyText,
    FONT.bold,
  );

  if (period) {
    const periodWidth = approxTextWidth(period, 8);
    const periodX = Math.max(RIGHT_X, RIGHT_X + width - periodWidth);
    if (periodX > RIGHT_X + approxTextWidth(position, 9.5) + 10) {
      addText(commands, period, periodX, y, 8, COLORS.muted);
    } else {
      y -= 12;
      y = addParagraph(commands, period, RIGHT_X, y, width, {
        size: 8,
        leading: 10,
        color: COLORS.muted,
      });
    }
  }

  y -= 13;

  if (company || location) {
    const companyLine = [company, location].filter(Boolean).join(" | ");
    y =
      addParagraph(commands, companyLine, RIGHT_X, y, width, {
        size: 8.7,
        leading: 11,
        color: COLORS.text,
        font: FONT.bold,
      }) - 7;
  }

  const description = firstValue(
    item.description,
    item.responsibilities,
    item.details,
    item.summary,
  );
  const bullets = splitDescription(description);

  bullets.forEach((bullet) => {
    addText(commands, "-", RIGHT_X + 2, y, 9, COLORS.text, FONT.bold);
    y =
      addParagraph(commands, bullet, RIGHT_X + 14, y, width - 14, {
        size: 8.7,
        leading: 12,
        color: COLORS.text,
      }) - 3;
  });

  return y - 12;
}

function drawExperience(commands, resume, y) {
  const experience = asArray(resume.experience);
  if (!experience.length) return { y, used: 0 };

  y = addSectionHeading(commands, "Experience", RIGHT_X, y, RIGHT_WIDTH);
  let used = 0;

  for (let index = 0; index < experience.length; index += 1) {
    const required = estimateExperienceHeight(experience[index], RIGHT_WIDTH);
    if (y - required < PAGE.bottom + 12 && used > 0) break;

    y = drawExperienceItem(commands, experience[index], y);
    used += 1;
    if (y < PAGE.bottom + 12) break;
  }

  return { y, used };
}

function drawAdditionalSections(commands, resume, y) {
  const projects = asArray(resume.projects);
  if (projects.length) {
    y = addSectionHeading(commands, "Projects", RIGHT_X, y, RIGHT_WIDTH);
    projects.forEach((item) => {
      const name = firstValue(item.name, item.title, "Project");
      addText(commands, name, RIGHT_X, y, 9, COLORS.navyText, FONT.bold);
      y -= 13;
      const detail = firstValue(item.description, item.details);
      if (detail) {
        y =
          addParagraph(commands, detail, RIGHT_X, y, RIGHT_WIDTH, {
            size: 8.7,
            leading: 12,
          }) - 8;
      }
    });
  }

  return y;
}

// ------------------------------------------------------------
// PAGE BUILDING
// ------------------------------------------------------------

function drawFooter(commands, pageNumber, totalPages) {
  addLine(
    commands,
    PAGE.margin,
    30,
    PAGE_WIDTH - PAGE.margin,
    30,
    COLORS.line,
    0.6,
  );
  addText(commands, "PROFESSIONAL RESUME", PAGE.margin, 18, 7, COLORS.muted);
  addText(
    commands,
    `${pageNumber} / ${totalPages}`,
    PAGE_WIDTH - PAGE.margin - 28,
    18,
    7,
    COLORS.muted,
  );
}

function buildDocumentPages(resume) {
  const pages = [];
  const firstPage = [];
  const contentTop = drawHeader(firstPage, resume, false);

  addLine(
    firstPage,
    LEFT_X + LEFT_WIDTH + PAGE.columnGap / 2,
    PAGE.bottom,
    LEFT_X + LEFT_WIDTH + PAGE.columnGap / 2,
    contentTop + 4,
    COLORS.line,
    0.8,
  );

  drawSidebar(firstPage, resume, contentTop);

  const mainY = drawSummary(firstPage, resume, contentTop);
  const experienceResult = drawExperience(firstPage, resume, mainY);
  drawAdditionalSections(firstPage, resume, experienceResult.y);
  pages.push(firstPage);

  const experiences = asArray(resume.experience);
  let index = experienceResult.used;

  while (index < experiences.length) {
    const page = [];
    let y = drawHeader(page, resume, true);
    y = addSectionHeading(
      page,
      "Professional Experience - Continued",
      PAGE.margin,
      y,
      PAGE_WIDTH - 2 * PAGE.margin,
    );

    const startIndex = index;

    while (index < experiences.length) {
      const required = estimateExperienceHeight(
        experiences[index],
        PAGE_WIDTH - 2 * PAGE.margin,
      );

      if (y - required < PAGE.bottom + 12 && index > startIndex) break;

      y = drawExperienceItemAt(
        page,
        experiences[index],
        PAGE.margin,
        y,
        PAGE_WIDTH - 2 * PAGE.margin,
      );
      index += 1;
      if (y < PAGE.bottom + 12) break;
    }

    if (index === startIndex) {
      y = drawExperienceItemAt(
        page,
        experiences[index],
        PAGE.margin,
        y,
        PAGE_WIDTH - 2 * PAGE.margin,
      );
      index += 1;
    }

    pages.push(page);
  }

  return pages;
}

function estimateExperienceHeight(item, width) {
  const description = firstValue(
    item.description,
    item.responsibilities,
    item.details,
    item.summary,
  );
  const bullets = splitDescription(description);
  const position = firstValue(
    item.position,
    item.jobTitle,
    item.title,
    "Position",
  );
  const company = firstValue(item.company, item.employer, item.organization);
  let height = 34;
  height += wrapText(position, width, 9.5, FONT.bold).length * 12;
  if (company)
    height += wrapText(company, width, 8.7, FONT.bold).length * 11 + 4;
  bullets.forEach((bullet) => {
    height += wrapText(bullet, width - 14, 8.7).length * 12 + 3;
  });
  return height + 12;
}

function drawExperienceItemAt(commands, item, x, y, width) {
  const position = firstValue(
    item.position,
    item.jobTitle,
    item.title,
    "Position",
  );
  const period = firstValue(item.period, item.duration, item.date);
  const company = firstValue(item.company, item.employer, item.organization);
  const location = firstValue(item.location, formatLocation(item));

  y = addParagraph(
    commands,
    normalizeText(position).toUpperCase(),
    x,
    y,
    width,
    {
      size: 10,
      leading: 12,
      font: FONT.bold,
      color: COLORS.navyText,
    },
  );

  if (period) {
    y =
      addParagraph(commands, period, x, y, width, {
        size: 8.5,
        leading: 11,
        color: COLORS.muted,
      }) - 1;
  }

  if (company || location) {
    y =
      addParagraph(
        commands,
        [company, location].filter(Boolean).join(" | "),
        x,
        y,
        width,
        {
          size: 9,
          leading: 12,
          font: FONT.bold,
        },
      ) - 6;
  }

  const description = firstValue(
    item.description,
    item.responsibilities,
    item.details,
    item.summary,
  );
  splitDescription(description).forEach((bullet) => {
    addText(commands, "-", x + 2, y, 9, COLORS.text, FONT.bold);
    y =
      addParagraph(commands, bullet, x + 15, y, width - 15, {
        size: 9,
        leading: 13,
      }) - 3;
  });

  return y - 13;
}

// ------------------------------------------------------------
// PDF SERIALIZATION
// ------------------------------------------------------------

function createPdf(pages) {
  const objects = [];
  const offsets = [];

  const addObject = (body) => {
    objects.push(body);
    return objects.length;
  };

  const catalogId = addObject("");
  const pagesId = addObject("");

  // Standard PDF Type 1 fonts. Helvetica is the standard PDF equivalent
  // of Arial; Helvetica-Bold provides the familiar Word bold treatment.
  const regularFontId = addObject(
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>",
  );
  const boldFontId = addObject(
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>",
  );

  const pageIds = [];

  pages.forEach((commands, index) => {
    const withFooter = [...commands];
    drawFooter(withFooter, index + 1, pages.length);

    const stream = `${withFooter.join("\n")}\n`;
    const streamLength = new TextEncoder().encode(stream).length;

    const contentId = addObject(
      `<< /Length ${streamLength} >>\nstream\n${stream}endstream`,
    );

    const pageId = addObject(
      `<< /Type /Page /Parent ${pagesId} 0 R ` +
        `/MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] ` +
        `/Resources << /Font << /F1 ${regularFontId} 0 R /F2 ${boldFontId} 0 R >> >> ` +
        `/Contents ${contentId} 0 R >>`,
    );

    pageIds.push(pageId);
  });

  objects[catalogId - 1] = `<< /Type /Catalog /Pages ${pagesId} 0 R >>`;
  objects[pagesId - 1] =
    `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageIds.length} >>`;

  let pdf = "%PDF-1.4\n";
  const encoder = new TextEncoder();

  objects.forEach((body, index) => {
    offsets.push(encoder.encode(pdf).length);
    pdf += `${index + 1} 0 obj\n${body}\nendobj\n`;
  });

  const xrefOffset = encoder.encode(pdf).length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";

  offsets.forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });

  pdf +=
    `trailer\n<< /Size ${objects.length + 1} /Root ${catalogId} 0 R >>\n` +
    `startxref\n${xrefOffset}\n%%EOF`;

  return encoder.encode(pdf);
}

// ------------------------------------------------------------
// PUBLIC DOWNLOAD FUNCTION
// ------------------------------------------------------------

function buildPdf(resume) {
  const safeResume = resume && typeof resume === "object" ? resume : {};
  const pages = buildDocumentPages(safeResume);
  return createPdf(pages);
}

export function downloadResumePdf(resume) {
  const bytes = buildPdf(resume || {});
  const blob = new Blob([bytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);

  const safeName =
    normalizeText(
      firstValue(resume?.fullName, resume?.name, "Professional-Resume"),
    )
      .replace(/[^a-z0-9]+/gi, "-")
      .replace(/^-+|-+$/g, "") || "Professional-Resume";

  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${safeName}-Resume.pdf`;

  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  window.setTimeout(() => URL.revokeObjectURL(url), 1500);
}
