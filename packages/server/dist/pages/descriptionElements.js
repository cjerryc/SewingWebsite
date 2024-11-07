"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var descriptionElements_exports = {};
__export(descriptionElements_exports, {
  descriptionElementPage: () => descriptionElementPage
});
module.exports = __toCommonJS(descriptionElements_exports);
var import_server = require("@calpoly/mustang/server");
var import_renderPage = __toESM(require("./renderPage"));
class descriptionElementPage {
  data;
  constructor(data) {
    this.data = data;
  }
  render() {
    return (0, import_renderPage.default)({
      body: this.renderBody(),
      // add more parts here later
      stylesheets: ["/styles/destination.css"],
      styles: [
        import_server.css`main.page {
            --page-grids: 8;
            @media screen and (max-width: 48rem) {
              --page-grids: 6;
          }
        }`
      ],
      scripts: [
        `import { define } from "@calpoly/mustang";
        import { DescriptionElement } from "/scripts/descriptionElement.js";

        define({
          "descriptionElements": DescriptionElement
        });`
      ]
    });
  }
  renderBody() {
    const {
      item,
      description,
      info
    } = this.data;
    return import_server.html` 
    <description-elem>
          <span slot="item">${item}</span>
          <p slot="description">
            ${description}</p>
              ${info.map((a) => import_server.html`<p slot="info">${a}</p>`)}
        </description-elem>`;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  descriptionElementPage
});
