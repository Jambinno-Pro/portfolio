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

            for (
              let i = 0;
              i < word.length;
              i += maxChars
            ) {
              lines.push(
                word.slice(
                  i,
                  i + maxChars
                )
              );
            }

            return;
          }

          const next = line
            ? `${line} ${word}`
            : word;

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

function textHeight(
  text,
  maxChars,
  leading
) {
  return (
    Math.max(
      1,
      wrap(text, maxChars).length
    ) * leading
  );
}

/* =========================================================
   PDF DRAWING HELPERS
   ========================================================= */

function fill(
  c,
  x,
  y,
  w,
  h,
  color
) {
  c.push(
    `${colorString(color)} rg`,
    `${x} ${y} ${w} ${h} re f`
  );
}

function strokeRect(
  c,
  x,
  y,
  w,
  h,
  color = LIGHT,
  width = 0.7
) {
  c.push(
    `${colorString(color)} RG`,
    `${width} w ${x} ${y} ${w} ${h} re S`
  );
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
  width = 0.7
) {
  const k = 0.5522848;
  const kr = r * k;

  const path = [
    `${x + r} ${y} m`,
    `${x + w - r} ${y} l`,
    `${x + w - r + kr} ${y} ${
      x + w
    } ${y + r - kr} ${
      x + w
    } ${y + r} c`,
    `${x + w} ${y + h - r} l`,
    `${x + w} ${
      y + h - r + kr
    } ${x + w - r + kr} ${
      y + h
    } ${x + w - r} ${
      y + h
    } c`,
    `${x + r} ${y + h} l`,
    `${x + r - kr} ${y + h} ${x} ${
      y + h - r + kr
    } ${x} ${y + h - r} c`,
    `${x} ${y + r} l`,
    `${x} ${y + r - kr} ${
      x + r - kr
    } ${y} ${x + r} ${y} c`,
    "h",
  ].join(" ");

  const parts = [];

  if (fillColor) {
    parts.push(
      `${colorString(fillColor)} rg`
    );
  }

  if (strokeColor) {
    parts.push(
      `${colorString(strokeColor)} RG`,
      `${width} w`
    );
  }

  const paint =
    fillColor && strokeColor
      ? "B"
      : fillColor
      ? "f"
      : "S";

  parts.push(
    `${path} ${paint}`
  );

  c.push(parts.join("\n"));
}

function circle(
  c,
  cx,
  cy,
  r,
  fillColor,
  strokeColor = null,
  width = 0.7
) {
  const k = 0.5522848;
  const kr = r * k;

  const path = [
    `${cx + r} ${cy} m`,
    `${cx + r} ${cy + kr} ${
      cx + kr
    } ${cy + r} ${cx} ${
      cy + r
    } c`,
    `${cx - kr} ${cy + r} ${
      cx - r
    } ${cy + kr} ${cx - r} ${cy} c`,
    `${cx - r} ${cy - kr} ${
      cx - kr
    } ${cy - r} ${cx} ${
      cy - r
    } c`,
    `${cx + kr} ${cy - r} ${
      cx + r
    } ${cy - kr} ${cx + r} ${cy} c`,
    "h",
  ].join(" ");

  const parts = [];

  if (fillColor) {
    parts.push(
      `${colorString(fillColor)} rg`
    );
  }

  if (strokeColor) {
    parts.push(
      `${colorString(strokeColor)} RG`,
      `${width} w`
    );
  }

  const paint =
    fillColor && strokeColor
      ? "B"
      : fillColor
      ? "f"
      : "S";

  parts.push(
    `${path} ${paint}`
  );

  c.push(parts.join("\n"));
}

function rule(
  c,
  x1,
  y1,
  x2,
  y2,
  color = LIGHT,
  width = 0.7
) {
  c.push(
    `${colorString(color)} RG`,
    `${width} w ${x1} ${y1} m ${x2} ${y2} l S`
  );
}

function txt(
  c,
  text,
  x,
  y,
  size,
  color = TEXT,
  font = "F1"
) {
  if (!safeText(text)) {
    return;
  }

  c.push(
    `${colorString(color)} rg`,
    `BT /${font} ${size} Tf ${x} ${y} Td (${esc(
      text
    )}) Tj ET`
  );
}

