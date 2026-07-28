import { NextFunction, Request, Response } from "express";
import { z } from "zod";

class ProductsController {
  async index(req: Request, res: Response, next: NextFunction) {
     try {
       
      return res.status(200).json({ message: "List of products" });
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

      return res.status(201).json({
        message: "Product created successfully",
        product: { name, price },
      });
    } catch (error) {
      next(error);
    }
  }
}

export { ProductsController };