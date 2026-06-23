import DOMPurify from "isomorphic-dompurify";

export function sanitize(dirtyHtml: string): string {
  if (!dirtyHtml) return "";
  return DOMPurify.sanitize(dirtyHtml, {
    ALLOWED_TAGS: [
      "b", "i", "em", "strong", "a", "p", "h1", "h2", "h3", "h4", "h5", "h6",
      "ul", "ol", "li", "blockquote", "code", "pre", "span", "div", "br", "hr",
      "table", "thead", "tbody", "tr", "th", "td", "img", "iframe", "video", "source"
    ],
    ALLOWED_ATTR: [
      "href", "name", "target", "rel", "src", "alt", "width", "height",
      "allowfullscreen", "allow", "frameborder", "controls", "poster", "type",
      "class", "id", "style"
    ],
    ADD_ATTR: ["target"], // For Links
  }) as string;
}