function block(
  c,
  text,
  x,
  y,
  options = {}
) {
  const size =
    options.size || 8;

  const leading =
    options.leading || 10;

  const maxChars =
    options.maxChars || 60;

  const color =
    options.color || TEXT;

  const font =
    options.font || "F1";

  const lines = wrap(
    text,
    maxChars
  );

  if (!lines.length) {
    return y;
  }

  c.push(
    `${colorString(color)} rg`,
    `BT /${font} ${size} Tf ${x} ${y} Td`
  );

  lines.forEach(
    (line, index) => {
      if (index) {
        c.push(
          `0 -${leading} Td`
        );
      }

      c.push(
        `(${esc(line)}) Tj`
      );
    }
  );

  c.push("ET");

  return (
    y -
    lines.length * leading
  );
}

/* =========================================================
   SECTION HEADING
   ========================================================= */

function sectionHeading(
  c,
  number,
  title,
  x,
  y,
  width
) {
  txt(
    c,
    String(number).padStart(
      2,
      "0"
    ),
    x,
    y,
    7.1,
    TEAL,
    "F2"
  );

  txt(
    c,
    title.toUpperCase(),
    x + 18,
    y,
    9.1,
    NAVY,
    "F2"
  );

  rule(
    c,
    x + 18,
    y - 6,
    x + width,
    y - 6,
    LIGHT,
    0.7
  );
}

/* =========================================================
   HEADER
   ========================================================= */

function header(
  c,
  resume,
  continuation = false
) {
  if (continuation) {
    txt(
      c,
      "PROFESSIONAL RESUME",
      MARGIN,
      PAGE_HEIGHT - 42,
      7.2,
      TEAL,
      "F2"
    );

    txt(
      c,
      resume.fullName ||
        "Professional Resume",
      MARGIN,
      PAGE_HEIGHT - 65,
      16,
      BLUE,
      "F2"
    );

    rule(
      c,
      MARGIN,
      PAGE_HEIGHT - 78,
      PAGE_WIDTH - MARGIN,
      PAGE_HEIGHT - 78,
      LIGHT,
      0.8
    );

    return PAGE_HEIGHT - 105;
  }

  txt(
    c,
    "PROFESSIONAL RESUME",
    MARGIN,
    PAGE_HEIGHT - 42,
    7.4,
    TEAL,
    "F2"
  );

  txt(
    c,
    resume.fullName ||
      "Professional Resume",
    MARGIN,
    PAGE_HEIGHT - 78,
    27,
    BLUE,
    "F2"
  );

  txt(
    c,
    resume.title ||
      "Professional",
    MARGIN,
    PAGE_HEIGHT - 98,
    10.2,
    TEAL,
    "F2"
  );

  const contact = [
    resume.email,
    resume.phone,
    resume.location,
    resume.website,
  ]
    .filter(Boolean)
    .join("   |   ");

  if (contact) {
    block(
      c,
      contact,
      MARGIN,
      PAGE_HEIGHT - 119,
      {
        size: 6.6,
        leading: 8,
        maxChars: 115,
        color: MUTED,
      }
    );
  }

  circle(
    c,
    PAGE_WIDTH - MARGIN - 24,
    PAGE_HEIGHT - 67,
    17,
    MINT,
    TEAL,
    0.8
  );

  circle(
    c,
    PAGE_WIDTH - MARGIN - 24,
    PAGE_HEIGHT - 67,
    11,
    [0.08, 0.70, 0.62],
    null
  );

  return PAGE_HEIGHT - 150;
}

/* =========================================================
   PROFILE
   ========================================================= */

function drawProfile(
  c,
  resume,
  y,
  width
) {
  if (!resume.bio) {
    return y;
  }

  sectionHeading(
    c,
    1,
    "Profile",
    MARGIN,
    y,
    width
  );

  y -= 22;

  const lines =
    wrap(
      resume.bio,
      Math.max(
        40,
        Math.floor(
          width / 5
        )
      )
    );

  const h = Math.max(
    40,
    lines.length * 9.5 + 20
  );

  roundedRect(
    c,
    MARGIN,
    y - h + 7,
    width,
    h,
    5,
    PALE,
    LIGHT,
    0.7
  );

  block(
    c,
    resume.bio,
    MARGIN + 10,
    y - 8,
    {
      size: 7.7,
      leading: 9.5,
      maxChars: Math.max(
        40,
        Math.floor(
          width / 5
        )
      ),
      color: MUTED,
    }
  );

  return y - h - 12;
}

