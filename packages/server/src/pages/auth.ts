import { css, html } from "@calpoly/mustang/server";
import renderPage from "./renderPage"; // generic page renderer

const styles = [
    css`
      article {
      height: 100vh;
      display: flex;
      flex-direction: column;
      }

      main.page {
      --page-grids: 8;
      grid-template-areas:
          "-- -- -- -- -- -- -- --"
          "-1 -1 fm fm fm fm -2 -2"
          "-1 -1 rq rq rq rq -2 -2";
      grid-template-rows: 1fr auto 1fr;
      flex-basis: 100%;
      }

      login-form,
      registration-form {
      grid-area: fm;
      }

      p.register,
      p.login {
      display: block;
      grid-area: rq;
      text-align: center;
      }
    `
  ];

export class LoginPage {
    render() {
      return renderPage({
        scripts: [
          `
          import { define, Auth } from "@calpoly/mustang";
          import { LoginForm } from "/scripts/login-form.js";
  
          define({
            "mu-auth": Auth.Provider,
            "login-form": LoginForm
          })
          `
        ],
        styles,
        body: html`
          <body>
            <mu-auth provides="sewing:auth">
              <article>
                <header></header>
                <main class="page">
                  <login-form api="/auth/login">
                    <h3 slot="title">Sign in and take a look at some Sewing tips!</h3>
                  </login-form>
                  <p class="register">
                    Or did you want to
                    <a href="./register">
                      register as a new user
                    </a>
                    ?
                  </p>
                </main>
              </article>
            </mu-auth>
          </body>
        `
      });
    }
  }

  export class RegistrationPage {
    render() {
      return renderPage({
        styles,
        scripts: [
          `
          import { define, Auth } from "@calpoly/mustang";
          import { RegistrationForm } from "/scripts/registration-form.js";
  
          define({
            "mu-auth": Auth.Provider,
            "registration-form": RegistrationForm
          })
          `
        ],
        body: html`<body>
          <mu-auth provides="sewing:auth">
            <article>
              <main class="page">
                <registration-form api="/auth/register">
                  <h3 slot="title"
                    >Sign up to add your own Clothing Elements!</h3
                  >
                </registration-form>
                <p class="login">
                  Already signed up? You can
                  <a href="./login">log in</a> instead.
                </p>
              </main>
            </article>
          </mu-auth>
        </body> `
      });
    }
  }