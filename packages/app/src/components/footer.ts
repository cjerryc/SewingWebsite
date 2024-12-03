import {
    // Auth,
    // define,
    // Dropdown,
    Events
    // Observer
  } from "@calpoly/mustang";
import { LitElement, css, html } from "lit";

function toggleDarkMode(ev: InputEvent) {
    const target = ev.target as HTMLInputElement;
    const checked = target.checked;
  
    Events.relay(ev, "dark-mode", { checked });
  }

export class FooterElement extends LitElement {

  render() {
    return html`

    <footer class="footer"> 
    <label @change=${toggleDarkMode}>
    <input type="checkbox" autocomplete="off" />
    Dark mode
    </label>
     </footer>
    `;
  }

  static styles = [
    css`
    :host{
    display: contents;
    }
    .footer {
    position: fixed;
    text-align: center;
    bottom: 0;
  }
  `];

  static initializeOnce() {
    function toggleDarkMode(
      page: HTMLElement,
      checked: boolean
    ) {
      page.classList.toggle("dark-mode", checked);
    }

    document.body.addEventListener("dark-mode", (event) =>
      toggleDarkMode(
        event.currentTarget as HTMLElement,
        (event as CustomEvent).detail?.checked
      )
    );
  }
}