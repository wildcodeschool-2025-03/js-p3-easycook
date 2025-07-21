import type { TypeUnity } from "../../../../client/src/types/TypeFiles";
import databaseClient from "../../../database/client";

class unityRepository {
  async readAll() {
    const result = await databaseClient.query<TypeUnity>(
      `
    SELECT * FROM unity
    `,
    );

    return result.rows;
  }
}

export default new unityRepository();