/* =========================================================
   EXPERIENCE
   ========================================================= */

function experienceHeight(
  item,
  maxChars,
  leading = 9.1,
  width = 380
) {
  const position =
    safeText(
      item.position ||
        "Role"
    );

  const period =
    safeText(
      item.period || ""
    );

  const periodWidth =
    Math.min(
      92,
      Math.max(
        52,
        period.length * 3.7
      )
    );

  const titleReserve =
    width -
    periodWidth -
    14;

  const titleMaxChars =
    Math.max(
      18,
      Math.floor(
        titleReserve / 5
      )
    );

  const titleLines =
    Math.max(
      1,
      wrap(
        position,
        titleMaxChars
      ).length
    );

  let h =
    titleLines > 1 &&
    period
      ? titleLines * 10.5 + 12
      : 12;

  if (item.company) {
    h += 12;
  }

  if (item.description) {
    h +=
      textHeight(
        item.description,
        maxChars,
        leading
      ) + 8;
  }

  return h;
}

function drawExperienceEntry(
  c,
  item,
  x,
  y,
  width,
  maxChars = 68
) {
  const position =
    safeText(
      item.position ||
        "Role"
    );

  const period =
    safeText(
      item.period || ""
    );

  const periodWidth =
    Math.min(
      92,
      Math.max(
        52,
        period.length * 3.7
      )
    );

  const titleReserve =
    width -
    periodWidth -
    14;

  const titleMaxChars =
    Math.max(
      18,
      Math.floor(
        titleReserve / 5
      )
    );

  const titleLines =
    wrap(
      position,
      titleMaxChars
    );

  if (
    titleLines.length > 1 &&
    period
  ) {
    block(
      c,
      position,
      x,
      y,
      {
        size: 9,
        leading: 10.5,
        maxChars:
          titleMaxChars,
        color: NAVY,
        font: "F2",
      }
    );

    y -=
      titleLines.length *
      10.5;

    txt(
      c,
      period,
      x,
      y,
      6.7,
      MUTED
    );

    y -= 12;
  } else {
    txt(
      c,
      position,
      x,
      y,
      9,
      NAVY,
      "F2"
    );

    if (period) {
      const periodX =
        x +
        width -
        periodWidth;

      txt(
        c,
        period,
        Math.max(
          x,
          periodX
        ),
        y,
        6.7,
        MUTED
      );
    }

    y -= 12;
  }

  if (item.company) {
    txt(
      c,
      item.company,
      x,
      y,
      7.7,
      TEAL,
      "F2"
    );

    y -= 12;
  }

  if (item.description) {
    y =
      block(
        c,
        item.description,
        x,
        y,
        {
          size: 7.35,
          leading: 9.1,
          maxChars,
          color: MUTED,
        }
      ) - 8;
  }

  return y;
}

function drawExperience(
  c,
  resume,
  x,
  y,
  width,
  bottomLimit
) {
  const experience =
    Array.isArray(
      resume.experience
    )
      ? resume.experience
      : [];

  if (!experience.length) {
    return {
      y,
      used: 0,
    };
  }

  sectionHeading(
    c,
    2,
    "Experience",
    x,
    y,
    width
  );

  y -= 25;

  let used = 0;

  for (
    let i = 0;
    i < experience.length;
    i += 1
  ) {
    const item =
      experience[i];

    const h =
      experienceHeight(
        item,
        68,
        9.1,
        width
      );

    if (
      y - h < bottomLimit &&
      used > 0
    ) {
      break;
    }

    y =
      drawExperienceEntry(
        c,
        item,
        x,
        y,
        width,
        68
      );

    if (
      i <
      experience.length - 1
    ) {
      rule(
        c,
        x,
        y + 3,
        x + width,
        y + 3,
        LIGHT,
        0.55
      );

      y -= 7;
    }

    used += 1;
  }

  return {
    y,
    used,
  };
}

/* =========================================================
   SIDEBAR
   ========================================================= */

