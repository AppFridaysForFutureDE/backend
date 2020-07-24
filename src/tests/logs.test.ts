import * as dbHandler from "./test-db-handler";
import { Log } from "../models/logModel";
import LogManager from "../LogManager";

beforeAll(async () => {
    await dbHandler.establishConnection();
});
afterEach(async () => await dbHandler.clearDatabase());
afterAll(async () => await dbHandler.closeDatabase());

describe("read logs", () => {
    it("Should read the log correctly", async () => {
        await Log.create({
            username: "name",
            time: 1595603717,
            method: "GET",
            endpoint: "/test/path?param=value"
        });
        const result = await LogManager.readLogs();
        expect(result[0].action == "GET /test/path?param=value");
        expect(result[0].user == "name");
        expect(result[0].time == "2020-7-24 15:15:14");//GMT is used
    });
});

describe("clear logs", () => {
    it("Should delete the log", async () => {
        await Log.create({
            username: "name",
            time: 6789,
            method: "GET",
            endpoint: "/test/path?param=value"
        });
        await LogManager.cleanLogs();
        const result = await LogManager.readLogs();
        expect(result.length == 0);
    });
    it("Should not delete the log", async () => {
        await Log.create({
            username: "name",
            time: 1595603717,
            method: "GET",
            endpoint: "/test/path?param=value"
        });
        const result = await LogManager.readLogs();
        expect(result.length == 1);
    });
});