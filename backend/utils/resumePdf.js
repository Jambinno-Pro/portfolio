
const PAGE_WIDTH = 595;
const PAGE_HEIGHT = 842;
const MARGIN = 42;
const NAVY = [0.055, 0.13, 0.20];
const BLUE = [0.10, 0.32, 0.55];
const TEAL = [0.04, 0.62, 0.55];
const MINT = [0.20, 0.78, 0.70];
const LIGHT = [0.84, 0.89, 0.91];
const PALE = [0.965, 0.985, 0.985];
const TEXT = [0.10, 0.18, 0.24];
const MUTED = [0.36, 0.44, 0.49];

const normalize = (value) =>
  String(value ?? "").replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim();

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

function wrap(text, maxChars) {
  const lines = [];
  safeText(text).split("\n").forEach((raw) => {
    if (!raw.trim()) {
      lines.push("");
      return;
    }

    let line = "";
    raw.trim().split(/\s+/).forEach((word) => {
      if (word.length > maxChars) {
        if (line) lines.push(line);
        line = "";
        for (let i = 0; i < word.length; i += maxChars) {
          lines.push(word.slice(i, i + maxChars));
        }
        return;
      }

      const next = line ? `${line} ${word}` : word;
      if (next.length <= maxChars) line = next;
      else {
        if (line) lines.push(line);
        line = word;
      }
    });

    if (line) lines.push(line);
  });
  return lines;
}

function textHeight(text, maxChars, leading) {
  return Math.max(1, wrap(text, maxChars).length) * leading;
}

function colorString(color) {
  return color.join(" ");
}

function fill(c, x, y, w, h, color) {
  c.push(`${colorString(color)} rg`, `${x} ${y} ${w} ${h} re f`);
}

function strokeRect(c, x, y, w, h, color = LIGHT, width = 0.7) {
  c.push(`${colorString(color)} RG`, `${width} w ${x} ${y} ${w} ${h} re S`);
}

function roundedRect(c, x, y, w, h, r, fillColor, strokeColor = null, width = 0.7) {
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
  if (fillColor) parts.push(`${colorString(fillColor)} rg`);
  if (strokeColor) parts.push(`${colorString(strokeColor)} RG`, `${width} w`);
  const paint = fillColor && strokeColor ? "B" : (fillColor ? "f" : "S");
  parts.push(`${path} ${paint}`);
  c.push(parts.join("\n"));
}

function circle(c, cx, cy, r, fillColor, strokeColor = null, width = 0.7) {
  const k = 0.5522848;
  const kr = r * k;
  const path = [
    `${cx + r} ${cy} m`,
    `${cx + r} ${cy + kr} ${cx + kr} ${cy + r} ${cx} ${cy + r} c`,
    `${cx - kr} ${cy + r} ${cx - r} ${cy + kr} ${cx - r} ${cy} c`,
    `${cx - r} ${cy - kr} ${cx - kr} ${cy - r} ${cx} ${cy - r} c`,
    `${cx + kr} ${cy - r} ${cx + r} ${cy - kr} ${cx + r} ${cy} c`,
    "h",
  ].join(" ");

  const parts = [];
  if (fillColor) parts.push(`${colorString(fillColor)} rg`);
  if (strokeColor) parts.push(`${colorString(strokeColor)} RG`, `${width} w`);
  const paint = fillColor && strokeColor ? "B" : (fillColor ? "f" : "S");
  parts.push(`${path} ${paint}`);
  c.push(parts.join("\n"));
}

function rule(c, x1, y1, x2, y2, color = LIGHT, width = 0.7) {
  c.push(`${colorString(color)} RG`, `${width} w ${x1} ${y1} m ${x2} ${y2} l S`);
}

function txt(c, text, x, y, size, color = TEXT, font = "F1") {
  if (!safeText(text)) return;
  c.push(`${colorString(color)} rg`, `BT /${font} ${size} Tf ${x} ${y} Td (${esc(text)}) Tj ET`);
}

