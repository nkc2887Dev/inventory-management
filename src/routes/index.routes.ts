import { Router } from "express";
import router from "./parts.routes";
const routes = Router();

routes.use("/api", router);

export default routes;