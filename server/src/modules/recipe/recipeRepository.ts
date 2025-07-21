import type {
  TypeRandom,
  TypeRecipe,
  ingredientDetails,
} from "../../../../client/src/types/TypeFiles";
import databaseClient from "../../../database/client";

class recipeRepository {
  //   // Création (C de CRUD)
  //   async create(item: Omit<Item, "id">) {
  //     // En PG, on utilise $1, $2 comme placeholders, et on ajoute RETURNING id
  //     const result = await databaseClient.query<{ id: number }>(
  //       /* sql */ `
  //         INSERT INTO item (title, user_id)
  //         VALUES ($1, $2)
  //         RETURNING id
  //       `,
  //       [item.title, item.user_id],
  //     );

  //     // result.rows[0].id contient l'ID retourné
  //     return result.rows[0].id;
  //   }

  // Lecture d'un seul élément (R de CRUD)
  async read(id: number) {
    const result = await databaseClient.query<TypeRecipe>(
      /* sql */ `
        SELECT * FROM recipe
        WHERE id = $1
      `,
      [id],
    );

    // On renvoie la première ligne, castée en Item
    return result.rows[0];
  }

  // Lecture de tous les éléments
  async readAll() {
    const result = await databaseClient.query<TypeRecipe>(
      /* sql */ `
      SELECT DISTINCT ON (r.id) r.id, r.picture, r.name AS recipe_name, d.name AS diet_name, r.difficulty, r.description, r.time_preparation, r.kcal, AVG(a.rate) as rate
      FROM recipe r
      JOIN recip_ingredient ri ON r.id = ri.recipe_id
      JOIN ingredient i ON ri.ingredient_id = i.id
      LEFT JOIN action a ON r.id = a.recipe_id
      JOIN diet d ON r.id_diet = d.id
      LEFT JOIN category c ON r.id_category = c.id
      GROUP BY r.id, d.name
      ORDER BY r.id;
    `,
      [], // Pas de paramètres ici
    );

    return result.rows;
  }

  // // (U de CRUD) -- Exemple de squelette pour la mise à jour, si tu veux t'entraîner :
  // async update(item: Item) {
  //   const result = await databaseClient.query(
  //     `
  //       UPDATE item
  //       SET title = $1, user_id = $2
  //       WHERE id = $3
  //       RETURNING *
  //     `,
  //     [item.title, item.user_id, item.id],
  //   );
  //   return result.rows[0] as Item;
  // }

  // // (D de CRUD) -- Exemple de squelette pour la suppression :
  // async delete(id: number) {
  //   const result = await databaseClient.query(
  //     `
  //       DELETE FROM item
  //       WHERE id = $1
  //     `,
  //     [id],
  //   );
  //   return result.rowCount; // renvoie 1 si un enregistrement a bien été supprimé
  // }
  async checkCombo(recipeId: number, userId: number) {
    const result = await databaseClient.query(
      `
        SELECT * FROM action
        WHERE recipe_id = $1 AND user_id = $2
      `,
      [recipeId, userId],
    );
    return (result.rowCount ?? 0) > 0; // renvoie true si le combo existe
  }

  async updateComment(recipeId: number, userId: number, commentText: string) {
    const result = await databaseClient.query(
      `
        UPDATE action
        SET comment = $1
        WHERE recipe_id = $2 AND user_id = $3
      `,
      [commentText, recipeId, userId],
    );
    return result.rowCount; // renvoie 1 si un enregistrement a bien été mis à jour
  }

  async updateRate(recipeId: number, userId: number, rate: number) {
    const result = await databaseClient.query(
      `
        UPDATE action
        SET rate = $1
        WHERE recipe_id = $2 AND user_id = $3
      `,
      [rate, recipeId, userId],
    );
    return result.rowCount; // renvoie 1 si un enregistrement a bien été mis à jour
  }

  async search(id: string) {
    const searchWord = `%${id}%`; // On utilise le caractère de pourcentage pour la recherche partielle
    const result = await databaseClient.query<TypeRecipe>(
      `
      SELECT DISTINCT ON (r.id) r.id, r.picture, r.name AS recipe_name , d.name AS diet_name, r.difficulty, r.time_preparation, r.kcal, a.rate
      FROM recipe r
      JOIN recip_ingredient ri ON r.id = ri.recipe_id
      JOIN ingredient i ON ri.ingredient_id = i.id
      LEFT JOIN action a ON r.id = a.recipe_id
      JOIN diet d ON r.id_diet = d.id
      WHERE r.name ILIKE $1 OR i.name ILIKE $1;
      `,
      [searchWord], // Pas de paramètres ici
    );

    return result.rows;
  }

