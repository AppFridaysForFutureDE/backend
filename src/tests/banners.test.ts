import * as dbHandler from "./test-db-handler";
import { Banner } from "../models/bannersModel";
import { app } from "../express/app";
import request from "supertest";

beforeAll(async () => await dbHandler.establishConnection());
afterEach(async () => await dbHandler.clearDatabase());
afterAll(async () => await dbHandler.closeDatabase());

describe("GET /api/v1/home", () => {
  beforeEach(async () => {
    const campaignBanner = new Banner({
      imageUrl: 'https://app.fffutu.re/img/einskommafuenf.png',
      link: 'https://fridaysforfuture.de',
      inApp: true,
      campaignBanner: true,
    });
    await campaignBanner.save();
  });

  it("returns no banner if there is only a campaign banner", async () => {
    const response = await request(app).get("/api/v1/home");
    expect(response.status).toBe(200);
    expect(response.body.banner["imageUrl"]).toBe("");
    expect(response.body.banner["link"]).toBe("");
  });

  it("returns the correct banner", async () => {
    const homeBanner = new Banner({
      imageUrl: 'https://app.fffutu.re/img/kein-grad-weiter.png',
      link: 'https://fridaysforfuture.de/forderungen/',
      inApp: true,
      campaignBanner: false,
    });
    await homeBanner.save();

    const response = await request(app).get("/api/v1/home");
    expect(response.status).toBe(200);
    expect(response.body.banner["imageUrl"]).toBe("https://app.fffutu.re/img/kein-grad-weiter.png");
    expect(response.body.banner["link"]).toBe("https://fridaysforfuture.de/forderungen/");
  });
});
