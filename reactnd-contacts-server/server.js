const express = require("express");
const { Sequelize, DataTypes, Model } = require("sequelize");
const bodyParser = require("body-parser");
const cors = require("cors");
const config = require("./config");
const path = require("path");
const contacts = require("./contacts");

const app = express();

app.use(express.static("public"));
app.use(cors());

const sequelize = new Sequelize(
  'postgres://postgres:Jc.PSql159@database-1.c0iw87d0utum.us-east-1.rds.amazonaws.com:5432/postgres'
);

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
    },
    avatarURL: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: "User",
  }
);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/index.html"));
});

app.use((req, res, next) => {
  const token = req.get("Authorization");

  if (token) {
    req.token = token;
    next();
  } else {
    res.status(403).send({
      error:
        "Please provide an Authorization header to identify yourself (can be whatever you want)",
    });
  }
});

app.get("/contacts", async (req, res) => {
  res.send(contacts.defaultData.contacts.map((contact) => ({
    id: contact.id,
    name: contact.name,
    email: contact.email
  })));
});

app.delete("/contacts/:id", (req, res) => {
  res.send(contacts.remove(req.token, req.params.id));
});

app.post("/contacts", bodyParser.json(), (req, res) => {
  const { name, email } = req.body;

  if (name && email) {
    res.send(contacts.add(req.token, req.body));
  } else {
    res.status(403).send({
      error: "Please provide both a name and an email address",
    });
  }
});

app.listen(config.port, async () => {
  try {
    console.log("Connection has been established successfully.");
    console.log("Server listening on port %s, Ctrl+C to stop", config.port);
  } catch (error) {
    console.error("Unable to establish the connection:", error);
  }
});