  async category(id: string) {
    const result = await databaseClient.query<TypeRecipe>(
      `
      SELECT DISTINCT ON (r.id) r.id, r.picture, r.name AS recipe_name, d.name AS diet_name, r.difficulty, r.time_preparation, r.kcal, a.rate
      FROM recipe r
      JOIN recip_ingredient ri ON r.id = ri.recipe_id
      JOIN ingredient i ON ri.ingredient_id = i.id
      LEFT JOIN action a ON r.id = a.recipe_id
      JOIN diet d ON r.id_diet = d.id
      LEFT JOIN category c ON r.id_category = c.id
      WHERE c.name ILIKE $1;
    `,
      [id],
    );
    return result.rows;
  }

  async diet(id: string) {
    const searchWord = `%${id}%`;
    const result = await databaseClient.query<TypeRecipe>(
      `
      SELECT DISTINCT ON (r.id) r.id, r.picture, r.name AS recipe_name, d.name AS diet_name, r.difficulty, r.time_preparation, r.kcal, a.rate
      FROM recipe r
      JOIN recip_ingredient ri ON r.id = ri.recipe_id
      JOIN ingredient i ON ri.ingredient_id = i.id
      LEFT JOIN action a ON r.id = a.recipe_id
      JOIN diet d ON r.id_diet = d.id
      WHERE d.name ILIKE $1;
    `,
      [searchWord],
    );
    return result.rows;
  }

  async difficulty(id: string) {
    const result = await databaseClient.query<TypeRecipe>(
      `
      SELECT DISTINCT ON (r.id) r.id, r.picture, r.name AS recipe_name, d.name AS diet_name, r.difficulty, r.time_preparation, r.kcal, a.rate
      FROM recipe r
      JOIN recip_ingredient ri ON r.id = ri.recipe_id
      JOIN ingredient i ON ri.ingredient_id = i.id
      LEFT JOIN action a ON r.id = a.recipe_id
      JOIN diet d ON r.id_diet = d.id
      WHERE r.difficulty ILIKE $1;
    `,
      [id],
    );
    return result.rows;
  }

  async time(id: string) {
    const result = await databaseClient.query<TypeRecipe>(
      `
      SELECT DISTINCT ON (r.id) r.id, r.picture, r.name AS recipe_name, d.name AS diet_name, r.difficulty, r.time_preparation, r.kcal, a.rate
      FROM recipe r
      JOIN recip_ingredient ri ON r.id = ri.recipe_id
      JOIN ingredient i ON ri.ingredient_id = i.id
      LEFT JOIN action a ON r.id = a.recipe_id
      JOIN diet d ON r.id_diet = d.id
      WHERE r.time_preparation ILIKE $1;
    `,
      [id],
    );
    return result.rows;
  }

  async random() {
    const result = await databaseClient.query<TypeRandom>(
      /* sql */ `
        SELECT r.id, r.picture, r.name, r.time_preparation, AVG(a.rate) as rate
        FROM recipe r
        LEFT JOIN action a ON r.id = a.recipe_id
        GROUP BY r.id
        ORDER BY RANDOM()
        LIMIT 4;
        
      `,
      [], // Pas de paramètres ici
    );
    return result.rows;
  }

  async accueilCategory() {
    const result = await databaseClient.query<TypeRandom>(
      `
        SELECT c.id , c.name , r.picture
    FROM category c
    JOIN LATERAL (
      SELECT r.picture
      FROM recipe r
      WHERE r.id_category = c.id
      ORDER BY random()
      LIMIT 1
    ) r ON true
    WHERE c.id IN (2, 3, 4);
        
      `,
      [], // Pas de paramètres ici
    );
    return result.rows;
  }

  async listRecipes() {
    const result = await databaseClient.query<{ name: string }>(
      "SELECT id, name FROM recipe",
    );

    return result.rows; // renvoie un tableau de { name: string }
  }