function block(c, text, x, y, options = {}) {
  const size = options.size || 8;
  const leading = options.leading || 10;
  const maxChars = options.maxChars || 60;
  const color = options.color || TEXT;
  const font = options.font || "F1";
  const lines = wrap(text, maxChars);

  if (!lines.length) return y;

  c.push(`${colorString(color)} rg`, `BT /${font} ${size} Tf ${x} ${y} Td`);
  lines.forEach((line, index) => {
    if (index) c.push(`0 -${leading} Td`);
    c.push(`(${esc(line)}) Tj`);
  });
  c.push("ET");
  return y - lines.length * leading;
}

function sectionHeading(c, number, title, x, y, width, baselineOffset = 0) {
  const headingY = y - baselineOffset;
  txt(c, String(number).padStart(2, "0"), x, headingY, 7.1, TEAL, "F2");
  txt(c, title.toUpperCase(), x + 18, headingY, 9.1, NAVY, "F2");
  rule(c, x + 18, headingY - 6, x + width, headingY - 6, LIGHT, 0.7);
}

function header(c, resume, continuation = false) {
  if (continuation) {
    txt(c, "PROFESSIONAL RESUME", MARGIN, PAGE_HEIGHT - 42, 7.2, TEAL, "F2");
    txt(c, resume.fullName || "Professional Resume", MARGIN, PAGE_HEIGHT - 65, 16, BLUE, "F2");
    rule(c, MARGIN, PAGE_HEIGHT - 78, PAGE_WIDTH - MARGIN, PAGE_HEIGHT - 78, LIGHT, 0.8);
    return PAGE_HEIGHT - 105;
  }

  txt(c, "PROFESSIONAL RESUME", MARGIN, PAGE_HEIGHT - 42, 7.4, TEAL, "F2");
  txt(c, resume.fullName || "Professional Resume", MARGIN, PAGE_HEIGHT - 78, 27, BLUE, "F2");
  txt(c, resume.title || "Technology Professional", MARGIN, PAGE_HEIGHT - 98, 10.2, TEAL, "F2");

  const contact = [resume.email, resume.phone, resume.location, resume.website]
    .filter(Boolean)
    .join("   |   ");

  if (contact) {
    block(c, contact, MARGIN, PAGE_HEIGHT - 119, {
      size: 6.6,
      leading: 8,
      maxChars: 115,
      color: MUTED,
    });
  }

  // Decorative profile mark matching the reference's circular profile area.
  circle(c, PAGE_WIDTH - MARGIN - 24, PAGE_HEIGHT - 67, 17, MINT, TEAL, 0.8);
  circle(c, PAGE_WIDTH - MARGIN - 24, PAGE_HEIGHT - 67, 11, [0.08, 0.70, 0.62], null);

  return PAGE_HEIGHT - 150;
}

function drawProfile(c, resume, y, width) {
  if (!resume.bio) return y;

  sectionHeading(c, 1, "Profile", MARGIN, y, width);
  y -= 22;

  const lines = wrap(resume.bio, 108);
  const h = Math.max(40, lines.length * 9.5 + 20);

  roundedRect(c, MARGIN, y - h + 7, width, h, 5, PALE, LIGHT, 0.7);
  block(c, resume.bio, MARGIN + 10, y - 8, {
    size: 7.7,
    leading: 9.5,
    maxChars: 108,
    color: MUTED,
  });

  return y - h - 12;
}

function experienceHeight(item, maxChars, leading = 9.1, width = 380) {
  const position = safeText(item.position || "Role");
  const period = safeText(item.period || "");
  const periodWidth = Math.min(92, Math.max(52, period.length * 3.7));
  const titleReserve = width - periodWidth - 14;
  const titleMaxChars = Math.max(18, Math.floor(titleReserve / 5.0));
  const titleLines = Math.max(1, wrap(position, titleMaxChars).length);

  // Mirror drawExperienceEntry exactly so pagination reserves enough room for
  // wrapped titles and the period moved to the following line.
  let h;
  if (titleLines > 1 && period) {
    h = titleLines * 10.5 + 12;
  } else {
    h = 12;
  }

  if (item.company) h += 12;
  if (item.description) h += textHeight(item.description, maxChars, leading) + 8;
  return h;
}

