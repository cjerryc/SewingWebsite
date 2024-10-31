import express, { Request, Response } from "express";
import { descriptionElementPage } from "./pages/descriptionElements";
import { getdescriptionElement } from "./services/descriptionElements-svc";

// export * from "./descriptionElements";

const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";

app.use(express.static(staticDir));

app.get("/hello", (req: Request, res: Response) => {
    res.send("Hello, World");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

app.get(
  "/casualFormal/:clothingId",
  (req: Request, res: Response) => {
    const { clothingId } = req.params;
    const data = getdescriptionElement(clothingId);
    const page = new descriptionElementPage(data);

    res.set("Content-Type", "text/html").send(page.render());
  }
);