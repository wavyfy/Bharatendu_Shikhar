import sanitizeHtml from "sanitize-html";

export function sanitize(dirtyHtml: string): string {
  if (!dirtyHtml) return "";
  return sanitizeHtml(dirtyHtml, {
    allowedTags: [
      "b", "i", "em", "strong", "a", "p", "h1", "h2", "h3", "h4", "h5", "h6",
      "ul", "ol", "li", "blockquote", "code", "pre", "span", "div", "br", "hr",
      "table", "thead", "tbody", "tr", "th", "td", "img", "iframe", "video", "source"
    ],
    allowedAttributes: {
      "*": ["class", "id", "style"],
      "a": ["href", "name", "target", "rel"],
      "img": ["src", "alt", "width", "height"],
      "iframe": ["src", "allowfullscreen", "allow", "frameborder", "width", "height"],
      "video": ["src", "controls", "poster", "width", "height"],
      "source": ["src", "type"]
    },
    transformTags: {
      'a': sanitizeHtml.simpleTransform('a', { target: '_blank' })
    }
  });
}
