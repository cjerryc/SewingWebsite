import express, { Request, Response } from "express";
import { descriptionElementPage } from "./pages/descriptionElements";
import descriptionElement from "./services/descriptionElements-svc";
import { connect } from "./services/mongo";


// Connect to sewing MongoDB
connect("sewing");

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

// Generate HTML
app.get("/casualFormal/:clothingId",(req: Request, res: Response) => {
    const { clothingId } = req.params;
    descriptionElement.get(clothingId).then((data) => {
      const page = new descriptionElementPage(data);
      res.set("Content-Type", "text/html").send(page.render());
    })
  }
);

// RETURNS MONGODB STORED DATA
// app.get("/api/casualFormals/:clothingId", (req: Request, res: Response) => {
//   const { clothingId } = req.params;

//   descriptionElement.get(clothingId).then((data) => {
//     const page = new descriptionElementPage(data);
//     res
//       .set("Content-Type", "text/html")
//       .send(page.render());
//   });
// });