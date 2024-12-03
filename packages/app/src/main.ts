import { Auth, define } from "@calpoly/mustang";
import { html, LitElement } from "lit";
import { SewingHeaderElement } from "./components/sewing-header";
import { FooterElement } from "./components/footer";
import { HomeViewElement } from "./views/home-view";

class AppElement extends LitElement {
    static uses = define({
      "home-view": HomeViewElement
    });
  
    protected render() {
      return html`
        <home-view></home-view>
      `;
    }

    connectedCallback(): void {
        super.connectedCallback();
        FooterElement.initializeOnce();
      }
}

define({
    "mu-auth": Auth.Provider,
    "sewing-app": AppElement,
    "sewing-header": SewingHeaderElement
  });