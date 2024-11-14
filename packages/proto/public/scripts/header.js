import {
    css,
    define,
    html,
    shadow,
    Dropdown,
    Events,
    Observer
  } from "@calpoly/mustang";
  import reset from "./styles/reset.css.js";
//   import headings from "./styles/headings.css.js";
  
  export class HeaderElement extends HTMLElement {
    static uses = define({
      "mu-dropdown": Dropdown.Element
    });
  
    static template = html`<template>

          <mu-dropdown>
            <a slot="actuator">
              Hello,
              <span id="userid"></span>
            </a>

            <menu>
              <li class="when-signed-in">
                <a id="signout">Sign Out</a>
              </li>
              <li class="when-signed-out">
                <a href="/login">Sign In</a>
              </li>
            </menu>

          </mu-dropdown>

    </template>`;
  
    static styles = css`
    :host {
      display: contents;
    }
    header {
      display: flex;
      flex-wrap: wrap;
      align-items: bottom;
      justify-content: space-between;
      padding: var(--size-spacing-medium);
      background-color: var(--color-background-header);
      color: var(--color-text-inverted);
    }
    header ~ * {
      margin: var(--size-spacing-medium);
    }
    header p {
      --color-link: var(--color-link-inverted);
    }
    nav {
      display: flex;
      flex-direction: column;
      flex-basis: max-content;
      align-items: end;
    }
    a[slot="actuator"] {
      color: var(--color-link-inverted);
      cursor: pointer;
    }
    #userid:empty::before {
      content: "Sewist";
    }
    menu a {
      color: var(--color-link);
      cursor: pointer;
      text-decoration: underline;
    }
    a:has(#userid:empty) ~ menu > .when-signed-in,
    a:has(#userid:not(:empty)) ~ menu > .when-signed-out {
      display: none;
    }
    `;
  
    get userid() {
      return this._userid.textContent;
    }
  
    set userid(id) {
        if (id === "anonymous") {
          this._userid.textContent = "";
          this._signout.disabled = true;
        } else {
          this._userid.textContent = id;
          this._signout.disabled = false;
        }
      }
  
    constructor() {
      super();
      shadow(this)
        .template(HeaderElement.template)
        .styles(
          reset.styles,
          HeaderElement.styles
        );
        this._userid = this.shadowRoot.querySelector("#userid");
        this._signout = this.shadowRoot.querySelector("#signout");
  
        this._signout.addEventListener("click", (event) =>
        Events.relay(event, "auth:message", ["auth/signout"])
      );
    }
  
    _authObserver = new Observer(this, "sewing:auth");
  
    connectedCallback() {
      this._authObserver.observe(({ user }) => {
        if (user && user.username !== this.userid) {
            console.log("User is: ", user.username)
            this.userid = user.username;
        }
      });
    }
  }