import express, { Request, Response } from "express";
import { descriptionElementPage } from "./pages/descriptionElements";
import descriptionElement from "./services/descriptionElements-svc";
import { connect } from "./services/mongo";
import descriptionElements from "./routes/casualFormal";
import auth, { authenticateUser } from "./routes/auth";
import { LoginPage } from "./pages/auth";



// Connect to sewing MongoDB
connect("sewing");

const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";

app.use(express.static(staticDir));
app.use(express.json());
app.use("/api/casualFormal", authenticateUser, descriptionElements);
app.use("/auth", auth);

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

app.get("/login", (req: Request, res: Response) => {
  const page = new LoginPage();
  res.set("Content-Type", "text/html").send(page.render());
});
