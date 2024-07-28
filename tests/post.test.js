const mongoose = require("mongoose");
const Post = require("../models/post");
const User = require("../models/user");

// first connects to database
beforeAll(async () => {
  await mongoose.connect("mongodb://localhost:27017/blogPlatformTest", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// close db after all tests have run
afterAll(async () => {
  await mongoose.connection.close();
});

// clear post and user data prior to tests to ensure clean slate
beforeEach(async () => {
  await Post.deleteMany({});
  await User.deleteMany({});
});

// clear post and user data after tests to ensure clean slate
afterEach(async () => {
  await Post.deleteMany({});
  await User.deleteMany({});
});

// define test suite for Post model
describe("Post Model", () => {
  let user;

  // create dummy user
  beforeEach(async () => {
    user = new User({ username: "testuser", password: "password123" });
  });

  // Test Case: should create post successfully
  it("should create a new post successfully", async () => {
    // create new post instance
    const post = new Post({
      title: "test title",
      content: "foo bar baz",
      author: user,
    });

    await post.save();
    expect(post.isNew).toBe(false);
    expect(post.title).toBe("test title");
    expect(post.content).toBe("foo bar baz");
    expect(post.author.username).toBe("testuser");
  });
});