  async deleteRecipe(recipeId: number) {
    const result = await databaseClient.query(
      "DELETE FROM recipe WHERE id = $1 RETURNING id",
      [recipeId],
    );

    return result.rows[0];
  }

  async add(
    recipe: TypeRecipe,
    ingredientDetails: ingredientDetails[],
    ustensilIds: number[],
  ) {
    // On exécute une requête SQL pour insérer la recette dans recipe
    try {
      const result = await databaseClient.query<{ id: number }>(
        `
      INSERT INTO recipe (name, time_preparation, description, difficulty, picture, kcal, id_category, id_diet, step1, step2, step3, step4, step5, step6, step7)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING id
    `,
        [
          recipe.name,
          recipe.time_preparation,
          recipe.description,
          recipe.difficulty,
          recipe.picture,
          recipe.kcal,
          recipe.id_category,
          recipe.id_diet,
          recipe.step1,
          recipe.step2 ?? null,
          recipe.step3 ?? null,
          recipe.step4 ?? null,
          recipe.step5 ?? null,
          recipe.step6 ?? null,
          recipe.step7 ?? null,
        ],
      );

      // On récupère l'ID de la recette qu'on vient de créer
      const recipeId = result.rows[0].id;
      // On boucle sur tous les ingrédients (objet qui contient ses données (id, quantité, unité, etc.) reçus dans ingredientDetails
      for (const ingredient of ingredientDetails) {
        // Convertir en nombre et vérifier
        const quantity = Number(ingredient.quantity);
        //On récupère l’identifiant de l’unité associée à cet ingrédient. Le ?? signifie "si ingredient.unity_id est défini, on le prend, sinon on prend ingredient.unity
        const unityId = Number(ingredient.unity_id ?? ingredient.unity);

        if (Number.isNaN(quantity)) {
          throw new Error(
            `Quantité invalide pour l'ingrédient id=${ingredient.id}`,
          );
        }
        if (Number.isNaN(unityId)) {
          throw new Error(
            `unity_id invalide pour l'ingrédient id=${ingredient.id}`,
          );
        }

        await databaseClient.query(
          `
    INSERT INTO recip_ingredient (ingredient_id, recipe_id, quantity, unity_id)
    VALUES ($1, $2, $3, $4)
    `,
          [ingredient.id, recipeId, quantity, unityId],
        );
      }

      for (const ustensilId of ustensilIds) {
        const parsedUstensilId = Number(ustensilId);
        if (Number.isNaN(parsedUstensilId)) {
          throw new Error(`ustensil_id invalide : ${ustensilId}`);
        }

        await databaseClient.query(
          `
    INSERT INTO recipe_utensil (recipe_id, utensil_id)
    VALUES ($1, $2)
    `,
          [recipeId, parsedUstensilId],
        );
      }

      return "";
    } catch (err) {
      console.error("Erreur dans recipeRepository.add :", err);
      throw err;
    }
  }

  async byIngredients(ingredients: number[]) {
    if (!ingredients.length) return [];

    const result = await databaseClient.query<TypeRecipe>(
      `
    SELECT r.id, r.picture, r.description, r.name, d.name AS diet_name, r.difficulty, r.time_preparation, r.kcal, AVG(a.rate) as rate
    FROM recipe r
    JOIN recip_ingredient ri ON r.id = ri.recipe_id
    JOIN ingredient i ON ri.ingredient_id = i.id
    LEFT JOIN action a ON r.id = a.recipe_id
    JOIN diet d On r.id_diet = d.id
    WHERE i.id = ANY($1)
    GROUP BY r.id, d.name
    HAVING COUNT(DISTINCT i.id) = $2
    ORDER BY r.id;
    `,
      [ingredients, ingredients.length],
    );
    return result.rows;
  }

  async note(id: number) {
    const result = await databaseClient.query(
      `
      SELECT AVG(rate) as rate
      FROM action
      WHERE recipe_id = $1;
    `,
      [id],
    );
    return result.rows[0].rate;
  }

  async comment(id: number) {
    const result = await databaseClient.query(
      `
      SELECT comment, member.name AS name
      FROM action
      JOIN member ON action.user_id = member.id
      WHERE recipe_id = $1;
    `,
      [id],
    );
    return result.rows;
  }

  async addComment(recipeId: number, userId: number, comment: string) {
    const result = await databaseClient.query(
      `
      INSERT INTO action (recipe_id, user_id, comment)
      VALUES ($1, $2, $3)      
    `,
      [recipeId, userId, comment],
    );
    return { recipeId, userId }; // Retourne les id clefs primaires de la table action
  }

