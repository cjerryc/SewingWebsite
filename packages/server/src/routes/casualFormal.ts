import express, { Request, Response } from "express";
import { descriptionElement } from "../models/descriptionElements";

import descriptionElements from "../services/descriptionElements-svc";

const router = express.Router();

router.get("/", (req, res: Response) => { 
    const classType = req.query.class // get class type of garment
    // console.log("this is the req: ", req);
    descriptionElements.index({"class": classType})
      .then((list: descriptionElement[]) => res.json(list))
      .catch((err) => res.status(500).send(err));
  });
  
  router.get("/:item", (req: Request, res: Response) => {
    const { item } = req.params;
  
    descriptionElements.get(item)
      .then((descriptionelement: descriptionElement) => res.json(descriptionelement))
      .catch((err) => res.status(404).send(err));
  });

  router.post("/", (req: Request, res: Response) => {
    const newDescriptionElement = req.body;
  
    descriptionElements.create(newDescriptionElement)
      .then((descriptionelement: descriptionElement) =>
        res.status(201).json(descriptionelement)
      )
      .catch((err) => res.status(500).send(err));
  });

  router.put("/:item", (req: Request, res: Response) => {
    const { item } = req.params;
    const newDescriptionElement = req.body;
  
    descriptionElements
      .update(item, newDescriptionElement)
      .then((descriptionelement: descriptionElement) => res.json(descriptionelement))
      .catch((err) => res.status(404).end());
  });

  router.delete("/:item", (req: Request, res: Response) => {
    const { item } = req.params;
  
    descriptionElements.remove(item)
      .then(() => res.status(204).end())
      .catch((err) => res.status(404).send(err));
  });

  export default router;


// Example CURL REST requests to test the above request types
//   curl --request POST --header "Content-Type: application/json" \
// --data '{"item":"skirt","description":"Shortened dress to knee length or higher.", "info":["Various lengths", "Casual", "Sporty as well."]}' \
// http://localhost:3000/api/casualFormal

// Change the data being updated, and make sure to change the URI to the specific :item_id being updated
// curl --request PUT --header "Content-Type: application/json" \
// --data '{"info":["Various lengths are available.", "Typically casual.", "Sporty as well."]}' \
// http://localhost:3000/api/casualFormal/skirt

// Make sure to change the URI to the specific :item_id being deleted
// curl --request DELETE --header "Content-Type: application/json" \
// http://localhost:3000/api/casualFormal/garment_1