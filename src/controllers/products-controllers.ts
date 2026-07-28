import { NextFunction, Request, Response } from "express";

class ProductsController {
  async index(req: Request, res: Response, next: NextFunction) {
     try {
       
      return res.status(200).json({ message: "List of products" });
    } catch (error) {
      next(error);
    }
  }
}

export { ProductsController };