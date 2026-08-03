import { Router } from "express";

import { tablesSessionsRoutes } from "./tables-sessions-routes";
import { productsRoutes } from "./products-routes";
import { tablesRoutes } from "./tables-routes";
import { ordersRoutes } from "./orders-routes";
import { TablesSessionsController } from "@/controllers/tables-sessions-controller";

const routes = Router();
const tablesSessionsController = new TablesSessionsController();

routes.use("/tables-sessions", tablesSessionsRoutes);
routes.get("/table-session/:id", tablesSessionsController.show);
routes.use("/products", productsRoutes);
routes.use("/tables", tablesRoutes);
routes.use("/orders", ordersRoutes);

export { routes };