function drawSidebar(
  c,
  resume,
  x,
  y,
  width
) {
  let sy = y;

  const innerX =
    x + 10;

  const innerW =
    width - 20;

  const sectionGap = 7;

  /*
   * Draw one sidebar card.
   */
  const drawCard = ({
    number,
    title,
    height,
    drawContent,
  }) => {
    const safeHeight =
      Math.max(
        42,
        height
      );

    const cardTop =
      sy;

    const cardBottom =
      cardTop -
      safeHeight;

    roundedRect(
      c,
      x,
      cardBottom,
      width,
      safeHeight,
      5,
      PALE,
      LIGHT,
      0.7
    );

    const headingY =
      cardTop - 13;

    txt(
      c,
      String(number).padStart(
        2,
        "0"
      ),
      innerX,
      headingY,
      7.1,
      TEAL,
      "F2"
    );

    txt(
      c,
      title.toUpperCase(),
      innerX + 18,
      headingY,
      8.2,
      NAVY,
      "F2"
    );

    rule(
      c,
      innerX + 18,
      headingY - 7,
      innerX + innerW,
      headingY - 7,
      LIGHT,
      0.7
    );

    const contentY =
      cardTop - 37;

    drawContent(
      contentY
    );

    sy =
      cardBottom -
      sectionGap;
  };

  /* =======================================================
     03 PROFESSIONAL SKILLS

     THIS IS INTENTIONALLY FIRST.
     ======================================================= */

  const skills =
    Array.isArray(
      resume.skills
    )
      ? resume.skills.filter(
          (item) =>
            item &&
            (
              normalize(
                item.name
              ) ||
              normalize(
                item.level
              )
            )
        )
      : [];

  if (skills.length) {
    /*
     * Calculate exact card height.
     */
    let contentHeight = 0;

    skills.forEach(
      (item) => {
        const name =
          safeText(
            item.name ||
              "Skill"
          );

        const level =
          safeText(
            item.level || ""
          );

        const nameLines =
          Math.max(
            1,
            wrap(
              name,
              20
            ).length
          );

        const levelLines =
          level
            ? Math.max(
                1,
                wrap(
                  level,
                  12
                ).length
              )
            : 1;

        const lines =
          Math.max(
            nameLines,
            levelLines
          );

        contentHeight +=
          lines * 9 +
          5;
      }
    );

    /*
     * Card heading = 37
     * bottom padding = 8
     */
    const height =
      37 +
      contentHeight +
      8;

    drawCard({
      number: 3,
      title:
        "Professional Skills",
      height,

      drawContent: (
        contentY
      ) => {
        skills.forEach(
          (item, index) => {
            const name =
              safeText(
                item.name ||
                  "Skill"
              );

            const level =
              safeText(
                item.level || ""
              );

            const nameLines =
              Math.max(
                1,
                wrap(
                  name,
                  20
                ).length
              );

            const levelLines =
              level
                ? Math.max(
                    1,
                    wrap(
                      level,
                      12
                    ).length
                  )
                : 1;

            const lines =
              Math.max(
                nameLines,
                levelLines
              );

            /*
             * Skill name.
             */
            block(
              c,
              name,
              innerX,
              contentY,
              {
                size: 7.1,
                leading: 9,
                maxChars: 20,
                color: NAVY,
                font: "F2",
              }
            );

            /*
             * Skill level.
             *
             * Put it underneath if the skill
             * name is long enough to wrap.
             * This prevents overlap.
             */
            if (level) {
              if (
                nameLines === 1
              ) {
                const levelWidth =
                  Math.min(
                    60,
                    Math.max(
                      30,
                      level.length *
                        3.2
                    )
                  );

                const levelX =
                  innerX +
                  innerW -
                  levelWidth;

                block(
                  c,
                  level,
                  levelX,
                  contentY,
                  {
                    size: 5.9,
                    leading: 9,
                    maxChars: 12,
                    color: TEAL,
                  }
                );
              } else {
                block(
                  c,
                  level,
                  innerX,
                  contentY -
                    nameLines *
                      9,
                  {
                    size: 5.9,
                    leading: 8,
                    maxChars: 30,
                    color: TEAL,
                  }
                );
              }
            }

            /*
             * Separator between skills.
             */
            if (
              index <
              skills.length - 1
            ) {
              rule(
                c,
                innerX,
                contentY -
                  lines * 9 -
                  1,
                innerX +
                  innerW,
                contentY -
                  lines * 9 -
                  1,
                LIGHT,
                0.45
              );
            }

            contentY -=
              lines * 9 +
              5;
          }
        );
      },
    });
  }

  /* =======================================================
     04 EDUCATION
     ======================================================= */

  const education =
    Array.isArray(
      resume.education
    )
      ? resume.education.filter(
          (item) =>
            item &&
            (
              normalize(
                item.qualification
              ) ||
              normalize(
                item.school
              ) ||
              normalize(
                item.period
              )
            )
        )
      : [];

  if (education.length) {
    let contentHeight = 0;

    education.forEach(
      (item) => {
        const qualification =
          item.qualification
            ? textHeight(
                item.qualification,
                32,
                8.2
              )
            : 8.2;

        const school =
          item.school
            ? textHeight(
                item.school,
                32,
                8
              )
            : 0;

        const period =
          item.period
            ? 11
            : 3;

        contentHeight +=
          qualification +
          school +
          period +
          7;
      }
    );

    drawCard({
      number: 4,
      title: "Education",
      height:
        37 +
        contentHeight +
        8,

      drawContent: (
        contentY
      ) => {
        education.forEach(
          (item, index) => {
            if (
              item.qualification
            ) {
              contentY =
                block(
                  c,
                  item.qualification,
                  innerX,
                  contentY,
                  {
                    size: 7.2,
                    leading: 8.2,
                    maxChars: 32,
                    color: NAVY,
                    font: "F2",
                  }
                ) - 2;
            }

            if (item.school) {
              contentY =
                block(
                  c,
                  item.school,
                  innerX,
                  contentY,
                  {
                    size: 6.9,
                    leading: 8,
                    maxChars: 32,
                    color: MUTED,
                  }
                ) - 2;
            }

            if (item.period) {
              txt(
                c,
                item.period,
                innerX,
                contentY,
                6.4,
                TEAL
              );

              contentY -=
                11;
            }

            if (
              index <
              education.length - 1
            ) {
              rule(
                c,
                innerX,
                contentY + 2,
                innerX +
                  innerW,
                contentY + 2,
                LIGHT,
                0.45
              );

              contentY -=
                6;
            }
          }
        );
      },
    });
  }

  /* =======================================================
     05 CERTIFICATES
     ======================================================= */

  const certificates =
    Array.isArray(
      resume.certificates
    )
      ? resume.certificates.filter(
          (item) =>
            item &&
            (
              normalize(
                item.name
              ) ||
              normalize(
                item.issuer
              ) ||
              normalize(
                item.year
              )
            )
        )
      : [];

  if (certificates.length) {
    let contentHeight = 0;

    certificates.forEach(
      (item) => {
        const nameHeight =
          item.name
            ? textHeight(
                item.name,
                32,
                8
              )
            : 8;

        const meta = [
          item.issuer,
          item.year,
        ]
          .filter(Boolean)
          .join(" - ");

        const metaHeight =
          meta
            ? textHeight(
                meta,
                32,
                7.5
              )
            : 0;

        contentHeight +=
          nameHeight +
          metaHeight +
          8;
      }
    );

    drawCard({
      number: 5,
      title:
        "Certificates",
      height:
        37 +
        contentHeight +
        8,

      drawContent: (
        contentY
      ) => {
        certificates.forEach(
          (item, index) => {
            if (item.name) {
              contentY =
                block(
                  c,
                  item.name,
                  innerX,
                  contentY,
                  {
                    size: 7.1,
                    leading: 8,
                    maxChars: 32,
                    color: NAVY,
                    font: "F2",
                  }
                ) - 2;
            }

            const meta = [
              item.issuer,
              item.year,
            ]
              .filter(Boolean)
              .join(" - ");

            if (meta) {
              contentY =
                block(
                  c,
                  meta,
                  innerX,
                  contentY,
                  {
                    size: 6.4,
                    leading: 7.5,
                    maxChars: 32,
                    color: MUTED,
                  }
                ) - 5;
            }

            if (
              index <
              certificates.length - 1
            ) {
              rule(
                c,
                innerX,
                contentY + 2,
                innerX +
                  innerW,
                contentY + 2,
                LIGHT,
                0.45
              );

              contentY -=
                5;
            }
          }
        );
      },
    });
  }

  /* =======================================================
     06 LANGUAGES
     ======================================================= */

  const languages =
    Array.isArray(
      resume.languages
    )
      ? resume.languages.filter(
          (item) =>
            item &&
            (
              normalize(
                item.name
              ) ||
              normalize(
                item.level
              )
            )
        )
      : [];

  if (languages.length) {
    let contentHeight = 0;

    languages.forEach(
      (item) => {
        const nameHeight =
          item.name
            ? textHeight(
                item.name,
                32,
                8
              )
            : 8;

        const levelHeight =
          item.level
            ? textHeight(
                item.level,
                32,
                7.5
              )
            : 0;

        contentHeight +=
          nameHeight +
          levelHeight +
          7;
      }
    );

    drawCard({
      number: 6,
      title:
        "Languages",
      height:
        37 +
        contentHeight +
        8,

      drawContent: (
        contentY
      ) => {
        languages.forEach(
          (item, index) => {
            if (item.name) {
              contentY =
                block(
                  c,
                  item.name,
                  innerX,
                  contentY,
                  {
                    size: 7.1,
                    leading: 8,
                    maxChars: 32,
                    color: NAVY,
                    font: "F2",
                  }
                ) - 1;
            }

            if (item.level) {
              contentY =
                block(
                  c,
                  item.level,
                  innerX,
                  contentY,
                  {
                    size: 6.3,
                    leading: 7.5,
                    maxChars: 32,
                    color: TEAL,
                  }
                ) - 5;
            }

            if (
              index <
              languages.length - 1
            ) {
              rule(
                c,
                innerX,
                contentY + 2,
                innerX +
                  innerW,
                contentY + 2,
                LIGHT,
                0.45
              );

              contentY -=
                5;
            }
          }
        );
      },
    });
  }

  /* =======================================================
     07 CONNECT
     ======================================================= */

  const links = [
    resume.github &&
      `GitHub: ${resume.github}`,
    resume.linkedin &&
      `LinkedIn: ${resume.linkedin}`,
  ].filter(Boolean);

  if (links.length) {
    let contentHeight = 0;

    links.forEach(
      (link) => {
        contentHeight +=
          textHeight(
            link,
            32,
            7.5
          ) + 5;
      }
    );

    drawCard({
      number: 7,
      title: "Connect",
      height:
        37 +
        contentHeight +
        8,

      drawContent: (
        contentY
      ) => {
        links.forEach(
          (link, index) => {
            contentY =
              block(
                c,
                link,
                innerX,
                contentY,
                {
                  size: 6.2,
                  leading: 7.5,
                  maxChars: 32,
                  color: MUTED,
                }
              ) - 5;

            if (
              index <
              links.length - 1
            ) {
              rule(
                c,
                innerX,
                contentY + 2,
                innerX +
                  innerW,
                contentY + 2,
                LIGHT,
                0.45
              );
            }
          }
        );
      },
    });
  }

  return sy;
}

