// Import Faker library for generating fake data
import { faker } from "@faker-js/faker";
import type { Faker } from "@faker-js/faker";

// Import database client
import database from "../client";
import type { DatabaseClient, Result, Rows } from "../client";

// Declare an object to store created objects from their names
type Ref = object & { insertId: number };

const refs: { [key: string]: Ref } = {};

type SeederOptions = {
  table: string;
  truncate?: boolean;
  dependencies?: (typeof AbstractSeeder)[];
};

// Provide faker access through AbstractSeed class
abstract class AbstractSeeder implements SeederOptions {
  table: string;
  truncate: boolean;
  dependencies: (typeof AbstractSeeder)[];
  promises: Promise<void>[];
  faker: Faker;

  constructor({
    table,
    truncate = true,
    dependencies = [] as (typeof AbstractSeeder)[],
  }: SeederOptions) {
    this.table = table;
    this.truncate = truncate;
    this.dependencies = dependencies;
    this.promises = [];
    this.faker = faker;
  }

  async #doInsert(data: { refName?: string } & object) {
    const { refName, ...values } = data;

    const fields = Object.keys(values);
    const fieldNames = fields.join(",");
    const placeholders = fields.map((_, i) => `$${i + 1}`).join(",");

    const sql = `INSERT INTO ${this.table}(${fieldNames}) VALUES (${placeholders}) RETURNING id`;

    const result = await database.query(sql, Object.values(values));

    if (refName != null) {
      const insertId = result.rows[0].id;
      refs[refName] = { ...values, insertId };
    }
  }

  insert(data: { refName?: string } & object) {
    this.promises.push(this.#doInsert(data));
  }

  run() {
    throw new Error("You must implement this function");
  }

  getRef(name: string) {
    return refs[name];
  }
}

// Ready to export
export default AbstractSeeder;
export type { AbstractSeeder };
