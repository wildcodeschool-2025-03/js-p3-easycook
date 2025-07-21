import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import type { QueryResult, QueryResultRow } from "pg";
import supertest from "supertest";
import type {
  Member,
  TypeCategory,
  TypeDiet,
  TypeRecipe,
  TypeUnity,
} from "../../../client/src/types/TypeFiles";
import databaseClient from "../../database/client";
import app from "../../src/app";
dotenv.config();

// 200 : succès de la requête ;
// 201 : Creation reussis;
// 301 et 302 : redirection, respectivement permanente et temporaire ;
// 401 : utilisateur non authentifié ;
// 403 : accès refusé ;
// 404 : ressource non trouvée ;
// 500, 502 et 503 : erreurs serveur ;
// 504 : le serveur n'a pas répondu.

afterEach(() => {
  jest.restoreAllMocks();
});

//
//  pour mocker databaseClient.query

function mockQuery<T extends QueryResultRow>(rows: T[]) {
  jest
    .spyOn(databaseClient, "query")
    .mockImplementation(async () => ({ rows }) as QueryResult<T>);
}

// Test Time ! //

describe("GET Routes publique", () => {
  it("Devrait nous montrer toutes les unités", async () => {
    const rows: TypeUnity[] = [];
    mockQuery(rows);
    const res = await supertest(app).get("/api/unity");
    expect(res.status).toBe(200);
    expect(res.body).toStrictEqual(rows);
  });

  it("Devrait nous montrer toute les Diet", async () => {
    const rows: TypeDiet[] = [];
    mockQuery(rows);
    const res = await supertest(app).get("/api/diet");
    expect(res.status).toBe(200);
    expect(res.body).toStrictEqual(rows);
  });

  it("Devrait nous montrer toute les categories", async () => {
    const rows: TypeCategory[] = [];
    mockQuery(rows);
    const res = await supertest(app).get("/api/category");
    expect(res.status).toBe(200);
    expect(res.body).toStrictEqual(rows);
  });

  it("Devrait nous montrer recettes aléatoire", async () => {
    const rows: TypeRecipe[] = [];
    mockQuery(rows);
    const res = await supertest(app).get("/api/recipe/random");
    expect(res.status).toBe(200);
    expect(res.body).toStrictEqual(rows);
  });

  it("Devrait nous montrer toutes les recettes", async () => {
    const rows: TypeRecipe[] = [];
    mockQuery(rows);
    const res = await supertest(app).get("/api/recipe");
    expect(res.status).toBe(200);
    expect(res.body).toStrictEqual(rows);
  });

  it("Devrait nous montrer le détail d’une recette", async () => {
    const rows: TypeRecipe[] = [{ id: 17, name: "Crêpes Rapides", rate: 0 }];
    mockQuery(rows);
    const res = await supertest(app).get("/api/recipe/detail/17");
    expect(res.status).toBe(200);
    expect(res.body).toStrictEqual(rows[0]);
  });

  it("Devrait faire la recherche par mot-clé", async () => {
    const rows: TypeRecipe[] = [{ id: 17, name: "Crêpes Rapides", rate: 0 }];
    mockQuery(rows);
    const res = await supertest(app).get("/api/recipe/search/17");
    expect(res.status).toBe(200);
    expect(res.body).toStrictEqual(rows);
  });

  it("Devrait filtrer par catégorie", async () => {
    const rows: TypeRecipe[] = [{ id: 2, name: "Petit déjeuner", rate: 0 }];
    mockQuery(rows);
    const res = await supertest(app).get("/api/recipe/category/2");
    expect(res.status).toBe(200);
    expect(res.body).toStrictEqual(rows);
  });

  it("Devrait filtrer par régime", async () => {
    const rows: TypeRecipe[] = [{ id: 4, name: "Vegan", rate: 0 }];
    mockQuery(rows);
    const res = await supertest(app).get("/api/recipe/diet/4");
    expect(res.status).toBe(200);
    expect(res.body).toStrictEqual(rows);
  });

  it("Devrait filtrer par temps", async () => {
    const rows: TypeRecipe[] = [{ id: 17, name: "Crêpes Rapides", rate: 0 }];
    mockQuery(rows);
    const res = await supertest(app).get("/api/recipe/time/17");
    expect(res.status).toBe(200);
    expect(res.body).toStrictEqual(rows);
  });

  it("Devrait filtrer par difficulté", async () => {
    const rows: TypeRecipe[] = [{ id: 5, name: "Riz", rate: 0 }];
    mockQuery(rows);
    const res = await supertest(app).get("/api/recipe/difficulty/5");
    expect(res.status).toBe(200);
    expect(res.body).toStrictEqual(rows);
  });

  it("Devrait nous montrer les catégories pour l’accueil", async () => {
    const rows: TypeRecipe[] = [];
    mockQuery(rows);
    const res = await supertest(app).get("/api/accueil/category");
    expect(res.status).toBe(200);
    expect(res.body).toStrictEqual(rows);
  });
});

describe("PATCH /api/member", () => {
  it("Devrait modifier le profile du Membre", async () => {
    const hashedPassword = bcrypt.hashSync("123", 8);

    const dbMember = {
      id: 192,
      name: "Jean",
      email: "jeannot@example.com",
      password: hashedPassword,
      admin: false,
    };

    const updatedMember = {
      id: 192,
      name: "Jean",
      email: "jeannot@example.com",
      password: hashedPassword,
      admin: false,
    };

    const token = jwt.sign(
      { id: dbMember.id, admin: dbMember.admin },
      process.env.JWT_SECRET as string,
    );

    mockQuery([dbMember]);

    (jest.spyOn(databaseClient, "query") as jest.Mock).mockResolvedValueOnce({
      rows: [dbMember],
    } as QueryResult<Member>);

    const res = await supertest(app)
      .patch("/api/member")
      .set("Authorization", token)
      .send({
        id: 192,
        name: "Jean",
        email: "jeannot@example.com",
        password: "123",
        admin: false,
      });
    expect(res.status).toBe(200);
    expect(res.body).toStrictEqual(updatedMember);
  });
});

describe("DELETE /api/admin/208", () => {
  it("Devrait Suprimer un Compte externe en temps qu'Admin", async () => {
    const testMember = {
      id: 192,
      name: "Jean",
      email: "jeannot@example.com",
      password: bcrypt.hashSync("123", 8),
      admin: true,
    };

    const token = jwt.sign(
      { id: testMember.id, admin: testMember.admin },
      process.env.JWT_SECRET as string,
    );

    mockQuery([testMember]);

    const res = await supertest(app)
      .delete("/api/admin/208")
      .set("Authorization", token);
    expect(res.status).toBe(200);
  });
});

describe("POST /api/signup", () => {
  it("Devrait créer un compte Membre", async () => {
    const testMember = {
      name: "Alice",
      email: "alice@example.com",
      password: "123",
    };

    const hashPassword = bcrypt.hashSync("123", 8);

    mockQuery([
      {
        id: 999,
        name: testMember.name,
        email: testMember.email,
        password: hashPassword,
        admin: false,
      },
    ]);

    const res = await supertest(app).post("/api/signup").send(testMember);
    expect(res.status).toBe(201);
    expect(res.body.userId).toBe(999);
    expect(res.body.isAdmin).toBe(false);
  });
});

supertest(app);
