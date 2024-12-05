import { Schema, model } from "mongoose";
import { descriptionElement } from "../models";

const decriptionElementSchema = new Schema<descriptionElement>(
    {
      item: { type: String, required: true, trim: true },
      description: { type: String, required: true, trim: true },
      info: [String]
    },
    { collection: "decriptionElements" }
  );
  const descriptionElementModel = model<descriptionElement>("Profile", decriptionElementSchema);

  function index(filter: object): Promise<descriptionElement[]> {
    // console.log("This is the filter: ", filter);
    return descriptionElementModel.find(filter);
  }
  
  function get(item: String): Promise<descriptionElement> {
    return descriptionElementModel.find({ item })
      .then((list) => list[0])
      .catch((err) => {
        throw `${item} Not Found`;
      });
  }

  function create(json: descriptionElement): Promise<descriptionElement> {
    const t = new descriptionElementModel(json);
    return t.save();
  }
  
  function update(
    item: String,
    descriptionelement: descriptionElement
  ): Promise<descriptionElement> {
    return descriptionElementModel.findOneAndUpdate({ item }, descriptionelement, {
      new: true
    }).then((updated) => {
      if (!updated) throw `${item} not updated`;
      else return updated as descriptionElement;
    });
  }

  function remove(item: String): Promise<void> {
    return descriptionElementModel.findOneAndDelete({ item }).then(
      (deleted) => {
        if (!deleted) throw `${item} not deleted`;
      }
    );
  }

  export default { index, get, create, update, remove };