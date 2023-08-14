import app, { init } from "@/app";
import httpStatus from "http-status";
import { cleanDb } from "../helpers";
import userService from "@/services/users-service";

beforeAll(async () => {
  await init();
  await cleanDb();
});


describe("POST /auth/git-sign-in", () => {
  it("should return 401 UNAUTHORIZED if user sent wrong git code", async () => {
    const res = await userService.gitUserToken("wrong code");
    expect(res).toBe(null);
  });
  it("should return 401 UNAUTHORIZED whem user send wrong token", async () => {
    const res = await userService.gitUserToken("wrong code");
    expect(res).toBe(null);
  });
});