/* =========================================================
   FOOTER
   ========================================================= */

function drawFooter(
  c,
  resume,
  page,
  total
) {
  rule(
    c,
    MARGIN,
    48,
    PAGE_WIDTH - MARGIN,
    48,
    LIGHT,
    0.7
  );

  txt(
    c,
    "Available for creative technology opportunities",
    MARGIN,
    35,
    6.3,
    MUTED
  );

  if (resume.website) {
    const website =
      safeText(
        resume.website
      );

    txt(
      c,
      website,
      PAGE_WIDTH -
        MARGIN -
        Math.min(
          150,
          website.length * 3.2
        ),
      35,
      6.1,
      MUTED
    );
  }

  txt(
    c,
    `${page} / ${total}`,
    PAGE_WIDTH -
      MARGIN -
      24,
    29,
    5.6,
    MUTED
  );
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
    7,
    null,
    NAVY,
    0.9
  );
}

/* =========================================================
   FIRST PAGE
   ========================================================= */

function buildFirstPage(
  resume
) {
  const page = [];

  drawPageFrame(page);

  const headerY =
    header(
      page,
      resume,
      false
    );

  /*
   * -------------------------------------------------------
   * IMPORTANT LAYOUT CHANGE
   *
   * The old PDF did this:
   *
   * Header
   * Profile across full page
   * THEN sidebar
   *
   * That meant a long profile could push the sidebar
   * below the printable area.
   *
   * The new PDF starts BOTH columns immediately after
   * the header.
   * -------------------------------------------------------
   */

  const contentWidth =
    PAGE_WIDTH -
    MARGIN * 2;

  const gap = 18;

  const rightWidth = 160;

  const leftWidth =
    contentWidth -
    rightWidth -
    gap;

  const rightX =
    MARGIN +
    leftWidth +
    gap;

  const columnsTop =
    headerY - 8;

  /*
   * RIGHT COLUMN
   *
   * Professional Skills starts here.
   */
  drawSidebar(
    page,
    resume,
    rightX,
    columnsTop,
    rightWidth
  );

  /*
   * LEFT COLUMN
   *
   * Profile and Experience.
   */
  let leftY =
    columnsTop;

  if (resume.bio) {
    sectionHeading(
      page,
      1,
      "Profile",
      MARGIN,
      leftY,
      leftWidth
    );

    leftY -= 22;

    const profileLines =
      wrap(
        resume.bio,
        Math.max(
          35,
          Math.floor(
            leftWidth / 5
          )
        )
      );

    const profileHeight =
      Math.max(
        40,
        profileLines.length *
          9.5 +
          20
      );

    roundedRect(
      page,
      MARGIN,
      leftY -
        profileHeight +
        7,
      leftWidth,
      profileHeight,
      5,
      PALE,
      LIGHT,
      0.7
    );

    block(
      page,
      resume.bio,
      MARGIN + 10,
      leftY - 8,
      {
        size: 7.5,
        leading: 9.5,
        maxChars: Math.max(
          35,
          Math.floor(
            leftWidth / 5
          )
        ),
        color: MUTED,
      }
    );

    leftY =
      leftY -
      profileHeight -
      14;
  }

  /*
   * Experience starts below Profile.
   */
  const bottom =
    58;

  const experienceResult =
    drawExperience(
      page,
      resume,
      MARGIN,
      leftY,
      leftWidth,
      bottom
    );

  const used =
    experienceResult.used;

  const experience =
    Array.isArray(
      resume.experience
    )
      ? resume.experience
      : [];

  return {
    page,
    remaining:
      experience.slice(
        used
      ),
  };
}