  async updateFavorite(recipeId: number, userId: number, is_favorite: boolean) {
    const result = await databaseClient.query(
      `
    INSERT INTO action (recipe_id, user_id, is_favorite)
    VALUES ($1, $2, $3)
    ON CONFLICT (recipe_id, user_id)
    DO UPDATE SET is_favorite = EXCLUDED.is_favorite
    RETURNING *;
    `,
      [recipeId, userId, is_favorite],
    );
    return result.rows[0]; // returns the affected row
  }

  async addRate(recipeId: number, userId: number, rate: number) {
    const result = await databaseClient.query(
      `
      INSERT INTO action (recipe_id, user_id, rate)
      VALUES ($1, $2, $3)
    `,
      [recipeId, userId, rate],
    );
    return { recipeId, userId }; // Retourne les id clefs primaires de la table action
  }

  async readFiltered(category?: string, diet?: string, difficulty?: string) {
    const whereClauses: string[] = [];
    const params: string[] = [];
    let paramIndex = 1;

    if (category) {
      whereClauses.push(`c.name ILIKE $${paramIndex++}`);
      params.push(category);
    }
    if (diet) {
      whereClauses.push(`d.name ILIKE $${paramIndex++}`);
      params.push(`%${diet}%`);
    }
    if (difficulty) {
      whereClauses.push(`r.difficulty ILIKE $${paramIndex++}`);
      params.push(difficulty);
    }

    const where =
      whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";

    const result = await databaseClient.query<TypeRecipe>(
      `
      SELECT DISTINCT ON (r.id) r.id, r.picture, r.name AS recipe_name, d.name AS diet_name, r.difficulty, r.description, r.time_preparation, r.kcal, AVG(a.rate) as rate
      FROM recipe r
      JOIN recip_ingredient ri ON r.id = ri.recipe_id
      JOIN ingredient i ON ri.ingredient_id = i.id
      LEFT JOIN action a ON r.id = a.recipe_id
      JOIN diet d ON r.id_diet = d.id
      LEFT JOIN category c ON r.id_category = c.id
      ${where}
      GROUP BY r.id, d.name
      ORDER BY r.id;
      `,
      params,
    );
    return result.rows;
  }

  async update(
    recipeId: number,
    data: Partial<TypeRecipe> & {
      ingredients?: ingredientDetails[];
      ustensils?: number[];
    },
  ) {
    const result = await databaseClient.query(
      `
        UPDATE recipe
        SET name = $1,
            description = $2,
            time_preparation = $3,
            difficulty = $4,
            kcal = $5,
            step1 = $6,
            step2 = $7,
            step3 = $8,
            step4 = $9,
            step5 = $10,
            step6 = $11,
            step7 = $12
        WHERE id = $13
        RETURNING *
      `,
      [
        data.name,
        data.description,
        data.time_preparation,
        data.difficulty,
        data.kcal,
        data.step1,
        data.step2,
        data.step3,
        data.step4,
        data.step5,
        data.step6,
        data.step7,
        recipeId,
      ],
    );
    // --- Mise à jour des ingrédients ---
    if (Array.isArray(data.ingredients)) {
      await databaseClient.query(
        "DELETE FROM recip_ingredient WHERE recipe_id = $1",
        [recipeId],
      );
      // nouveaux ingrédients
      for (const ingredient of data.ingredients) {
        await databaseClient.query(
          "INSERT INTO recip_ingredient (ingredient_id, recipe_id, quantity, unity_id) VALUES ($1, $2, $3, $4)",
          [ingredient.id, recipeId, ingredient.quantity, ingredient.unity_id],
        );
      }
    }
    // --- Mise à jour des ustensiles ---
    if (Array.isArray(data.ustensils)) {
      await databaseClient.query(
        "DELETE FROM recipe_utensil WHERE recipe_id = $1",
        [recipeId],
      );
      for (const ustensilId of data.ustensils) {
        await databaseClient.query(
          "INSERT INTO recipe_utensil (recipe_id, utensil_id) VALUES ($1, $2)",
          [recipeId, ustensilId],
        );
      }
    }
    return result.rows[0];
  }
}

export default new recipeRepository();
