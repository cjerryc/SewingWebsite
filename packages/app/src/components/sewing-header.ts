import {
    // Auth,
    define,
    // shadow,
    Dropdown
    // Events,
    // Observer
  } from "@calpoly/mustang";
// import reset from "../../public/styles/reset.css.js";
import { LitElement, css, html } from "lit";

export class SewingHeaderElement extends LitElement {
    static uses = define({
        "mu-dropdown": Dropdown.Element
    });

  render() {
    return html`

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
    `;
  }

  static styles = [
    css`
    :host {
      display: contents;
    }
    header {
      display: flex;
      flex-wrap: wrap;
      align-items: bottom;
      justify-content: space-between;
      padding: var(--size-spacing-medium);
      background-color: var(--header-gradient);
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
      list-style-type: none;
      color: var(--color-link);
      cursor: pointer;
      text-decoration: underline;
    }
    a:has(#userid:empty) ~ menu > .when-signed-in,
    a:has(#userid:not(:empty)) ~ menu > .when-signed-out {
      display: none;
    }
  `];

//   get userid() {
//     return this._userid.textContent;
//   }

//   set userid(id) {
//       if (id === "anonymous") {
//         this._userid.textContent = "";
//         this._signout.disabled = true;
//       } else {
//         this._userid.textContent = id;
//         this._signout.disabled = false;
//       }
//     }

//   constructor() {
//     super();
//     shadow(this)
//       .template(SewingHeaderElement.template)
//       .styles(
//         // reset.styles,
//         SewingHeaderElement.styles
//       );
//       this._userid = this.querySelector("#userid");
//       this._signout = this.querySelector("#signout");

//       this._signout.addEventListener("click", (event) =>
//       Events.relay(event, "auth:message", ["auth/signout"])
//     );
//   }

//     _authObserver = new Observer<Auth.Model>(
//         this,
//         "sewing:auth"
//     );

//     _user = new Auth.User();

//   connectedCallback() {
//     this._authObserver.observe(({ user }) => {
//       if (user && user.username !== this.userid) {
//           console.log("User is: ", user.username)
//           this.userid = user.username;
//       }
//     });
//   }
}