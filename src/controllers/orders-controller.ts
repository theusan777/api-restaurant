import { Request, Response, NextFunction } from "express";
import { AppError } from "@/utils/AppError";
import { knex } from "@/database/knex";
import { z } from "zod";

class OrdersController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const bodySchema = z.object({
        table_session_id: z.number(),
        product_id: z.number(),
        quantity: z.number(),
        price: z.number(),
      });

      const { table_session_id, product_id, quantity, price } = bodySchema.parse(req.body);

      const session = await knex<TableSessionsRepository>("tables_sessions")
      .where({ id: table_session_id })
      .first();

      if (!session) {
        throw new AppError("Table session not found", 404);
      }

      if (session.closed_at) {
        throw new AppError("Table session is closed", 400);
      }

      const product = await knex<ProductRepository>("products")
      .where({ id: product_id })
      .first();

      if (!product) {
        throw new AppError("Product not found", 404);
      }

      await knex<OrderRepository>("orders").insert({
        table_session_id,
        product_id,
        quantity,
        price: product.price,
      });

      return res.status(201).json({ message: "Order created successfully" });
    } catch (error) {
      next(error);
    }
  } 

  async index(req: Request, res: Response, next: NextFunction) {
    try {
      const { table_session_id } = req.params;

      const order = await knex("orders")
      .select(
          "orders.id",
          "orders.table_session_id",
          "orders.product_id", 
          "products.name", 
          "orders.price", 
          "orders.quantity", 
          knex.raw("(orders.price * orders.quantity) as total"),
          "orders.created_at", 
          "orders.updated_at"
      )
      .join("products", "orders.product_id", "products.id")
      .where({ table_session_id })
      .orderBy("created_at", "desc");

      return res.status(200).json({ message: "List of orders", data: order });
    } catch (error) {
      next(error);
    }
  }

  async show(req: Request, res: Response, next: NextFunction) {
    try {
      const { table_session_id } = req.params;

      const order = await knex("orders")
      .select(
          knex.raw("COALESCE(SUM(orders.price * orders.quantity), 0) as total"),
          knex.raw("COALESCE(SUM(orders.quantity), 0) as quantity")
      )
      .where({ table_session_id })
      .first();  

      return res.status(200).json({ message: "Show order", data: order });
    } catch (error) {
      next(error);
    }
  }
}

export { OrdersController };