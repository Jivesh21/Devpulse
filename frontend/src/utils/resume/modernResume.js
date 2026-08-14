import jsPDF from "jspdf";

import { cleanRichText } from "./richText";

const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;

const SIDEBAR_WIDTH = 58;
const MAIN_X = 72;
const MAIN_WIDTH = 124;

const MARGIN = 14;

function clean(value) {
  return value ? String(value).trim() : "";
}

function formatDate(date) {
  if (!date) return "";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  return parsed.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

function drawSidebar(doc, profile) {
  doc.setFillColor(24, 20, 38);

  doc.rect(
    0,
    0,
    SIDEBAR_WIDTH,
    PAGE_HEIGHT,
    "F"
  );

  doc.setFillColor(139, 92, 246);

  doc.rect(
    0,
    0,
    3,
    PAGE_HEIGHT,
    "F"
  );

  let y = 22;

  doc.setFillColor(139, 92, 246);

  doc.circle(
    SIDEBAR_WIDTH / 2,
    y,
    12,
    "F"
  );

  const initials =
    clean(profile.fullName)
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((name) => name.charAt(0))
      .join("")
      .toUpperCase() || "U";

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);

  doc.text(
    initials,
    SIDEBAR_WIDTH / 2,
    y + 3,
    {
      align: "center",
    }
  );

  y += 28;

  doc.setTextColor(196, 181, 253);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");

  doc.text(
    "CONTACT",
    10,
    y
  );

  y += 7;

  const contactItems = [
    clean(profile.email),
    clean(profile.github),
    clean(profile.linkedin),
    clean(profile.website),
  ].filter(Boolean);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(225, 220, 235);

  contactItems.forEach((item) => {
    const lines = doc.splitTextToSize(
      item,
      SIDEBAR_WIDTH - 18
    );

    doc.text(
      lines,
      10,
      y
    );

    y += lines.length * 3.5 + 3;
  });

  if (
    Array.isArray(profile.skills) &&
    profile.skills.length
  ) {
    y += 5;

    doc.setTextColor(196, 181, 253);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);

    doc.text(
      "SKILLS",
      10,
      y
    );

    y += 7;

    profile.skills.forEach((skill) => {
      const value = clean(skill);

      if (!value) return;

      const lines = doc.splitTextToSize(
        `• ${value}`,
        SIDEBAR_WIDTH - 18
      );

      doc.setTextColor(
        225,
        220,
        235
      );

      doc.setFont("helvetica", "normal");
      doc.setFontSize(6.5);

      doc.text(
        lines,
        10,
        y
      );

      y +=
        lines.length * 3.5 +
        2.5;
    });
  }

  if (clean(profile.bio)) {
    y += 6;

    doc.setTextColor(196, 181, 253);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);

    doc.text(
      "ABOUT",
      10,
      y
    );

    y += 7;

    const bioLines =
      doc.splitTextToSize(
        clean(profile.bio),
        SIDEBAR_WIDTH - 18
      );

    doc.setTextColor(
      225,
      220,
      235
    );

    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);

    doc.text(
      bioLines,
      10,
      y
    );
  }
}

function drawHeader(doc, profile) {
  doc.setTextColor(30, 27, 38);

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.setFontSize(24);

  doc.text(
    clean(profile.fullName) ||
      "Developer",
    MAIN_X,
    22
  );

  doc.setFont(
    "helvetica",
    "normal"
  );

  doc.setFontSize(9);

  doc.setTextColor(
    110,
    105,
    120
  );

  const username = clean(
    profile.username
  );

  if (username) {
    doc.text(
      `@${username}`,
      MAIN_X,
      29
    );
  }

  doc.setDrawColor(
    139,
    92,
    246
  );

  doc.setLineWidth(0.8);

  doc.line(
    MAIN_X,
    35,
    PAGE_WIDTH - MARGIN,
    35
  );
}

function drawSectionTitle(
  doc,
  title,
  y
) {
  doc.setTextColor(
    45,
    40,
    55
  );

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.setFontSize(11);

  doc.text(
    title.toUpperCase(),
    MAIN_X,
    y
  );

  doc.setDrawColor(
    220,
    215,
    230
  );

  doc.setLineWidth(0.25);

  doc.line(
    MAIN_X,
    y + 2,
    PAGE_WIDTH - MARGIN,
    y + 2
  );

  return y + 9;
}

function drawExperience(
  doc,
  profile,
  y
) {
  if (
    !Array.isArray(
      profile.experience
    ) ||
    !profile.experience.length
  ) {
    return y;
  }

  y = drawSectionTitle(
    doc,
    "Experience",
    y
  );

  profile.experience.forEach(
    (item) => {
      const company =
        clean(item.company);

      const position =
        clean(item.position);

      const location =
        clean(item.location);

      const description =
        cleanRichText(
          item.description
        );

      doc.setTextColor(
        35,
        30,
        45
      );

      doc.setFont(
        "helvetica",
        "bold"
      );

      doc.setFontSize(9);

      doc.text(
        position || "Experience",
        MAIN_X,
        y
      );

      y += 4.5;

      doc.setFont(
        "helvetica",
        "normal"
      );

      doc.setFontSize(7.5);

      doc.setTextColor(
        110,
        105,
        120
      );

      const companyText = [
        company,
        location,
      ]
        .filter(Boolean)
        .join(" • ");

      if (companyText) {
        doc.text(
          companyText,
          MAIN_X,
          y
        );

        y += 4;
      }

      const dates = [
        formatDate(
          item.startDate
        ),
        item.currentlyWorking
          ? "Present"
          : formatDate(
              item.endDate
            ),
      ]
        .filter(Boolean)
        .join(" – ");

      if (dates) {
        doc.text(
          dates,
          MAIN_X,
          y
        );

        y += 4;
      }

      if (description) {
        const lines =
          doc.splitTextToSize(
            description,
            MAIN_WIDTH
          );

        doc.setTextColor(
          75,
          70,
          85
        );

        doc.text(
          lines,
          MAIN_X,
          y
        );

        y +=
          lines.length * 3.7;
      }

      y += 6;
    }
  );

  return y;
}

