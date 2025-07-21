import type { TypeUser } from "../../../../client/src/types/TypeFiles";
import databaseClient from "../../../database/client";

class userRepository {
  async read(id: number) {
    const result = await databaseClient.query<TypeUser>(
      /* sql */ `
        SELECT * FROM member
        WHERE id = $1
      `,
      [id],
    );

    return result.rows[0];
  }

  async readAll() {
    const result = await databaseClient.query<TypeUser>(
      `
      SELECT * FROM member`,
      [],
    );
    return result.rows;
  }

  // Création (C de CRUD)
  async create(newMember: Omit<TypeUser, "id">) {
    // En PG, on utilise $1, $2 comme placeholders, et on ajoute RETURNING id
    const result = await databaseClient.query<{ id: number }>(
      /* sql */ `
          INSERT INTO member (name, email, password)
          VALUES ($1, $2, $3)
          RETURNING id
        `,
      [newMember.name, newMember.email, newMember.password],
    );

    // result.rows[0].id contient l'ID retourné
    return result.rows[0].id;
  }

  // Async quand tu le sais tu l'attend avec Await
  async login(email: string) {
    const result = await databaseClient.query(
      `SELECT id, email, admin, password FROM member
        WHERE email = $1`,
      [email],
    );
    //retourn la ligne crée
    return result.rows[0];
  }

  async delete(memberId: number) {
    const result = await databaseClient.query(
      "DELETE FROM member WHERE id = $1 RETURNING id, email",
      [memberId],
    );

    return result.rows[0];
  }

  async update(
    memberId: number,
    fields: { name?: string; email?: string; password?: string },
  ) {
    // Tableau qui va contenir les fragments de la requête SQL "SET"
    const updates = [];
    // Tableau qui va contenir les valeurs à passer à la requête paramétrée
    const values = [];
    // Commence à 1 car $1 est le premier paramètre
    // dans la requête SQL, et on va ajouter les valeurs dans l'ordre
    // où elles apparaissent dans la requête.
    // On utilise un index pour construire les placeholders $1, $2, etc.
    let idx = 1;
    // On vérifie chaque champ et on ajoute les fragments de mise à jour (updates et values)
    if (fields.name) {
      updates.push(`name = $${idx++}`);
      values.push(fields.name);
    }
    // Si le champ email est défini, on l'ajoute à la requête
    if (fields.email) {
      updates.push(`email = $${idx++}`);
      values.push(fields.email);
    }
    // Si le champ password est défini, on l'ajoute à la requête
    if (fields.password) {
      updates.push(`password = $${idx++}`);
      values.push(fields.password);
    }
    // Si aucun champ n'est défini, on ne fait rien : null est retourné.
    //values.push permet de stocker les valeurs à passer à la requête paramétrée pour éviter les injections SQL.
    if (!updates.length) return null;
    values.push(memberId);
    const result = await databaseClient.query(
      // join les fragments de mise à jour avec des virgules.
      //where clause pour mettre à jour uniquement le membre avec l'ID spécifié
      //returning clause pour retourner l'ID, le nom et l'email du membre mis à jour
      `UPDATE member SET ${updates.join(", ")} WHERE id = $${idx} RETURNING id, name, email`,
      values,
    );
    return result.rows[0];
  }

  async favoriteList(user_id: number) {
    const result = await databaseClient.query(
      `SELECT r.id AS recipe_id, r.name, r.picture, r.difficulty, d.name AS diet_name, a.is_favorite
      FROM recipe r
      JOIN action a ON r.id = a.recipe_id
      JOIN diet d ON r.id_diet = d.id
      WHERE a.user_id=$1 
      AND a.is_favorite=true`,
      [user_id],
    );

    return result.rows;
  }

  async commentedList(user_id: number) {
    const result = await databaseClient.query(
      `SELECT r.id AS recipe_id, r.name, r.picture, a.comment
      FROM recipe r
      JOIN action a ON r.id = a.recipe_id
      WHERE user_id=$1 
      AND a.comment IS NOT NULL
      AND a.comment <> ''`,
      [user_id],
    );

    return result.rows;
  }

  async registeredList(user_id: number) {
    const result = await databaseClient.query(
      `
    SELECT
      l.id AS list_id,
      l.date_creation AS date_creation,
      lr.recipe_id AS recipe_id,
      r.name AS name,
      r.picture AS picture,
      lr.number_people AS number_persons,
      (
        SELECT json_agg(json_build_object('name', i.name, 'quantity', ri.quantity))
        FROM recip_ingredient ri
        JOIN ingredient i ON i.id = ri.ingredient_id
        WHERE ri.recipe_id = r.id
      ) AS ingredients
    FROM list l
    JOIN list_recipe lr ON lr.list_id = l.id
    JOIN recipe r ON r.id = lr.recipe_id
    WHERE l.user_id = $1
    ORDER BY l.date_creation
    `,
      [user_id],
    );
    return result.rows;
  }

  async profileMember(user_id: number) {
    const result = await databaseClient.query(
      `SELECT *
      FROM member
      WHERE id=$1`,
      [user_id],
    );

    return result.rows;
  }

  async updateAdminStatus(memberId: number, admin: boolean) {
    const result = await databaseClient.query(
      `UPDATE member
      SET admin = $1 WHERE id = $2
      RETURNING id, name, email, admin`,
      [admin, memberId],
    );
    return result.rows[0];
  }
}

// async rated(user_id: number) {
//   const result = await databaseClient.query(
//     `SELECT recipe_id, rate
//     FROM action
//     WHERE user_id=$1
//     AND rate`,
//     [user_id],
//   );

//   return result.rows;
// }

export default new userRepository();
