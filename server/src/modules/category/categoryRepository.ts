import type { TypeCategory } from "../../../../client/src/types/TypeFiles";
import databaseClient from "../../../database/client";

class categoryRepository {
  async readAll() {
    const result = await databaseClient.query<TypeCategory>(
      `
    SELECT * FROM category
    `,
    );

    return result.rows;
  }
}

export default new categoryRepository();
