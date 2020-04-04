import { dbHandler } from "./db-handler";
import { Og } from "../src/models/ogs";

/**
 * Connect to a new in-memory database before running any tests.
 */
beforeAll(async () => await dbHandler.connect());

/**
 * Clear all test data after every test.
 */
afterEach(async () => await dbHandler.clearDatabase());

/**
 * Remove and close the db and server.
 */
afterAll(async () => await dbHandler.closeDatabase());

/**
 * Product test suite.
 */
describe("product ", () => {

  /**
   * Tests that a valid product can be created through the productService without throwing any errors.
   */
  it("can be created correctly", async () => {
    // expect(async () => await productService.create(productComplete))
    //     .not
    //     .toThrow();
    const newOg = new Og({
      ogId: "test",
      name: "MeinOgName"
    });

    await newOg.save();

    // const users = db.collection('users');

    // const mockUser = {_id: 'some-user-id', name: 'John'};
    // await users.insertOne(mockUser);

    const insertedUser = await Og.find({})
    // users.findOne({_id: 'some-user-id'});
    console.log(insertedUser)
    expect(insertedUser).toEqual(newOg);
  });
});