function drawExperienceEntry(c, item, x, y, width, maxChars = 68) {
  const position = safeText(item.position || "Role");
  const period = safeText(item.period || "");

  // Keep the period from colliding with long job titles.
  // Short titles keep the browser-style right alignment; long titles move
  // the period to the next line so the PDF remains clean and readable.
  const periodWidth = Math.min(92, Math.max(52, period.length * 3.7));
  const titleReserve = width - periodWidth - 14;
  const titleLines = position.length > 0
    ? wrap(position, Math.max(18, Math.floor(titleReserve / 5.0)))
    : ["Role"];

  if (titleLines.length > 1 && period) {
    block(c, position, x, y, {
      size: 9,
      leading: 10.5,
      maxChars: Math.max(18, Math.floor(titleReserve / 5.0)),
      color: NAVY,
      font: "F2",
    });
    y -= titleLines.length * 10.5;
    txt(c, period, x, y, 6.7, MUTED);
    y -= 12;
  } else {
    txt(c, position || "Role", x, y, 9, NAVY, "F2");
    if (period) {
      const periodX = x + width - periodWidth;
      txt(c, period, Math.max(x, periodX), y, 6.7, MUTED);
    }
    y -= 12;
  }

  if (item.company) {
    txt(c, item.company, x, y, 7.7, TEAL, "F2");
    y -= 12;
  }

  if (item.description) {
    y = block(c, item.description, x, y, {
      size: 7.35,
      leading: 9.1,
      maxChars,
      color: MUTED,
    }) - 8;
  }

  return y;
}

function drawExperience(c, resume, y, width, bottomLimit) {
  const experience = resume.experience || [];
  if (!experience.length) return { y, used: 0 };

  sectionHeading(c, 2, "Experience", MARGIN, y, width);
  y -= 25;

  let used = 0;
  for (let i = 0; i < experience.length; i += 1) {
    const item = experience[i];
    const h = experienceHeight(item, 68, 9.1, width);

    if (y - h < bottomLimit && used > 0) break;

    y = drawExperienceEntry(c, item, MARGIN, y, width, 68);

    if (i < experience.length - 1) {
      rule(c, MARGIN, y + 3, MARGIN + width, y + 3, LIGHT, 0.55);
      y -= 7;
    }

    used += 1;
  }

  return { y, used };
}

function sidebarCard(c, titleNumber, title, items, x, y, width, drawItems) {
  if (!items?.length) return y;

  const innerX = x + 10;
  const innerW = width - 20;
  const startY = y;

  // First estimate height, then draw the card behind its content.
  const estimated = Math.min(300, 31 + items.reduce((sum, item) => sum + drawItems.measure(item), 0));
  const cardTop = y + 7;
  const cardBottom = y - estimated;

  roundedRect(c, x, cardBottom, width, estimated, 5, PALE, LIGHT, 0.7);

  sectionHeading(c, titleNumber, title, innerX, y, innerW);
  y -= 23;

  items.forEach((item) => {
    y = drawItems.draw(item, innerX, y, innerW);
  });

  return y - 7;
}

function drawEducationItem(item, x, y, width) {
  txt(this, "", 0, 0); // never used; replaced below
  return y;
}

