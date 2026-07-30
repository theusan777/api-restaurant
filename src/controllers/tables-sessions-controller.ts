import { Request, Response, NextFunction, request } from "express";
import { AppError } from "@/utils/AppError";
import { knex } from "@/database/knex"
import { z } from "zod"


class TablesSessionsController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const bodySchema = z.object({
        table_id: z.number(),
      })

      const { table_id } = bodySchema.parse(req.body)

      const session = await knex<TableSessionsRepository>("tables_sessions")
        .where({ table_id })
        .orderBy("opened_at", "desc")
        .first()

    if (session && !session.closed_at) {
         throw new AppError("this table is already open", 409)
       }

      await knex<TableSessionsRepository>("tables_sessions").insert({
        table_id,
        opened_at: knex.fn.now(),
      })

      return res.status(201).json({ message: "Table session created successfully" });
    } catch (error) {
      next(error);
    }
  }
}

export { TablesSessionsController };