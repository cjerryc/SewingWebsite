import { define, InputArray, css, html, Form, shadow, Observer } from "@calpoly/mustang";

export class descriptionElement extends HTMLElement {
  static uses = define({
    "mu-form": Form.Element,
    "input-array": InputArray.Element
  });

  get src() {
    return this.getAttribute("src");
  }

  get form() {
    return this.shadowRoot.querySelector("mu-form.edit");
  }

  hydrate(url) {
    fetch(url, { headers: this.authorization })
      .then((res) => {
        if (res.status !== 200) throw `Status: ${res.status}`;
        return res.json();
      })
      .then((json) => {
        this.renderSlots(json)
        this.form.init = json; // populate mu-form
      })
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
      <section class="view">
        <h3><slot name="item">item name</slot></h3>
        <slot name="description"> item description </slot>
        <ul>
        <slot name="info"> information </slot>
        </ul>
        <button id="edit">Edit</button>
        </section>

      <mu-form class="edit">
      <label>
        <span>Item Name</span>
        <input name="item" />
      </label>
      <label>
        <span>Description</span>
        <input name="description" />
      </label>
      <label>
        <span>Information</span>
        <input-array name="info">
          <span slot="label-add">Add</span>
        <input name="info" />
        <input-array>
      </label>
    </mu-form>
  </template>
  `;

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

  constructor() {
    super();
    shadow(this)
    .template(descriptionElement.template)
    .styles(descriptionElement.styles);

    this.editButton.addEventListener(
      "click",
      () => (this.mode = "edit")
    ); 

    this.addEventListener("mu-form:submit", (event) =>
      this.submit(this.src, event.detail)
    );   
  }

  submit(url, json) {
    const method = this.mode === "new" ? "POST" : "PUT";

    if (this._avatar) json.avatar = this._avatar;
      fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...this.authorization
        },
        body: JSON.stringify(json)
      })
      .then((res) => {
        if (res.status !== 200) throw `Status: ${res.status}`;
        return res.json();
      })
      .then((json) => {
        console.log("json here:", json);
        this.renderSlots(json);
        this.form.init = json;
        this.mode = "view"; //added to automatically close out of "edit" mode and return to "view" mode
      })
      .catch((error) =>
        console.log(`Failed to render data ${url}:`, error)
      );
  }

  get mode() {
    return this.getAttribute("mode");
  }

  set mode(m) {
    this.setAttribute("mode", m);
  }

  get editButton() {
    return this.shadowRoot.getElementById("edit");
  }

  _authObserver = new Observer(this, "sewing:auth");

  get authorization() {
    return (
      this._user?.authenticated && {
        Authorization: `Bearer ${this._user.token}`
      }
    );
  }

  connectedCallback() {
    this._authObserver.observe(({ user }) => {
      this._user = user;
      if (this.src) this.hydrate(this.src);
    });
  }
  
}