function drawSidebar(c, resume, x, y, width) {
  let sy = y;
  const innerX = x + 10;
  const innerW = width - 20;
  const sectionGap = 8;

  // Each card is measured from the exact same text/wrapping rules used to draw it.
  // This prevents the following section from overlapping when text wraps to 2+ lines.
  const drawCard = ({ number, title, height, drawContent }) => {
    // Treat sy as the actual TOP EDGE of the card. The browser preview has
    // the section title comfortably inside the card, followed by its divider,
    // then the content. The old PDF used a +7 top offset and started content
    // too close to the heading, which made the sidebar look vertically cramped.
    const cardTop = sy;
    const cardBottom = cardTop - height;

    roundedRect(c, x, cardBottom, width, height, 5, PALE, LIGHT, 0.7);

    // Match the browser preview's internal vertical rhythm:
    // card top -> heading -> divider -> content.
    const headingBaseline = cardTop - 13;
    txt(c, String(number).padStart(2, "0"), innerX, headingBaseline, 7.1, TEAL, "F2");
    txt(c, title.toUpperCase(), innerX + 18, headingBaseline, 9.1, NAVY, "F2");
    rule(c, innerX + 18, headingBaseline - 7, innerX + innerW, headingBaseline - 7, LIGHT, 0.7);

    // Content begins clearly below the divider, matching the browser card.
    let contentY = cardTop - 39;
    contentY = drawContent(contentY);

    // Consistent breathing room before the next sidebar card.
    sy = cardBottom - sectionGap;
    return contentY;
  };

  if (resume.education?.length) {
    const items = resume.education;
    const contentHeight = items.reduce((sum, item) => {
      let h = 11; // qualification
      if (item.school) h += textHeight(item.school, 34, 8.2) + 2;
      h += item.period ? 14 : 5;
      return sum + h;
    }, 0);
    const height = 39 + contentHeight + 8;

    drawCard({
      number: 3,
      title: "Education",
      height,
      drawContent: (contentY) => {
        items.forEach((item) => {
          txt(c, item.qualification || "Qualification", innerX, contentY, 7.7, NAVY, "F2");
          contentY -= 11;

          if (item.school) {
            contentY = block(c, item.school, innerX, contentY, {
              size: 7.1,
              leading: 8.2,
              maxChars: 34,
              color: MUTED,
            }) - 2;
          }

          if (item.period) {
            txt(c, item.period, innerX, contentY, 6.6, TEAL);
            contentY -= 14;
          } else {
            contentY -= 5;
          }
        });
        return contentY;
      },
    });
  }

  if (resume.certificates?.length) {
    const items = resume.certificates;
    const contentHeight = items.reduce((sum, item) => {
      const nameHeight = item.name ? textHeight(item.name, 34, 8.2) : 8.2;
      const meta = [item.issuer, item.year].filter(Boolean).join(" - ");
      const metaHeight = meta ? textHeight(meta, 34, 7.6) : 0;
      return sum + nameHeight + 2 + (meta ? metaHeight + 7 : 4);
    }, 0);
    const height = 39 + contentHeight + 8;

    drawCard({
      number: 4,
      title: "Certificates",
      height,
      drawContent: (contentY) => {
        items.forEach((item) => {
          contentY = block(c, item.name || "Certificate", innerX, contentY, {
            size: 7.3,
            leading: 8.2,
            maxChars: 34,
            color: NAVY,
            font: "F2",
          }) - 2;

          const meta = [item.issuer, item.year].filter(Boolean).join(" - ");
          if (meta) {
            contentY = block(c, meta, innerX, contentY, {
              size: 6.6,
              leading: 7.6,
              maxChars: 34,
              color: MUTED,
            }) - 7;
          } else {
            contentY -= 4;
          }
        });
        return contentY;
      },
    });
  }

  if (resume.languages?.length) {
    const items = resume.languages;
    const contentHeight = items.length * 16;
    const height = 39 + contentHeight + 8;

    drawCard({
      number: 5,
      title: "Languages",
      height,
      drawContent: (contentY) => {
        items.forEach((item) => {
          txt(c, item.name || "Language", innerX, contentY, 7.2, NAVY, "F2");
          if (item.level) {
            txt(c, item.level, x + width - 55, contentY, 6.5, TEAL);
          }
          contentY -= 16;
        });
        return contentY;
      },
    });
  }

  const links = [
    resume.github && `GitHub: ${resume.github}`,
    resume.linkedin && `LinkedIn: ${resume.linkedin}`,
  ].filter(Boolean);

  if (links.length) {
    const contentHeight = links.reduce(
      (sum, item) => sum + textHeight(item, 34, 8) + 6,
      0
    );
    const height = 39 + contentHeight + 8;

    drawCard({
      number: 6,
      title: "Connect",
      height,
      drawContent: (contentY) => {
        links.forEach((link) => {
          contentY = block(c, link, innerX, contentY, {
            size: 6.5,
            leading: 8,
            maxChars: 34,
            color: MUTED,
          }) - 6;
        });
        return contentY;
      },
    });
  }

  return sy;
}

function drawFooter(c, resume, page, total) {
  // Keep footer content safely inside the page frame.
  rule(c, MARGIN, 48, PAGE_WIDTH - MARGIN, 48, LIGHT, 0.7);
  txt(c, "Available for creative technology opportunities", MARGIN, 35, 6.3, MUTED);

  if (resume.website) {
    const website = safeText(resume.website);
    txt(c, website, PAGE_WIDTH - MARGIN - Math.min(150, website.length * 3.2), 35, 6.1, MUTED);
  }

  txt(c, `${page} / ${total}`, PAGE_WIDTH - MARGIN - 24, 29, 5.6, MUTED);
}

