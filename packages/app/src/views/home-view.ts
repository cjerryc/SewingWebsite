import { Auth, Observer } from "@calpoly/mustang";
import { html, LitElement } from "lit";
import { state } from "lit/decorators.js";
import { descriptionElement } from "server/models";

export class HomeViewElement extends LitElement {
    src = "/api/casualFormal";
    
    // Display a list of clothing items, using descriptionElement custom elements.
    @state()
    clothingIndex = new Array<descriptionElement>();
    clothingIndexToDisplay = new Array<descriptionElement>();

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
          this.hydrate(this.src);
        });
      }
  
    render() {
        for (let i=0; i < this.clothingIndex.length; i+=5){
            this.clothingIndexToDisplay.push(this.clothingIndex[i]);
        }
        // this.clothingIndexToDisplay
        const clothingList = this.clothingIndexToDisplay.map(this.renderItem);
         
      return html`

    <p class="page">
        <header>
          <h2>A Peak at your Clothing items</h2>
        </header>
        <dl>${clothingList}</dl>
      </p>
      `;
    }

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
        // const { _id } = t as unknown as { _id: string };

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