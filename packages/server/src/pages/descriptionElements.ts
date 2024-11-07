import { css, html } from "@calpoly/mustang/server";
import { descriptionElement /*, etc... */ } from "../models";
import renderPage from "./renderPage"; // generic page renderer

export class descriptionElementPage {
  data: descriptionElement;

  constructor(data: descriptionElement) {
    this.data = data;
  }

  render() {
    return renderPage({
      body: this.renderBody(),
      // add more parts here later
      stylesheets: ["/styles/destination.css"],
      styles: [
        css`main.page {
            --page-grids: 8;
            @media screen and (max-width: 48rem) {
              --page-grids: 6;
          }
        }`
      ],
      scripts: [
        `import { define } from "@calpoly/mustang";
        import { DescriptionElement } from "/scripts/descriptionElement.js";

        define({
          "descriptionElements": DescriptionElement
        });`
      ]

    });
  }

  renderBody() {
    const { item,
      description,
      info} = this.data;
    return html` 
    <description-elem>
          <span slot="item">${item}</span>
          <p slot="description">
            ${description}</p>
              ${info.map((a) => html`<p slot="info">${a}</p>`)}
        </description-elem>`;
  }
  }