import { css, html, shadow } from "@calpoly/mustang";

export class descriptionElement extends HTMLElement {
  get src() {
    return this.getAttribute("src");
  }
  
  connectedCallback() {
    if (this.src) this.hydrate(this.src);
  }

  hydrate(url) {
    fetch(url)
      .then((res) => {
        if (res.status !== 200) throw `Status: ${res.status}`;
        return res.json();
      })
      .then((json) => this.renderSlots(json))
      .catch((error) =>
        console.log(`Failed to render data ${url}:`, error)
      );
  }
  
  renderSlots(json) {
    const entries = Object.entries(json);
    const toSlot = ([key, value]) =>{
      switch (typeof value) {
        case "object":
        if (Array.isArray(value))
          return html`<ul slot="${key}">
          ${value.map((s) => html`<li>${s}</li>`)}
          </ul>`;
        default:
          return html`<span slot="${key}">${value}</span>`;
        }
    }
  
    const fragment = entries.map(toSlot);
    this.replaceChildren(...fragment);
  }

  static template = html`
    <template>
      <section>
        <h3><slot name="item">item name</slot></h3>
        <slot name="description"> item description </slot>
        <ul>
        <slot name="info"> information </slot>
        </ul>
        </section>
  </template>
  `;

  static styles = css`section {
    font-family: var(--font-family-body);
    color: var(--color-text);
    background-color: var(--body-background-color);
    background: var(--panel-gradient);
    padding: var(--size-spacing-medium);

    border-radius: 5px;
    box-shadow: 5px 10px 18px #888888;
  }
  h3{
    padding: var(--size-spacing-medium);
    font-family: var(--font-family-display);
    line-height: var(--font-line-height-display);
    color: var(--color-text);
    text-align: var(--header-text-align);
  }`;

  constructor() {
    super();
    shadow(this)
      .template(descriptionElement.template)
    .styles(descriptionElement.styles);
  }
}