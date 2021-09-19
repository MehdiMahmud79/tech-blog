const dbConnection = require("../config/connection");
const { User, Post, Comment } = require("../models");

const userData = require("./userData.json");
const postData = require("./postData.json");
const commentData = require("./commentData.json");

const seedDatabase = async () => {
  await dbConnection.sync({ force: true });
  console.log("DB Flashed");

  await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });
  console.log("Users Added");

  await Post.bulkCreate(postData);
  console.log("Post Added");
  await Comment.bulkCreate(commentData);
  console.log("Comment Added");

  process.exit(0);
};

seedDatabase();
