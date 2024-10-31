import { descriptionElement } from "../models";

const descriptionelement = {
    item: "Blouse",
    description: "A feminine top.",
    info: ["some pretty words about blouses.",
        "more words about this garment."
    ]
}
  export function getdescriptionElement(_: string) {
    // return descriptionelement object
    return descriptionelement;
  }