import { Auth, Observer } from "@calpoly/mustang";
import { css, html, LitElement } from "lit";
import { property, state } from "lit/decorators.js";
import { descriptionElement } from "server/models";

export class HomeViewElement extends LitElement {
    src = "/api/casualFormal/coats";
    
    // Display a list of clothing items, using descriptionElement custom elements.
    @state()
    clothingIndex = new Array<descriptionElement>();
    clothingIndexToDisplay = new Array<descriptionElement>();

    @property()
    kind="coats";

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
          this.hydrate(`/api/casualFormal?class=${this.kind}`);
        });
      }
  
    render() {
        for (let i=0; i < this.clothingIndex.length; i++){
            this.clothingIndexToDisplay.push(this.clothingIndex[i]);
        }
        // this.clothingIndexToDisplay
        const clothingList = this.clothingIndexToDisplay.map(this.renderItem);
         
      return html`
      <header>
        <h1>Sewing Garments</h1>
        <p>Making a Piece From Start to Finish</p>
    
        <svg class="logo">
            <use href="/icons/sewingMachine.svg#icon-sewingMachine" />
        </svg>

        <sewing-header></sewing-header>
        </header>


        <header class="header">
        <section>
            <h2>Type of Garments</h2>
            <ul class="ulnobullets">
            <li><a href="app/casualFormal/coats">Coats</a></li>
            <li><a href="app/casualFormal/jackets">Jackets</a></li>
            <li><a href="app/casualFormal/tops">Tops</a></li>
            <li><a href="app/casualFormal/bottoms">Bottoms</a></li>
            </ul>
        </section>
        
        <section>
            <h2>Seasonal Pieces</h2> 
            <ul class="ulnobullets">
            <li><a href="../seasonal/fall.html">Fall</a></li>
            <li><a href="seasonal/winter.html">Winter</a></li>
            <li><a href="seasonal/spring.html">Spring</a></li>
            <li><a href="seasonal/summer.html">Summer</a></li>
            </ul>
        </section>
        
        <section>
            <h2>Fabrics</h2>
            <ul class="ulnobullets">
                <li><a href="fabrics/light.html">Lightweight</a></li>
                <li><a href="fabrics/heavy.html">Heavyweight</a></li>
                <li><a href="fabrics/sheen.html">Sheen</a></li>
            </ul>
            </section>
        
        <section>
            <h2>Notions and Embellishments</h2>
            <ul class="ulnobullets">
                <li><a href="notions/buttons.html">Buttons</a></li>
                <li><a href="notions/zippers.html">Zippers</a></li>
                <li><a href="notions/piping.html">Piping</a></li>
            </ul>
            </section>
        
            <section>
            <h2>Tools for the Job</h2>
            <ul class="ulnobullets">
                <li><a href="tools/needles.html">Needle Weights</a></li>
                <li><a href="tools/iron.html">Ironing and Pressing</a></li>
                <li><a href="tools/patterns.html">Patterns</a></li>
            </ul>
            </section>
        </header>

        <img src="./public/images/landingImage2.jpg" alt="Fabric and Thread">
        <p>An informal almanac on sewing garments: from the bolt to the hanger.</p>
        <img src="./public/images/thread.jpg" alt="Spools of Thread">
        <sewing-footer></sewing-footer>

        <header class="header3">
            <header class="header3">
            <h2>A Peak at your Clothing items</h2>
            </header>
            <dl>${clothingList}</dl>
        </header>
        `}

        static styles = css`
        header {
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

        display: var(--header-display);
        align-items: var(--header-align-items);
        justify-content: var(--header-justify-content); 
        font-family: var(--font-family-display);
        text-align: var(--header-text-align);   

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
        display: var(--container-display);
        align-items: var(--container-align-items); 
        grid-template-columns: var(--container-template-columns);
        grid-column-gap: var(--container-grid-column-gap);
        grid-row-gap: var(--container-grid-row-gap);
        padding: var(--size-spacing-medium);
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
        display: var(--svg-display);
        height: var(--svg-square-length);
        width: var(--svg-square-length);
        vertical-align: var(--svg-align);
        fill: var(--svg-fill);
        }

        svg.logo {
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

    hydrate(url: string) {
        fetch(url, {
          headers: Auth.headers(this._user)
        })
          .then((res: Response) => {
            if (res.status === 200) return res.json();
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
        const { item, description, info } = t;

        return html`
            <dt>
               <h3> ${item} </h3>
            </dt>
            <!-- <dt>A bit about <b>${item}</b>: -->
                <p>${description}</p>
            </dt>
            <!-- <dt>Some good things to know:
                <p>${info}</p>
            </dt> -->
            `;
    }
  }