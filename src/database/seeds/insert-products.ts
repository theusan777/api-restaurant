import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {

    await knex("products").del();

    await knex("products").insert([
        { name: "Nhoque quatro queijos", price: 46 },
        { name: "Isca de camarão", price: 35 },
        { name: "Pizza margherita", price: 28 },
        { name: "Lasanha à bolonhesa", price: 32 },
        { name: "Filé mignon ao molho madeira", price: 55 },
        { name: "Salmão grelhado com legumes", price: 48 },
        { name: "Risoto de cogumelos", price: 38 },
        { name: "Frango à parmegiana", price: 30 },
        { name: "Espaguete à carbonara", price: 34 },
        { name: "Camarão na moranga", price: 60 },
        { name: "Salada Caesar", price: 25 },
    ]);
};