function drawPageFrame(c) {
  roundedRect(c, 24, 24, PAGE_WIDTH - 48, PAGE_HEIGHT - 48, 7, null, NAVY, 0.9);
}

function buildPages(resume) {
  const pages = [];
  const contentWidth = PAGE_WIDTH - MARGIN * 2;
  const gap = 18;
  const rightWidth = 160;
  const leftWidth = contentWidth - rightWidth - gap;
  const rightX = MARGIN + leftWidth + gap;

  const first = [];
  drawPageFrame(first);

  let y = header(first, resume, false);
  y = drawProfile(first, resume, y, contentWidth);

  const columnsY = y;
  const bottom = 56;

  const rightBottom = drawSidebar(first, resume, rightX, columnsY, rightWidth);
  const experienceResult = drawExperience(first, resume, columnsY, leftWidth, bottom);

  pages.push({
    commands: first,
    remainingExperience: (resume.experience || []).slice(experienceResult.used),
  });

  let remaining = (resume.experience || []).slice(experienceResult.used);

  while (remaining.length) {
    const page = [];
    drawPageFrame(page);
    let py = header(page, resume, true);

    sectionHeading(page, 2, "Experience Continued", MARGIN, py, contentWidth);
    py -= 25;

    let consumed = 0;
    for (let i = 0; i < remaining.length; i += 1) {
      const h = experienceHeight(remaining[i], 102, 9.1, contentWidth);
      if (py - h < bottom && consumed > 0) break;

      py = drawExperienceEntry(page, remaining[i], MARGIN, py, contentWidth, 102);

      if (i < remaining.length - 1) {
        rule(page, MARGIN, py + 3, PAGE_WIDTH - MARGIN, py + 3, LIGHT, 0.55);
        py -= 7;
      }
      consumed += 1;
    }

    if (!consumed) consumed = 1;
    pages.push({ commands: page, remainingExperience: [] });
    remaining = remaining.slice(consumed);
  }

  return pages.map((page) => page.commands);
}

function buildPdf(resume) {
  const safeResume = resume || {};
  const pages = buildPages(safeResume);
  const total = pages.length;
  const objects = [];
  const offsets = [];

  const add = (body) => {
    objects.push(body);
    offsets.push(0);
    return objects.length;
  };

  const catalog = add("<< /Type /Catalog /Pages 2 0 R >>");
  const pagesObject = add("");
  const regular = add("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>");
  const bold = add("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>");
  const pageRefs = [];

  pages.forEach((commands, index) => {
    drawFooter(commands, safeResume, index + 1, total);
    const stream = commands.join("\n") + "\n";
    const byteLength = typeof Buffer !== "undefined"
      ? Buffer.byteLength(stream, "latin1")
      : new TextEncoder().encode(stream).length;

    const content = add(`<< /Length ${byteLength} >>\nstream\n${stream}endstream`);
    pageRefs.push(
      add(
        `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] /Resources << /Font << /F1 ${regular} 0 R /F2 ${bold} 0 R >> >> /Contents ${content} 0 R >>`
      )
    );
  });

  objects[pagesObject - 1] =
    `<< /Type /Pages /Kids [${pageRefs.map((ref) => `${ref} 0 R`).join(" ")}] /Count ${pageRefs.length} >>`;

  let pdf = "%PDF-1.4\n%\xFF\xFF\xFF\xFF\n";

  objects.forEach((body, index) => {
    offsets[index] = typeof Buffer !== "undefined"
      ? Buffer.byteLength(pdf, "latin1")
      : new TextEncoder().encode(pdf).length;

    pdf += `${index + 1} 0 obj\n${body}\nendobj\n`;
  });

  const xref = typeof Buffer !== "undefined"
    ? Buffer.byteLength(pdf, "latin1")
    : new TextEncoder().encode(pdf).length;

  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });

  pdf += `trailer\n<< /Size ${objects.length + 1} /Root ${catalog} 0 R >>\nstartxref\n${xref}\n%%EOF`;

  return typeof Buffer !== "undefined"
    ? Buffer.from(pdf, "latin1")
    : new TextEncoder().encode(pdf);
}


module.exports = { buildPdf };
