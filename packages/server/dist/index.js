"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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
var import_express = __toESM(require("express"));
var import_descriptionElements = require("./pages/descriptionElements");
var import_descriptionElements_svc = __toESM(require("./services/descriptionElements-svc"));
var import_mongo = require("./services/mongo");
var import_casualFormal = __toESM(require("./routes/casualFormal"));
var import_auth = __toESM(require("./routes/auth"));
var import_auth2 = require("./pages/auth");
var import_auth3 = require("./pages/auth");
(0, import_mongo.connect)("sewing");
const app = (0, import_express.default)();
const port = process.env.PORT || 3e3;
const staticDir = process.env.STATIC || "public";
app.use(import_express.default.static(staticDir));
app.use(import_express.default.json());
app.use("/api/casualFormal", import_auth.authenticateUser, import_casualFormal.default);
app.use("/auth", import_auth.default);
app.get("/hello", (req, res) => {
  res.send("Hello, World");
});
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
app.get(
  "/casualFormal/:clothingId",
  (req, res) => {
    const { clothingId } = req.params;
    import_descriptionElements_svc.default.get(clothingId).then((data) => {
      const page = new import_descriptionElements.descriptionElementPage(data);
      res.set("Content-Type", "text/html").send(page.render());
    });
  }
);
app.get("/login", (req, res) => {
  const page = new import_auth2.LoginPage();
  res.set("Content-Type", "text/html").send(page.render());
});
app.get("/register", (req, res) => {
  const page = new import_auth3.RegistrationPage();
  res.set("Content-Type", "text/html").send(page.render());
});
