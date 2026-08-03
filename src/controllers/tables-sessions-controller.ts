import { Request, Response, NextFunction } from "express";
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

  async index(req: Request, res: Response, next: NextFunction) {
    try {
      const sessions = await knex<TableSessionsRepository>("tables_sessions")
        .select("*")
        .orderBy("closed_at", "desc")

      return res.json(sessions);
    } catch (error) {
      next(error);
    }
  }

  async show(req: Request, res: Response, next: NextFunction) {
    try {
      const id = z
        .string()
        .transform((value) => Number(value))
        .refine((value) => !isNaN(value), {
          message: "Invalid id",
        })
        .parse(req.params.id);

      const session = await knex<TableSessionsRepository>("tables_sessions")
        .where({ id })
        .first();

      if (!session) {
        throw new AppError("Table session not found", 404);
      }

      return res.json(session);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = z
      .string()
      .transform((value) => Number(value))
      .refine((value) => !isNaN(value), {
        message: "Invalid id",
      })
      .parse(req.params.id)

      const session = await knex<TableSessionsRepository>("tables_sessions")
        .where({ id })
        .first()

      if (!session) {
        throw new AppError("Table session not found", 404)
      }

      if (session.closed_at) {
        throw new AppError("Table session is already closed", 409)
      } 

      await knex<TableSessionsRepository>("tables_sessions")
        .where({ id })
        .update({
          closed_at: knex.fn.now(),
        })
        .where({ id })
    } catch (error) {
      next(error);
    }
  }
}

export { TablesSessionsController };


