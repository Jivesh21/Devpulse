// ====================================
// Resume Rich Text Cleaner
// ====================================

export function cleanRichText(value) {
  if (!value) {
    return "";
  }

  const html = String(value);

  // ====================================
  // Convert common HTML structures
  // ====================================

  let text = html
    // Line breaks
    .replace(/<br\s*\/?>/gi, "\n")

    // Closing paragraphs / divs
    .replace(/<\/p>/gi, "\n")
    .replace(/<\/div>/gi, "\n")

    // List items
    .replace(/<li[^>]*>/gi, "• ")
    .replace(/<\/li>/gi, "\n")

    // Ordered list items
    .replace(
      /<ol[^>]*>/gi,
      ""
    )
    .replace(
      /<\/ol>/gi,
      "\n"
    )

    // Unordered lists
    .replace(
      /<ul[^>]*>/gi,
      ""
    )
    .replace(
      /<\/ul>/gi,
      "\n"
    );

  // ====================================
  // Remove remaining HTML tags
  // ====================================

  text = text.replace(
    /<[^>]+>/g,
    ""
  );

  // ====================================
  // Decode common HTML entities
  // ====================================

  text = text
    .replace(
      /&nbsp;/gi,
      " "
    )
    .replace(
      /&amp;/gi,
      "&"
    )
    .replace(
      /&lt;/gi,
      "<"
    )
    .replace(
      /&gt;/gi,
      ">"
    )
    .replace(
      /&quot;/gi,
      '"'
    )
    .replace(
      /&#39;/gi,
      "'"
    );

  // ====================================
  // Clean whitespace
  // ====================================

  text = text
    .replace(
      /\r\n/g,
      "\n"
    )
    .replace(
      /\r/g,
      "\n"
    )
    .replace(
      /[ \t]+\n/g,
      "\n"
    )
    .replace(
      /\n[ \t]+/g,
      "\n"
    )
    .replace(
      /\n{3,}/g,
      "\n\n"
    )
    .trim();

  return text;
}