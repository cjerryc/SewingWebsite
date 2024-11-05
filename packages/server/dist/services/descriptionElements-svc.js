"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var descriptionElements_svc_exports = {};
__export(descriptionElements_svc_exports, {
  default: () => descriptionElements_svc_default
});
module.exports = __toCommonJS(descriptionElements_svc_exports);
var import_mongoose = require("mongoose");
const decriptionElementSchema = new import_mongoose.Schema(
  {
    item: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    info: [String]
  },
  { collection: "decriptionElements" }
);
const descriptionElementModel = (0, import_mongoose.model)("Profile", decriptionElementSchema);
function index() {
  return descriptionElementModel.find();
}
function get(item) {
  return descriptionElementModel.find({ item }).then((list) => list[0]).catch((err) => {
    throw `${item} Not Found`;
  });
}
var descriptionElements_svc_default = { index, get };