/* =========================================================
   CONTINUATION EXPERIENCE PAGE
   ========================================================= */

function buildExperiencePage(
  resume,
  remaining
) {
  const page = [];

  drawPageFrame(page);

  let y =
    header(
      page,
      resume,
      true
    );

  const contentWidth =
    PAGE_WIDTH -
    MARGIN * 2;

  sectionHeading(
    page,
    2,
    "Experience Continued",
    MARGIN,
    y,
    contentWidth
  );

  y -= 25;

  const bottom =
    58;

  let consumed = 0;

  for (
    let i = 0;
    i < remaining.length;
    i += 1
  ) {
    const item =
      remaining[i];

    const h =
      experienceHeight(
        item,
        102,
        9.1,
        contentWidth
      );

    if (
      y - h < bottom &&
      consumed > 0
    ) {
      break;
    }

    y =
      drawExperienceEntry(
        page,
        item,
        MARGIN,
        y,
        contentWidth,
        102
      );

    if (
      i <
      remaining.length - 1
    ) {
      rule(
        page,
        MARGIN,
        y + 3,
        PAGE_WIDTH - MARGIN,
        y + 3,
        LIGHT,
        0.55
      );

      y -= 7;
    }

    consumed += 1;
  }

  /*
   * Safety guard.
   */
  if (!consumed) {
    consumed = 1;
  }

  return {
    page,
    remaining:
      remaining.slice(
        consumed
      ),
  };
}

