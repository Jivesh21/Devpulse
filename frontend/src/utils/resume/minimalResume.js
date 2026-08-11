import jsPDF from "jspdf";

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
  lineHeight = 4.5
) {
  if (!text) return y;

  const lines = doc.splitTextToSize(
    String(text),
    maxWidth
  );

  doc.text(lines, x, y);

  return y + lines.length * lineHeight;
}

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
    40,
    40,
    40
  );

  doc.text(
    title.toUpperCase(),
    x,
    y
  );

  y += 2;

  doc.setDrawColor(
    180,
    180,
    180
  );

  doc.line(
    x,
    y,
    x + width,
    y
  );

  return y + 6;
}

function ensureSpace(
  doc,
  y,
  requiredSpace,
  margin
) {
  const pageHeight =
    doc.internal.pageSize.getHeight();

  if (
    y + requiredSpace >
    pageHeight - margin
  ) {
    doc.addPage();

    return margin;
  }

  return y;
}

export function generateMinimalResume(
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

  let y = margin;

  // ====================================
  // Header
  // ====================================

  doc.setTextColor(
    30,
    30,
    30
  );

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.setFontSize(24);

  doc.text(
    profile?.fullName ||
      "Your Name",
    margin,
    y
  );

  y += 7;

  // Professional identity

  if (profile?.username) {
    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.setFontSize(9);

    doc.setTextColor(
      100,
      100,
      100
    );

    doc.text(
      `@${profile.username}`,
      margin,
      y
    );

    y += 5;
  }

  // Contact information

  const contactDetails = [
    profile?.email,
    profile?.github,
    profile?.linkedin,
    profile?.website,
  ].filter(Boolean);

  if (
    contactDetails.length
  ) {
    y = addWrappedText(
      doc,
      contactDetails.join(
        "  •  "
      ),
      margin,
      y,
      contentWidth,
      4
    );

    y += 5;
  }

  doc.setDrawColor(
    100,
    100,
    100
  );

  doc.line(
    margin,
    y,
    pageWidth - margin,
    y
  );

  y += 8;

  // ====================================
  // Summary
  // ====================================

  if (profile?.bio) {
    y = addSectionTitle(
      doc,
      "Summary",
      margin,
      y,
      contentWidth
    );

    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.setFontSize(9);

    doc.setTextColor(
      60,
      60,
      60
    );

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

  if (
    profile?.skills?.length
  ) {
    y = ensureSpace(
      doc,
      y,
      25,
      margin
    );

    y = addSectionTitle(
      doc,
      "Skills",
      margin,
      y,
      contentWidth
    );

    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.setFontSize(9);

    doc.setTextColor(
      60,
      60,
      60
    );

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

  if (
    profile?.experience?.length
  ) {
    y = ensureSpace(
      doc,
      y,
      30,
      margin
    );

    y = addSectionTitle(
      doc,
      "Experience",
      margin,
      y,
      contentWidth
    );

    profile.experience.forEach(
      (experience) => {
        y = ensureSpace(
          doc,
          y,
          30,
          margin
        );

        // Position

        doc.setFont(
          "helvetica",
          "bold"
        );

        doc.setFontSize(10);

        doc.setTextColor(
          30,
          30,
          30
        );

        doc.text(
          experience.position ||
            "Position",
          margin,
          y
        );

        y += 4.5;

        // Company

        doc.setFont(
          "helvetica",
          "normal"
        );

        doc.setFontSize(9);

        const company = [
          experience.company,
          experience.location,
        ]
          .filter(Boolean)
          .join("  •  ");

        if (company) {
          doc.text(
            company,
            margin,
            y
          );
        }

        // Date

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
          doc.setFontSize(8);

          doc.setTextColor(
            110,
            110,
            110
          );

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

        // Description

        if (
          experience.description
        ) {
          doc.setFont(
            "helvetica",
            "normal"
          );

          doc.setFontSize(8.5);

          doc.setTextColor(
            70,
            70,
            70
          );

          y = addWrappedText(
            doc,
            experience.description,
            margin,
            y,
            contentWidth,
            4.2
          );

          y += 5;
        }
      }
    );
  }

  // ====================================
  // Education
  // ====================================

  if (
    profile?.education?.length
  ) {
    y = ensureSpace(
      doc,
      y,
      30,
      margin
    );

    y = addSectionTitle(
      doc,
      "Education",
      margin,
      y,
      contentWidth
    );

    profile.education.forEach(
      (education) => {
        y = ensureSpace(
          doc,
          y,
          25,
          margin
        );

        doc.setFont(
          "helvetica",
          "bold"
        );

        doc.setFontSize(10);

        doc.setTextColor(
          30,
          30,
          30
        );

        doc.text(
          education.degree ||
            "Degree",
          margin,
          y
        );

        y += 4.5;

        doc.setFont(
          "helvetica",
          "normal"
        );

        doc.setFontSize(9);

        const educationDetails = [
          education.institution,
          education.fieldOfStudy,
        ]
          .filter(Boolean)
          .join("  •  ");

        if (
          educationDetails
        ) {
          doc.text(
            educationDetails,
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
          doc.setFontSize(8);

          doc.setTextColor(
            110,
            110,
            110
          );

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
  }

  // ====================================
  // Projects
  // ====================================

  if (projects.length) {
    y = ensureSpace(
      doc,
      y,
      30,
      margin
    );

    y = addSectionTitle(
      doc,
      "Projects",
      margin,
      y,
      contentWidth
    );

    projects.forEach(
      (project) => {
        y = ensureSpace(
          doc,
          y,
          30,
          margin
        );

        doc.setFont(
          "helvetica",
          "bold"
        );

        doc.setFontSize(10);

        doc.setTextColor(
          30,
          30,
          30
        );

        doc.text(
          project.title ||
            "Project",
          margin,
          y
        );

        y += 4.5;

        if (
          project.techStack?.length
        ) {
          doc.setFont(
            "helvetica",
            "italic"
          );

          doc.setFontSize(8);

          doc.setTextColor(
            90,
            90,
            90
          );

          doc.text(
            project.techStack.join(
              "  •  "
            ),
            margin,
            y
          );

          y += 4.5;
        }

        if (
          project.description
        ) {
          doc.setFont(
            "helvetica",
            "normal"
          );

          doc.setFontSize(8.5);

          doc.setTextColor(
            70,
            70,
            70
          );

          y = addWrappedText(
            doc,
            project.description,
            margin,
            y,
            contentWidth,
            4.2
          );

          y += 5;
        }
      }
    );
  }

  // ====================================
  // Certificates
  // ====================================

  if (
    profile?.certificates?.length
  ) {
    y = ensureSpace(
      doc,
      y,
      25,
      margin
    );

    y = addSectionTitle(
      doc,
      "Certifications",
      margin,
      y,
      contentWidth
    );

    profile.certificates.forEach(
      (certificate) => {
        y = ensureSpace(
          doc,
          y,
          18,
          margin
        );

        doc.setFont(
          "helvetica",
          "bold"
        );

        doc.setFontSize(9);

        doc.setTextColor(
          40,
          40,
          40
        );

        doc.text(
          certificate.title ||
            "Certification",
          margin,
          y
        );

        y += 4;

        const details = [
          certificate.issuer,
          formatDate(
            certificate.issueDate
          ),
        ]
          .filter(Boolean)
          .join("  •  ");

        if (details) {
          doc.setFont(
            "helvetica",
            "normal"
          );

          doc.setFontSize(8);

          doc.setTextColor(
            100,
            100,
            100
          );

          doc.text(
            details,
            margin,
            y
          );

          y += 5;
        }
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
      130,
      130,
      130
    );

    doc.text(
      "DevPulse",
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

  // ====================================
  // Download
  // ====================================

  doc.save(
    `${
      profile?.username ||
      "resume"
    }-minimal.pdf`
  );
}