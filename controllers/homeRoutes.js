const router = require("express").Router();
const { User, Post, Comment } = require("../models");
const withAuth = require("../utils/auth");

router.get("/", async (req, res) => {
  try {
    const dbPostData = await Post.findAll({
      attributes: ["id", "user_id", "title", "content", "date_created"],
      include: [
        {
          model: User,
          attributes: ["userName"],
        },
        {
          model: Comment,
          attributes: ["id", "content", "post_id", "user_id", "date_created"],
          include: {
            model: User,
            attributes: ["userName"],
          },
        },
      ],
    });
    // In the homepage template pass a single post object
    const posts = dbPostData.map((post) => post.get({ plain: true }));
    res.render("homePage", {
      posts,
      userName: req.session.userName,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get("/login", withAuth, (req, res) => {
  if (req.session.logged_in) {
    res.redirect("/");
    return;
  }
  res.render("login");
});

router.get("/register", (req, res) => {
  if (req.session.logged_in) {
    res.redirect("/");
    return;
  }
  res.render("register");
});

router.get("/newPost", withAuth, (req, res) => {
  res.render("newPost", {
    userName: req.session.userName,
    logged_in: req.session.logged_in,
  });
});

router.get("/comment/:id", withAuth, async (req, res) => {
  try {
    const postById = await Post.findOne({
      where: {
        id: req.params.id,
      },
      attributes: ["id", "title", "content", "date_created"],
      include: [
        {
          model: Comment,
          attributes: ["id", "content", "post_id", "user_id", "date_created"],
          include: {
            model: User,
            attributes: ["userName"],
          },
        },
        {
          model: User,
          attributes: ["userName"],
        },
      ],
    });
    if (!postById) {
      res.status(404).json({ message: "No post found with this id" });
      return;
    }
    const post = postById.get({ plain: true });
    // pass data to template
    res.render("makeComment", {
      post,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get("/profile", withAuth, async (req, res) => {
  const findUser = await User.findOne({
    where: {
      id: req.session.user_id,
    },
  });

  const currentUser = await findUser.get({ plain: true });
  const userPosts = await Post.findAll({
    where: {
      user_id: req.session.user_id,
    },
    include: [
      {
        model: User,
        attributes: ["userName"],
      },
      {
        model: Comment,
        include: [User],
        attributes: {
          exclude: ["password"],
        },
      },
    ],
    order: [["date_created", "DESC"]],
  });

  const blogPosts = userPosts.map((post) => post.get({ plain: true }));
  res.render("profile", {
    blogPosts,
    logged_in: req.session.logged_in,
    currentUser,
  });
});

router.get("/post/:id", withAuth, async (req, res) => {
  try {
    const postById = await Post.findOne({
      where: {
        id: req.params.id,
      },
      attributes: ["id", "title", "content", "date_created"],
      include: [
        {
          model: Comment,
          attributes: ["id", "content", "post_id", "user_id", "date_created"],
          include: {
            model: User,
            attributes: ["userName"],
          },
        },
        {
          model: User,
          attributes: ["userName"],
        },
      ],
    });
    if (!postById) {
      res.status(404).json({ message: "No post found with this id" });
      return;
    }
    const post = postById.get({ plain: true });
    // pass data to template
    res.render("updatePost", {
      post,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});
    
module.exports = router;