import * as dbHandler from "./test-db-handler";
import { Comment } from "../models/commentModel";
import { app } from "../express/app";
import request from "supertest";

beforeAll(async () => await dbHandler.establishConnection());
afterEach(async () => await dbHandler.clearDatabase());
afterAll(async () => await dbHandler.closeDatabase());

describe("POST /api/v1/comments", () => {
  const content =
    "Hallöchen, ich bins der Luke Skywalker. Super Artikel, ganz zauberhaft!";

  it("saves comment", async () => {
    const response = await request(app).post("/api/v1/comments").send({
      name: "luke",
      age: 24,
      content: content,
      publish: false,
      articleReference: "Klimawandel im Erzgebirge",
    });

    expect(response.statusCode).toBe(302);
    const comments = await Comment.find({});
    expect(comments).toHaveLength(1);
    expect(comments[0].content).toBe(1);
    expect(comments[0].publish).toBe(false);
    expect(comments[0].age).toBe(24);
  });
});
