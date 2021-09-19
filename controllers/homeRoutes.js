const router = require("express").Router();
const { User, Post, Comment } = require("../models");
const withAuth = require("../utils/auth");

router.get("/", withAuth, async (req, res) => {
  // console.log(req.session, "homepage render");

  if (req.session) {
    console.log("\n user name is \n", req.session);
  }
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
    console.log("\nusername is\n", req.session.userName);
    console.log(posts[0]);
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
  console.log("\nin login \n", req.session);

  if (req.session.logged_in) {
    console.log("\nin login \n", req.session);

    res.redirect("/");
    return;
  }
  // else login
  res.render("login");
});
router.get("/register", (req, res) => {
  if (req.session.logged_in) {
    res.redirect("/");
    return;
  }
  // else login
  res.render("homePage");
});

router.get("/profile", withAuth, async (req, res) => {
  const findUser = await User.findOne({
    where: {
      id: req.session.user_id,
    },
  });

  const currentUser = await findUser.get({ plain: true });
  console.log("i am in profile request", currentUser);

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

  console.log("\n user posts are \n", blogPosts);
  res.render("profile", {
    blogPosts,
    logged_in: req.session.logged_in,
    currentUser,
  });
});

router.get("/post/:id", (req, res) => {
  console.log(req.session, "post testing");
  Post.findOne({
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
  })
    .then((dbPostData) => {
      if (!dbPostData) {
        res.status(404).json({ message: "No post found with this id" });
        return;
      }

      // serialize the data
      const post = dbPostData.get({ plain: true });
      console.log("\n iam here \n ", post);
      // pass data to template
      res.render("singlePost", {
        post,
        logged_in: req.session.logged_in,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;