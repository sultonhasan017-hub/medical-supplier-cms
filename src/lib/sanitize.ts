import sanitizeHtmlLib from 'sanitize-html';

/**
 * Sanitize plain text input — strips ALL HTML tags and trims whitespace.
 * Use this for every text field that should NOT contain any HTML markup
 * (e.g. product name, description, alt text, article title, contact form fields).
 */
export function sanitizeText(input: string | null | undefined): string {
  if (!input) return '';
  return sanitizeHtmlLib(input, { allowedTags: [], allowedAttributes: {} }).trim();
}

/**
 * Sanitize rich HTML content produced by a Rich Text Editor.
 * Allows a controlled whitelist of safe tags and attributes,
 * and blocks all script-related, iframe, and event handler attributes.
 * Use this ONLY for blog article content.
 */
export function sanitizeRichHtml(input: string | null | undefined): string {
  if (!input) return '';
  return sanitizeHtmlLib(input, {
    allowedTags: sanitizeHtmlLib.defaults.allowedTags.concat([
      'img', 'h1', 'h2', 'h3', 'h4', 'span', 'u', 's', 'pre', 'code',
    ]),
    allowedAttributes: {
      ...sanitizeHtmlLib.defaults.allowedAttributes,
      '*': ['class'],
      'img': ['src', 'alt', 'width', 'height', 'class'],
    },
    // Block all script-like protocols
    allowedSchemes: ['http', 'https', 'mailto'],
    disallowedTagsMode: 'discard',
  }).trim();
}
