const path = require("path");
const express = require("express");
const session = require("express-session");
const exphbs = require("express-handlebars");
const routes = require("./controllers");
const dbConnection = require("./config/connection");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const helpers = require("./utils/helpers");

const app = express();
const PORT = process.env.PORT || 3001;
app.set("port", PORT);
// Set up Handlebars.js engine
const hbs = exphbs.create({ helpers });
app.use(express.static(path.join(__dirname, "public")));

// Inform Express.js on which template engine to use
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
const sess = {
  name: "session",
  secret: "it is my blog keep the secret",
  cookie: {},
  resave: false,
  saveUninitialized: true,
  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
  store: new SequelizeStore({
    db: dbConnection,
  }),
};

app.use(session(sess));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);

// sync sequelize models to the database, then turn on the server
dbConnection.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
});
