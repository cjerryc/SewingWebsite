import { Auth, Observer, define } from "@calpoly/mustang";
import { css, html, LitElement } from "lit";
import { property, state } from "lit/decorators.js";
import { descriptionElements as Element } from "../components/descriptionElement";
import { descriptionElement } from "server/models";

export class casualFormalViewElement extends LitElement {
    src = "/api/casualFormal";

    static uses = define({
        "description-elem": Element
      });

    // @property({ type: Boolean })
    // edit = false;
    @property()
    kind="";
    
    @state()
    clothingIndex = new Array<descriptionElement>();

    _authObserver = new Observer<Auth.Model>(
        this,
        "sewing:auth"
      );

    _user = new Auth.User();

    connectedCallback() {
        super.connectedCallback();
        this._authObserver.observe(({ user }) => {
          if (user) {
            this._user = user;
          }
          console.log("kind in view.ts: ", this.kind);
          this.hydrate(`/api/casualFormal?class=${this.kind}`);
        });
      }
    
    hydrate(url: string) {
        fetch(url, {
          headers: Auth.headers(this._user)
        })
          .then((res: Response) => {
            if (res.status === 200) 
                console.log(res.body);
                return res.json();
            throw `Server responded with status ${res.status}`;
          })
          .catch((err) =>
            console.log("Failed to load clothing data:", err)
          )
          .then((json: unknown) => {
            if (json) {
                const data  = json as Array<descriptionElement>;
                this.clothingIndex = data;
            }
          })
          .catch((err) =>
            console.log("Failed to convert descriptionElement data:", err)
          );
      }

    renderItem(t: descriptionElement) {

        return html`
        <description-elem
          .using=${t}></description-elem>
        `;
    }
  
    render() {
        const clothingList = this.clothingIndex.map(this.renderItem);
        // <description-elem
        // href="/app/casualFormal/${this.item}"
        // .using=${Element}></description-elem>
      return html`
        <header>
            <a href="/app">&larr; Sewing a Garment</a>
        </header>
        <header class="header">
            <svg class="icon">
                <use href="/icons/${this.kind}.svg#icon-${this.kind}" />
            </svg>
            <h2>${this.kind}</h2>
            <svg class="icon">
                <use href="/icons/${this.kind}.svg#icon-${this.kind}" />
            </svg>
        </header>


        <article>
        <section class="${this.kind}"> 
            ${clothingList}
        </section>
        </article>

        <footer class="footer">
        <!-- Dark Mode Checkbox -->
        <label>
            <input type="checkbox" autocomplete="off" id="darkModeToggle"/>
            Dark mode
        </label>
        </footer>
   
        `}

        static styles = css`
        header {
        /* header background color and text color */
        background: var(--top-header-gradient);
        padding: var(--size-spacing-medium);
        font-family: var(--font-family-display);
        line-height: var(--font-line-height-display);
        color: var(--color-text);
        border-width: 5px;
        border-style: solid;
        border-image: var(--border-header-gradient);
        border-radius: 8px;

        text-align: var(--header-text-align);   

        grid-column-start: var(--grid-column-start);
        grid-column-end: var(--grid-column-end);
        grid-row-start: var(--grid-row-start-h1);
        grid-row-end: var(--grid-row-end-h1);
        }
        .header {
        border-radius: 5px;
        border-style: solid;
        background: var(--header-gradient);

        /* flex */
        display: var(--header-display);
        align-items: var(--header-align-items);
        justify-content: var(--header-justify-content); 
        font-family: var(--font-family-display);
        text-align: var(--header-text-align);   

        /* grid-template-columns: 1fr 1fr 1fr 1fr 1fr; */
        grid-column-start: var(--grid-column-start);
        grid-column-end: var(--grid-column-end);
        grid-row-start: var(--grid-row-start-h2);
        grid-row-end: var(--grid-row-end-h2);

        /* unvisited link */
        a:link {
            color: var(--body-link-unvisited);
        }
        /* visited link */
            a:visited {
            color: var(--body-link-visited);
        }
    
        /* mouse over link */
            a:hover {
            color: var(--body-link-hover);
        }
        }
        .header3 {
        /* grid-template-columns: 1fr 1fr 1fr 1fr 1fr; */
        grid-column-start: var(--grid-column-start);
        grid-column-end: var(--grid-column-end);
        grid-row-start: var(--grid-row-start-h3);
        grid-row-end: var(--grid-row-end-h3);
        background: var(--body-gradient);
        }
        body {
        /* colors */
        font-family: var(--font-family-body);
        color: var(--color-text);
        background: var(--body-gradient);
        
        padding: var(--size-spacing-medium);
        display: var(--container-display);
        align-items: var(--container-align-items); 
        grid-template-columns: var(--container-template-columns);
        grid-column-gap: var(--container-grid-column-gap);
        grid-row-gap: var(--container-grid-row-gap);
        color: var(--color-text);
        }
        body.dark-mode header{
        color: var(--color-text);
        background: var(--header-gradient);
        background-color: var(--background-color);
        --color-text-control: rgb(51 51 51);
        border-radius: 5px;
        border-style: solid;
        }
        body.dark-mode {
        color: var(--color-text);
        background-color: var(--background-color);
        background: var(--body-gradient);
        a:link {
            color: var(--body-link-unvisited);
        }
        /* visited link */
            a:visited {
            color: var( --body-link-visited);
        }
    
        /* mouse over link */
            a:hover {
            color: var(--body-link-hover);
        }
        }
        .footer {
        position: fixed;
        text-align: center ;
        bottom: 0;
        }
        svg.icon {
        /* text-align: var(--header-text-align);    */
        display: var(--svg-display);
        height: var(--svg-square-length);
        width: var(--svg-square-length);
        vertical-align: var(--svg-align);
        fill: var(--svg-fill);
        }

        svg.logo {
        /* text-align: var(--header-text-align);    */
        display: var(--svg-display-block);
        height: var(--svg-square-length);
        width: var(--svg-square-length);
        vertical-align: var(--svg-align);
        fill: var(--svg-fill);
        margin: auto;
        }

        .ulnobullets{
        list-style-type: var(--ulnobullets-listStyle);
        padding: var(--ulnobullets-padding);
        margin: var(--ulnobullets-margin);
        }
    `
  }