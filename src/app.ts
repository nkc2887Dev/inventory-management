import express from "express";
import partsRoutes from "./routes/index.routes";
import { notFound } from "./middleware/notFound.middleware";
import { errorHandler } from "./middleware/errorHandler.middleware";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/ping", (req, res) => {
  res.send("Server is up and running 🚀");
});

app.use("/", partsRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