function drawProjects(
  doc,
  projects,
  y
) {
  if (
    !Array.isArray(projects) ||
    !projects.length
  ) {
    return y;
  }

  y = drawSectionTitle(
    doc,
    "Projects",
    y
  );

  projects.forEach(
    (project) => {
      const title =
        clean(project.title);

      const description =
        cleanRichText(
          project.description
        );

      const techStack =
        Array.isArray(
          project.techStack
        )
          ? project.techStack
              .filter(Boolean)
              .join(" • ")
          : "";

      doc.setTextColor(
        35,
        30,
        45
      );

      doc.setFont(
        "helvetica",
        "bold"
      );

      doc.setFontSize(9);

      doc.text(
        title || "Project",
        MAIN_X,
        y
      );

      y += 4.5;

      if (techStack) {
        doc.setFont(
          "helvetica",
          "normal"
        );

        doc.setFontSize(7);

        doc.setTextColor(
          139,
          92,
          246
        );

        doc.text(
          techStack,
          MAIN_X,
          y
        );

        y += 4;
      }

      if (description) {
        const lines =
          doc.splitTextToSize(
            description,
            MAIN_WIDTH
          );

        doc.setTextColor(
          75,
          70,
          85
        );

        doc.setFontSize(7.5);

        doc.text(
          lines,
          MAIN_X,
          y
        );

        y +=
          lines.length * 3.7;
      }

      const links = [
        project.githubUrl,
        project.liveUrl,
      ].filter(Boolean);

      if (links.length) {
        y += 2;

        doc.setFontSize(6.5);
        doc.setTextColor(
          100,
          85,
          150
        );

        doc.text(
          links.join("  |  "),
          MAIN_X,
          y
        );

        y += 3;
      }

      y += 6;
    }
  );

  return y;
}

function drawEducation(
  doc,
  profile,
  y
) {
  if (
    !Array.isArray(
      profile.education
    ) ||
    !profile.education.length
  ) {
    return y;
  }

  y = drawSectionTitle(
    doc,
    "Education",
    y
  );

  profile.education.forEach(
    (item) => {
      const institution =
        clean(
          item.institution
        );

      const degree =
        clean(item.degree);

      const field =
        clean(
          item.fieldOfStudy
        );

      const dates = [
        formatDate(
          item.startDate
        ),
        formatDate(
          item.endDate
        ),
      ]
        .filter(Boolean)
        .join(" – ");

      doc.setTextColor(
        35,
        30,
        45
      );

      doc.setFont(
        "helvetica",
        "bold"
      );

      doc.setFontSize(9);

      doc.text(
        institution ||
          "Institution",
        MAIN_X,
        y
      );

      y += 4.5;

      doc.setFont(
        "helvetica",
        "normal"
      );

      doc.setFontSize(7.5);

      doc.setTextColor(
        75,
        70,
        85
      );

      const educationLine = [
        degree,
        field,
      ]
        .filter(Boolean)
        .join(" • ");

      if (educationLine) {
        doc.text(
          educationLine,
          MAIN_X,
          y
        );

        y += 4;
      }

      if (dates) {
        doc.setTextColor(
          110,
          105,
          120
        );

        doc.text(
          dates,
          MAIN_X,
          y
        );

        y += 4;
      }

      if (item.grade) {
        doc.text(
          `Grade: ${clean(
            item.grade
          )}`,
          MAIN_X,
          y
        );

        y += 4;
      }

      y += 5;
    }
  );

  return y;
}

function drawCertificates(
  doc,
  profile,
  y
) {
  if (
    !Array.isArray(
      profile.certificates
    ) ||
    !profile.certificates.length
  ) {
    return y;
  }

  y = drawSectionTitle(
    doc,
    "Certifications",
    y
  );

  profile.certificates.forEach(
    (certificate) => {
      const title =
        clean(
          certificate.title
        );

      const issuer =
        clean(
          certificate.issuer
        );

      const date =
        formatDate(
          certificate.issueDate
        );

      doc.setTextColor(
        35,
        30,
        45
      );

      doc.setFont(
        "helvetica",
        "bold"
      );

      doc.setFontSize(8.5);

      doc.text(
        title || "Certificate",
        MAIN_X,
        y
      );

      y += 4;

      const line = [
        issuer,
        date,
      ]
        .filter(Boolean)
        .join(" • ");

      if (line) {
        doc.setFont(
          "helvetica",
          "normal"
        );

        doc.setFontSize(7);

        doc.setTextColor(
          110,
          105,
          120
        );

        doc.text(
          line,
          MAIN_X,
          y
        );

        y += 4;
      }

      y += 4;
    }
  );

  return y;
}

export function generateModernResume(
  profile,
  projects = []
) {
  const doc =
    new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

  drawSidebar(
    doc,
    profile
  );

  drawHeader(
    doc,
    profile
  );

  let y = 46;

  y = drawExperience(
    doc,
    profile,
    y
  );

  y = drawProjects(
    doc,
    projects,
    y
  );

  y = drawEducation(
    doc,
    profile,
    y
  );

  y = drawCertificates(
    doc,
    profile,
    y
  );

  const fileName =
    `${
      clean(profile.username) ||
      "developer"
    }-resume-modern.pdf`;

  doc.save(fileName);
}