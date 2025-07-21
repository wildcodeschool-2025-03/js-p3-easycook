import databaseClient from "../../../database/client";

interface RecipeItem {
  recipeId: number;
  userId: number;
  numberPersons: number;
}

class ListRepository {
  async addList(id: number) {
    const result = await databaseClient.query<{ id: number }>(
      `
      INSERT INTO list (user_id)
      VALUES ($1)
      RETURNING id
    `,
      [id],
    );
    return result.rows[0].id;
  }

  async addListRecipe(listId: number, list: RecipeItem[]) {
    // map list pour obtenir recipeId et numberPersons

    const results = await Promise.all(
      list.map(async (item) =>
        databaseClient.query(
          `
          INSERT INTO list_recipe (list_id, recipe_id, number_people)
          VALUES ($1, $2, $3)      
        `,
          [listId, item.recipeId, item.numberPersons],
        ),
      ),
    );
    return results.map((result) => result.rows[0]?.id);
  }
}
export default new ListRepository();
