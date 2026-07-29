import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { knex } from "@/database/knex";

class ProductsController {
  async index(req: Request, res: Response, next: NextFunction) {
     try {
      const { name } = req.query;

      const products = await knex<ProductRepository>("products")
      .select("*")
      .whereLike("name", `%${name ?? ""}%`)
      .orderBy("name");
       
      return res.status(200).json({ message: "List of products", products });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const bodySchema = z.object({
        name: z.string().trim().min(6, "Name is required"),
        price: z.number().positive("Price must be a positive number"),
      });

      const { name, price } = bodySchema.parse(req.body);

      await knex<ProductRepository>("products").insert({ name, price });

      return res.status(201).json({
        message: "Product created successfully",
        product: { name, price },
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = z.string().transform((value) => Number(value))
      .refine((value) => !isNaN(value), "id must be a valid number")
      .parse(req.params.id);

      const bodySchema = z.object({
        name: z.string().trim().min(6, "Name is required"),
        price: z.number().positive("Price must be a positive number"),
      });

      const { name, price } = bodySchema.parse(req.body);

      await knex<ProductRepository>("products")
      .where({ id })
      .update({ name, price, updated_at: knex.fn.now() });

      return res.status(200).json({ message: "Product updated successfully" });
    } catch (error) {
      next(error);
    }
  }
}

export { ProductsController };