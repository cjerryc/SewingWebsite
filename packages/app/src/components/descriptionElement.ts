import { define, InputArray, Form } from "@calpoly/mustang";
import { LitElement, css, html } from "lit";
import { property } from "lit/decorators.js";
import { descriptionElement } from "server/models";

export class descriptionElements extends LitElement {
    static uses = define({
        "mu-form": Form.Element,
        "input-array": InputArray.Element
    });

    @property({ attribute: false })
        using?: descriptionElement;

    get descriptionElement() {
        return this.using || ({} as descriptionElement);
        }
    
    @property()
    href?: string;

    render() {
        const {item, description, info} = this.using || {};
        return html`
    
      <section class="view">
        <h3>${item}</h3>
        ${description}
        <ul>
        ${info}
        </ul>
        </section>
  
  `; }

  static styles = css`
  :host {
  display: contents;
  }
  :host([mode="edit"]),
  :host([mode="new"]) {
    --display-view-none: none;
  }
  :host(:not([mode])),
  :host([mode="view"]) {
    --display-editor-none: none;
  }
  
  section.view {
    display: var(--display-view-none, grid);
  }

  mu-form.edit {
    display: var(--display-editor-none, grid);
  }

  section {
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


}