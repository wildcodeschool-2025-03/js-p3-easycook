import type { TypeUstensil } from "../../../../client/src/types/TypeFiles";
import databaseClient from "../../../database/client";

class ustensilRepository {
  async recipeUstensil(id: number) {
    const result = await databaseClient.query<TypeUstensil>(
      /* sql */ `
        SELECT
          u.id AS ustensil_id,
          u.name AS ustensil_name,
          u.picture AS ustensil_picture
        FROM recipe_utensil ru
        JOIN utensil u ON u.id = ru.utensil_id
        WHERE ru.recipe_id = $1;
      `,
      [id],
    );
    //on renvoi une ligne par ustensile
    return result.rows;
  }

  async getAllUstensils(): Promise<TypeUstensil[]> {
    const { rows } = await databaseClient.query(
      "SELECT * FROM utensil ORDER BY name",
    );
    return rows;
  }

  async addUstensils(recipeId: number, ustensilIds: number[]): Promise<void> {
    for (const ustensilId of ustensilIds) {
      const parsedId = Number(ustensilId);
      if (Number.isNaN(parsedId)) {
        throw new Error(`utensil_id invalide : ${ustensilId}`);
      }

      await databaseClient.query(
        `
      INSERT INTO recipe_utensil (recipe_id, utensil_id)
      VALUES ($1, $2)
      ON CONFLICT DO NOTHING
      `,
        [recipeId, parsedId],
      );
    }
  }
}

export default new ustensilRepository();
