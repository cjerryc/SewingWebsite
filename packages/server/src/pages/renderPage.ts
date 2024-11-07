import {
    PageParts,
    renderWithDefaults
  } from "@calpoly/mustang/server";
  
  const defaults = {
    stylesheets: [
      "/styles/reset.css",
      "/styles/tokens.css",
      "/styles/page.css"
    ],
    styles: [],
    scripts: [
      `import { define } from "@calpoly/mustang";
      import { HeaderElement } from "/scripts/header.js";
  
      define({
        "header": HeaderElement
      });
  
      HeaderElement.initializeOnce();
      `
    ],
    googleFontURL:
      "https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&family=Prata&display=swap",
    imports: {
      "@calpoly/mustang": "https://unpkg.com/@calpoly/mustang"
    }
  };
  
  export default function renderPage(page: PageParts) {
    return renderWithDefaults(page, defaults);
  }