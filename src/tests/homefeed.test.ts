import * as dbHandler from "./test-db-handler";
import { feedItem } from '../models/feedItemModel';
import { app } from "../express/app";
import request from "supertest";

beforeAll(async () => await dbHandler.establishConnection());
afterEach(async () => await dbHandler.clearDatabase());
afterAll(async () => await dbHandler.closeDatabase());

describe("GET /api/v1/home", () => {

    it("returns the no feedItem", async () => {
        const response = await request(app).get("/api/v1/home");
        expect(response.status).toBe(200);
        expect(response.body.feed.length).toBe(0);
    });

    it("returns the correct feedItem", async () => {
        const newFeedItem = new feedItem({
            imageUrl: "https://app.fffutu.re/img/einskommafuenf.png",
            text: "Test text",
            cta: "Text Button",
            link: "https://fridaysforfuture.de",
            inApp: true,
        });
        await newFeedItem.save();

        const response = await request(app).get("/api/v1/home");
        expect(response.status).toBe(200);
        expect(response.body.feed[0]["imageUrl"]).toBe("https://app.fffutu.re/img/einskommafuenf.png");
        expect(response.body.feed[0].text).toBe("Test text");
        expect(response.body.feed[0].cta).toBe("Text Button");
        expect(response.body.feed[0].link).toBe("https://fridaysforfuture.de");
        expect(response.body.feed[0].inApp).toBe(true);
      });

      it("returns feeditems sorted", async () => {
        const firstFeedItem = new feedItem({
            imageUrl: "https://app.fffutu.re/img/einskommafuenf.png",
            text: "Test1",
            cta: "Text Button",
            link: "https://fridaysforfuture.de",
            inApp: true,
        });
        const secondFeedItem = new feedItem({
            imageUrl: "https://app.fffutu.re/img/einskommafuenf.png",
            text: "Test2",
            cta: "Text Button",
            link: "https://fridaysforfuture.de",
            inApp: true,
        });
        await firstFeedItem.save();
        await secondFeedItem.save();

        const response = await request(app).get("/api/v1/home");
        expect(response.status).toBe(200);
        expect(response.body.feed[0].text).toBe("Test2");
        expect(response.body.feed[1].text).toBe("Test1");
      });
});