import { Auth, 
    History,
    Switch, 
    define } from "@calpoly/mustang";
import { html, LitElement } from "lit";
import { SewingHeaderElement } from "./components/sewing-header";
import { FooterElement } from "./components/footer";
import { HomeViewElement } from "./views/home-view";
//   ADD BACK IN !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
import { casualFormalViewElement } from "./views/casualFormal-view";

class AppElement extends LitElement {
    static uses = define({
      "home-view": HomeViewElement,
    //   ADD BACK IN !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      "casualformal-view": casualFormalViewElement
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

const routes = [
    {
        path: "/app/casualFormal/:kind",
        view: (params: Switch.Params) => html`
          <casualformal-view
          kind=${params.kind}
          ></casualformal-view>
        `
      },
    {
      path: "/app",
      view: () => html`
        <home-view></home-view>
      `
    },
    {
      path: "/",
      redirect: "/app"
    }
  ];

define({
    "mu-auth": Auth.Provider,
    "mu-history": History.Provider,
    "mu-switch": class AppSwitch extends Switch.Element {
        constructor() {
        super(routes, "sewing:history", "sewing:auth");
            }
        },
    "sewing-app": AppElement,
    "sewing-header": SewingHeaderElement
  });