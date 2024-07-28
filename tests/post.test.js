const mongoose = require("mongoose");
const Post = require("../models/post");

// first connects to database
beforeAll(async () => {
  await mongoose.connect("mongodb://localhost:27017/blogPlatformTest", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});
