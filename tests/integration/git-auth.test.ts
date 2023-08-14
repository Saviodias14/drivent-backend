import app, { init } from "@/app";
import faker from "@faker-js/faker";
import httpStatus from "http-status";
import supertest from "supertest";
import { createUser } from "../factories";
import { cleanDb } from "../helpers";

beforeAll(async () => {
  await init();
  await cleanDb();
});

const server = supertest(app);

describe("POST /auth/git-sign-in", () => {
  it("should return 401 UNAUTHORIZED if user sent wrong git code", async () => {
    const res = await server.post("/auth/git-sign-in").send({ code: "123" });
    expect(res.status).toBe(httpStatus.UNAUTHORIZED);
  });
  it("should return 422 UNPROCESSABLE_ENTITY whem user send empty code", async () => {
    const res = await server.post("/auth/git-sign-in").send({ code: "" });
    expect(res.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
  });
});

