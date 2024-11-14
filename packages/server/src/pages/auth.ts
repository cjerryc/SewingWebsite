import { css, html } from "@calpoly/mustang/server";
import renderPage from "./renderPage"; // generic page renderer

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
        styles: [
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
        ],
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