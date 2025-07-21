import type { TypeDiet } from "../../../../client/src/types/TypeFiles";
import databaseClient from "../../../database/client";

class dietRepository {
  async readAll() {
    const result = await databaseClient.query<TypeDiet>(
      `
    SELECT * FROM diet
    `,
    );

    return result.rows;
  }
}

export default new dietRepository();