/* =========================================================
   BUILD ALL PAGES
   ========================================================= */

function buildPages(
  resume
) {
  const pages = [];

  /*
   * FIRST PAGE
   */
  const first =
    buildFirstPage(
      resume
    );

  pages.push(
    first.page
  );

  /*
   * REMAINING EXPERIENCE
   */
  let remaining =
    first.remaining;

  while (
    remaining.length
  ) {
    const next =
      buildExperiencePage(
        resume,
        remaining
      );

    pages.push(
      next.page
    );

    remaining =
      next.remaining;
  }

  /*
   * Footer is added only after
   * the total number of pages
   * is known.
   */
  const total =
    pages.length;

  pages.forEach(
    (commands, index) => {
      drawFooter(
        commands,
        resume,
        index + 1,
        total
      );
    }
  );

  return pages;
}

/* =========================================================
   BUILD PDF
   ========================================================= */

function buildPdf(
  resume
) {
  const safeResume =
    resume || {};

  /*
   * Normalize arrays defensively.
   *
   * This ensures the PDF generator doesn't
   * crash if MongoDB returns undefined/null.
   */
  const normalizedResume = {
    ...safeResume,

    skills:
      Array.isArray(
        safeResume.skills
      )
        ? safeResume.skills
        : [],

    experience:
      Array.isArray(
        safeResume.experience
      )
        ? safeResume.experience
        : [],

    education:
      Array.isArray(
        safeResume.education
      )
        ? safeResume.education
        : [],

    certificates:
      Array.isArray(
        safeResume.certificates
      )
        ? safeResume.certificates
        : [],

    languages:
      Array.isArray(
        safeResume.languages
      )
        ? safeResume.languages
        : [],
  };

  /*
   * Build page commands.
   */
  const pages =
    buildPages(
      normalizedResume
    );

  const objects = [];
  const offsets = [];

  const add = (body) => {
    objects.push(body);
    offsets.push(0);

    return objects.length;
  };

  /*
   * -------------------------------------------------------
   * PDF OBJECTS
   * -------------------------------------------------------
   */

  const catalog =
    add(
      "<< /Type /Catalog /Pages 2 0 R >>"
    );

  const pagesObject =
    add("");

  const regular =
    add(
      "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>"
    );

  const bold =
    add(
      "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>"
    );

  const pageRefs = [];

  pages.forEach(
    (commands) => {
      const stream =
        commands.join(
          "\n"
        ) + "\n";

      const byteLength =
        typeof Buffer !==
        "undefined"
          ? Buffer.byteLength(
              stream,
              "latin1"
            )
          : new TextEncoder()
              .encode(
                stream
              )
              .length;

      const content =
        add(
          `<< /Length ${byteLength} >>\nstream\n${stream}endstream`
        );

      pageRefs.push(
        add(
          `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] /Resources << /Font << /F1 ${regular} 0 R /F2 ${bold} 0 R >> >> /Contents ${content} 0 R >>`
        )
      );
    }
  );

  /*
   * Pages object.
   */
  objects[
    pagesObject - 1
  ] =
    `<< /Type /Pages /Kids [${pageRefs
      .map(
        (ref) =>
          `${ref} 0 R`
      )
      .join(
        " "
      )}] /Count ${pageRefs.length} >>`;

  /*
   * -------------------------------------------------------
   * PDF HEADER
   * -------------------------------------------------------
   */

  let pdf =
    "%PDF-1.4\n%\xFF\xFF\xFF\xFF\n";

  /*
   * -------------------------------------------------------
   * OBJECTS
   * -------------------------------------------------------
   */

  objects.forEach(
    (body, index) => {
      offsets[index] =
        typeof Buffer !==
        "undefined"
          ? Buffer.byteLength(
              pdf,
              "latin1"
            )
          : new TextEncoder()
              .encode(
                pdf
              )
              .length;

      pdf +=
        `${index + 1} 0 obj\n` +
        `${body}\n` +
        `endobj\n`;
    }
  );

  /*
   * -------------------------------------------------------
   * XREF
   * -------------------------------------------------------
   */

  const xref =
    typeof Buffer !==
    "undefined"
      ? Buffer.byteLength(
          pdf,
          "latin1"
        )
      : new TextEncoder()
          .encode(
            pdf
          )
          .length;

  pdf +=
    `xref\n0 ${
      objects.length + 1
    }\n` +
    `0000000000 65535 f \n`;

  offsets.forEach(
    (offset) => {
      pdf +=
        `${String(
          offset
        ).padStart(
          10,
          "0"
        )} 00000 n \n`;
    }
  );

  /*
   * -------------------------------------------------------
   * TRAILER
   * -------------------------------------------------------
   */

  pdf +=
    `trailer\n<< /Size ${
      objects.length + 1
    } /Root ${catalog} 0 R >>\n` +
    `startxref\n${xref}\n` +
    `%%EOF`;

  /*
   * -------------------------------------------------------
   * RETURN PDF BUFFER
   * -------------------------------------------------------
   */

  return typeof Buffer !==
    "undefined"
    ? Buffer.from(
        pdf,
        "latin1"
      )
    : new TextEncoder().encode(
        pdf
      );
}

/* =========================================================
   EXPORT
   ========================================================= */

module.exports = {
  buildPdf,
};