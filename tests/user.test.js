const mongoose = require("mongoose");
const User = require("../models/user");

// first connects to database
beforeAll(async () => {
  await mongoose.connect("mongodb://localhost:27017/blogPlatformTest", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// closes the connection to database after test is run
afterAll(async () => {
  await mongoose.connection.close();
});

// initially checks database and clears it if there's anything there
beforeEach(async () => {
  await User.deleteMany({});
});

// clears database at the end
afterEach(async () => {
  await User.deleteMany({});
});

// Define test suite for user model
describe("User Model", () => {
  // Test Case: it should create a user successfully
  it("should create a user", async () => {
    // create new user instance
    const user = new User({ username: "testuser", password: "password123" });
    // save user to database
    await user.save();
    // check if user was saved correctly
    expect(user.isNew).toBe(false); // if added again would the user be new?
    expect(user.username).toBe("testuser");
  });

  // Test Case: password should be hashed before saving
  it("should hash the password before saving", async () => {
    // new user instance
    const user = new User({ username: "testuser", password: "password123" });
    // save user to db
    await user.save();
    // user password should not be password123 it should be hashed
    expect(user.password).not.toBe("password123");
    // console.log(`hashed pw: ${user.password}`);
  });

  // Test Case: it should not create a user without a username
  it("should not create a user without a username", async () => {
    expect.assertions(1); // expect 1 assertion to be called in this test
    try {
      const user = new User({ password: "password123" });
      await user.save();
    } catch (error) {
      expect(error.errors.username).toBeDefined();
    }
  });

  // Test Case: should authenticate a user with the correct password
  it("should authenticate a user with the correct password", async () => {
    // create new user instance
    const user = new User({ username: "testuser", password: "password123" });
    await user.save();
    const isMatch = await user.comparePassword("password123");
    expect(isMatch).toBe(true);
  });

  // Test Case: should NOT authenticate a user with the correct password
  it("should not authenticate a user with the correct password", async () => {
    // create new user instance
    const user = new User({ username: "testuser", password: "password123" });
    await user.save();
    const isMatch = await user.comparePassword("password121");
    expect(isMatch).toBe(false);
  });
});
