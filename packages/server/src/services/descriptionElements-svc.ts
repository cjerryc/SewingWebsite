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


// const descriptionelement = {
//     item: "Blouse",
//     description: "A feminine top.",
//     info: ["some pretty words about blouses.",
//         "more words about this garment."
//     ]
// }
  // export function getdescriptionElement(_: string) {
  //   // return descriptionelement object
  //   return descriptionelement;
  // }

  function index(): Promise<descriptionElement[]> {
    return descriptionElementModel.find();
  }
  
  function get(item: String): Promise<descriptionElement> {
    return descriptionElementModel.find({ item })
      .then((list) => list[0])
      .catch((err) => {
        throw `${item} Not Found`;
      });
  }
  
  export default { index, get };