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
var casualFormal_exports = {};
__export(casualFormal_exports, {
  default: () => casualFormal_default
});
module.exports = __toCommonJS(casualFormal_exports);
var import_express = __toESM(require("express"));
var import_descriptionElements_svc = __toESM(require("../services/descriptionElements-svc"));
const router = import_express.default.Router();
router.get("/", (req, res) => {
  const classType = req.query.class;
  import_descriptionElements_svc.default.index({ "class": classType }).then((list) => res.json(list)).catch((err) => res.status(500).send(err));
});
router.get("/:item", (req, res) => {
  const { item } = req.params;
  import_descriptionElements_svc.default.get(item).then((descriptionelement) => res.json(descriptionelement)).catch((err) => res.status(404).send(err));
});
router.post("/", (req, res) => {
  const newDescriptionElement = req.body;
  import_descriptionElements_svc.default.create(newDescriptionElement).then(
    (descriptionelement) => res.status(201).json(descriptionelement)
  ).catch((err) => res.status(500).send(err));
});
router.put("/:item", (req, res) => {
  const { item } = req.params;
  const newDescriptionElement = req.body;
  import_descriptionElements_svc.default.update(item, newDescriptionElement).then((descriptionelement) => res.json(descriptionelement)).catch((err) => res.status(404).end());
});
router.delete("/:item", (req, res) => {
  const { item } = req.params;
  import_descriptionElements_svc.default.remove(item).then(() => res.status(204).end()).catch((err) => res.status(404).send(err));
});
var casualFormal_default = router;
