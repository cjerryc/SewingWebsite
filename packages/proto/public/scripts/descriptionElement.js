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
    background: linear-gradient(217deg, rgba(163,128,218,.8), rgba(132,214,229,0) 70.71%),
    linear-gradient(127deg, rgba(137,240,218,.8), rgba(244,169,218,0) 70.71%),
    linear-gradient(336deg, rgba(238,122,145,.8), rgba(238,145,122,0) 70.71%);
    padding: var(--size-spacing-medium);

    border-radius: 5px;
    box-shadow: 5px 10px 18px #888888;
  }
  h3{
    padding: var(--size-spacing-medium);
    font-family: var(--font-family-display);
    line-height: var(--font-line-height-display);
    color: var(--color-text);
    // background-color: var(--header_background-color);
    // border: var(--header-border);
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