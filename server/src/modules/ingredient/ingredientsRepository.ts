import type { TypeIngredient } from "../../../../client/src/types/TypeFiles";
import databaseClient from "../../../database/client";

class ingredientRepository {
  async readAll() {
    const result = await databaseClient.query<TypeIngredient>(
      /* sql */ `
        SELECT * FROM ingredient
      `,
      [], // Pas de paramètres ici
    );

    return result.rows;
  }

  async recipeIngredient(id: number) {
    const result = await databaseClient.query<TypeIngredient>(
      /* sql */ `
      SELECT
        i.id AS ingredient_id,
        i.name AS ingredient_name,
        i.picture AS ingredient_picture,
        ri.quantity AS ingredient_quantity,
        u.value AS unit_name
      FROM recip_ingredient ri
      JOIN ingredient i ON i.id = ri.ingredient_id
      JOIN unity u ON u.id = ri.unity_id
      WHERE ri.recipe_id = $1;

      `,
      [id],
    );
    //on renvoi une ligne par ingredient
    return result.rows;
  }

  async readAllWithType() {
    const result = await databaseClient.query<TypeIngredient>(
      `
    SELECT
      i.id AS ingredient_id,
      i.name AS ingredient_name,
      i.picture AS ingredient_picture,
      t.id AS type_id,
      t.name AS type_name
    FROM ingredient i
    JOIN type_ingredient t ON i.id_type_ingredient = t.id
    ORDER BY t.id, i.name
    `,
    );
    return result.rows;
  }
}

export default new ingredientRepository();
