import { css, html, shadow } from "@calpoly/mustang";

export class descriptionElement extends HTMLElement {
  static template = html`
    <template>
      <section>
        <h3><slot name="item">item name</slot></h3>
        <slot name="description"> item description </slot>
        <slot name="info"> information </slot>
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
    //   .styles(reset.styles, descriptionElement.styles);
    .styles(descriptionElement.styles);
  }
}