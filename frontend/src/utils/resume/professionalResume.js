import jsPDF from "jspdf";

import { cleanRichText } from "./richText";

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

function addWrappedText(
  doc,
  text,
  x,
  y,
  maxWidth,
  lineHeight = 5
) {
  if (!text) return y;

  const lines = doc.splitTextToSize(
    String(text),
    maxWidth
  );

  doc.text(lines, x, y);

  return y + lines.length * lineHeight;
}

export function generateProfessionalResume(
  profile,
  projects = []
) {
  const doc = new jsPDF();

  const pageWidth =
    doc.internal.pageSize.getWidth();

  const pageHeight =
    doc.internal.pageSize.getHeight();

  const margin = 18;

  const contentWidth =
    pageWidth - margin * 2;

  let y = 18;

  // ====================================
  // Header
  // ====================================

  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);

  doc.text(
    profile?.fullName ||
      "Your Name",
    margin,
    y
  );

  y += 8;

  doc.setFont(
    "helvetica",
    "normal"
  );

  doc.setFontSize(9);

  const contactDetails = [
    profile?.email,
    profile?.username
      ? `@${profile.username}`
      : null,
    profile?.github,
    profile?.linkedin,
    profile?.website,
  ].filter(Boolean);

  if (contactDetails.length) {
    const contactText =
      contactDetails.join("  |  ");

    y = addWrappedText(
      doc,
      contactText,
      margin,
      y,
      contentWidth,
      4
    );

    y += 4;
  }

  doc.setDrawColor(
    80,
    80,
    80
  );

  doc.line(
    margin,
    y,
    pageWidth - margin,
    y
  );

  y += 8;

  // ====================================
  // Professional Summary
  // ====================================

  if (profile?.bio) {
    y = addSectionTitle(
      doc,
      "PROFESSIONAL SUMMARY",
      margin,
      y,
      contentWidth
    );

    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.setFontSize(9);

    y = addWrappedText(
      doc,
      profile.bio,
      margin,
      y,
      contentWidth,
      4.5
    );

    y += 6;
  }

  // ====================================
  // Skills
  // ====================================

  if (profile?.skills?.length) {
    y = addSectionTitle(
      doc,
      "TECHNICAL SKILLS",
      margin,
      y,
      contentWidth
    );

    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.setFontSize(9);

    y = addWrappedText(
      doc,
      profile.skills.join(
        "  •  "
      ),
      margin,
      y,
      contentWidth,
      4.5
    );

    y += 6;
  }

  // ====================================
  // Experience
  // ====================================

  if (profile?.experience?.length) {
    y = addSectionTitle(
      doc,
      "EXPERIENCE",
      margin,
      y,
      contentWidth
    );

    profile.experience.forEach(
      (experience) => {
        checkPageBreak(
          doc,
          y
        );

        if (
          y >
          pageHeight - 40
        ) {
          y = margin;
        }

        doc.setFont(
          "helvetica",
          "bold"
        );

        doc.setFontSize(10);

        doc.text(
          experience.position ||
            "Position",
          margin,
          y
        );

        y += 5;

        doc.setFont(
          "helvetica",
          "normal"
        );

        doc.setFontSize(9);

        const companyLine = [
          experience.company,
          experience.location,
        ]
          .filter(Boolean)
          .join("  |  ");

        if (companyLine) {
          doc.text(
            companyLine,
            margin,
            y
          );
        }

        const dates = [
          formatDate(
            experience.startDate
          ),
          experience.currentlyWorking
            ? "Present"
            : formatDate(
                experience.endDate
              ),
        ]
          .filter(Boolean)
          .join(" - ");

        if (dates) {
          doc.text(
            dates,
            pageWidth - margin,
            y,
            {
              align: "right",
            }
          );
        }

        y += 5;

        const description =
          cleanRichText(
            experience.description
          );

        if (description) {
          y = addWrappedText(
            doc,
            description,
            margin,
            y,
            contentWidth,
            4.5
          );

          y += 3;
        }

        y += 4;
      }
    );
  }

  // ====================================
  // Education
  // ====================================

  if (profile?.education?.length) {
    y = addSectionTitle(
      doc,
      "EDUCATION",
      margin,
      y,
      contentWidth
    );

    profile.education.forEach(
      (education) => {
        checkPageBreak(
          doc,
          y
        );

        if (
          y >
          pageHeight - 35
        ) {
          y = margin;
        }

        doc.setFont(
          "helvetica",
          "bold"
        );

        doc.setFontSize(10);

        doc.text(
          education.degree ||
            "Degree",
          margin,
          y
        );

        y += 5;

        doc.setFont(
          "helvetica",
          "normal"
        );

        doc.setFontSize(9);

        const educationLine = [
          education.institution,
          education.fieldOfStudy,
        ]
          .filter(Boolean)
          .join("  |  ");

        if (educationLine) {
          doc.text(
            educationLine,
            margin,
            y
          );
        }

        const dates = [
          formatDate(
            education.startDate
          ),
          formatDate(
            education.endDate
          ),
        ]
          .filter(Boolean)
          .join(" - ");

        if (dates) {
          doc.text(
            dates,
            pageWidth - margin,
            y,
            {
              align: "right",
            }
          );
        }

        y += 7;
      }
    );

    y += 2;
  }

  // ====================================
  // Projects
  // ====================================

  if (projects.length) {
    y = addSectionTitle(
      doc,
      "PROJECTS",
      margin,
      y,
      contentWidth
    );

    projects.forEach(
      (project) => {
        checkPageBreak(
          doc,
          y
        );

        if (
          y >
          pageHeight - 45
        ) {
          y = margin;
        }

        doc.setFont(
          "helvetica",
          "bold"
        );

        doc.setFontSize(10);

        doc.text(
          project.title ||
            "Project",
          margin,
          y
        );

        y += 5;

        if (
          project.techStack?.length
        ) {
          doc.setFont(
            "helvetica",
            "italic"
          );

          doc.setFontSize(8);

          doc.text(
            project.techStack.join(
              "  •  "
            ),
            margin,
            y
          );

          y += 5;
        }

        const description =
          cleanRichText(
            project.description
          );

        if (description) {
          doc.setFont(
            "helvetica",
            "normal"
          );

          doc.setFontSize(9);

          y = addWrappedText(
            doc,
            description,
            margin,
            y,
            contentWidth,
            4.5
          );

          y += 5;
        }
      }
    );
  }

  // ====================================
  // Certificates
  // ====================================

  if (profile?.certificates?.length) {
    y = addSectionTitle(
      doc,
      "CERTIFICATIONS",
      margin,
      y,
      contentWidth
    );

    profile.certificates.forEach(
      (certificate) => {
        checkPageBreak(
          doc,
          y
        );

        if (
          y >
          pageHeight - 30
        ) {
          y = margin;
        }

        doc.setFont(
          "helvetica",
          "bold"
        );

        doc.setFontSize(9);

        doc.text(
          certificate.title ||
            "Certification",
          margin,
          y
        );

        y += 4;

        doc.setFont(
          "helvetica",
          "normal"
        );

        const issuer = [
          certificate.issuer,
          formatDate(
            certificate.issueDate
          ),
        ]
          .filter(Boolean)
          .join("  |  ");

        if (issuer) {
          doc.text(
            issuer,
            margin,
            y
          );
        }

        y += 6;
      }
    );
  }

  // ====================================
  // Footer
  // ====================================

  const totalPages =
    doc.internal.getNumberOfPages();

  for (
    let page = 1;
    page <= totalPages;
    page++
  ) {
    doc.setPage(page);

    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.setFontSize(7);

    doc.setTextColor(
      120,
      120,
      120
    );

    doc.text(
      `DevPulse • ${
        profile?.fullName ||
        "Resume"
      }`,
      margin,
      pageHeight - 8
    );

    doc.text(
      `Page ${page} of ${totalPages}`,
      pageWidth - margin,
      pageHeight - 8,
      {
        align: "right",
      }
    );
  }

  doc.save(
    `${
      profile?.username ||
      "resume"
    }-professional.pdf`
  );
}

// ====================================
// Section Title
// ====================================

function addSectionTitle(
  doc,
  title,
  x,
  y,
  width
) {
  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.setFontSize(9);

  doc.setTextColor(
    50,
    50,
    50
  );

  doc.text(
    title,
    x,
    y
  );

  y += 2;

  doc.setDrawColor(
    120,
    120,
    120
  );

  doc.line(
    x,
    y,
    x + width,
    y
  );

  return y + 6;
}

// ====================================
// Page Break
// ====================================

function checkPageBreak(
  doc,
  y
) {
  const pageHeight =
    doc.internal.pageSize.getHeight();

  if (
    y >
    pageHeight - 30
  ) {
    doc.addPage();
  }
}