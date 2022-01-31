const express = require("express");
const router = new express.Router();
const { v4: uuid } = require("uuid");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const { client } = require("./config.js");
const jwt = require("jsonwebtoken");
const User = require("./models/userModels");
const asyncHandler = require("express-async-handler");
app.use(bodyParser.json());
const bcrypt = require("bcryptjs");
const { create, validate } = require("./models/userModels");

//TODO need to handle error if JWT is expired

let today = new Date();
const dd = String(today.getDate()).padStart(2, "0");
const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
const yyyy = today.getFullYear();

today = mm + "/" + dd + "/" + yyyy;

const generateToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

const verifyToken = token => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

const validateHeaders = (req, res, next) => {
  if (!verifyToken(req.headers.authorization.split(" ")[1])) {
    res.json(400);
  }
  console.log("JWT in header verified");
  next();
};

client.connect(async function (err, db) {
  app.locals.db = db.db("sandbox");

  router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await app.locals.db
      .collection("users")
      .findOne({ email }, { password: 1 });
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        email: user.email,
        token: generateToken(user._id),
        success: true,
      });
    } else {
      res.json({
        success: false,
      });
    }
  });

  router.post("/create/account", async (req, res) => {
    const { username, email, password } = req.body;

    const userExists = await app.locals.db
      .collection("users")
      .findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await app.locals.db.collection("users").insertOne({
      username,
      email,
      password: hashedPassword,
      decks: { createdDecks: [], subscribedToDecks: [] },
    });
    if (user) {
      res.status(201).json({
        _id: user.id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
      });
    } else {
      res.status(400);
      throw new Error("Error occurred during signup");
    }
  });

  router.post("/edit/password", validateHeaders, (req, res) => {});

  router.get("/deck", (req, res) => {
    return "Hello";
  });

  router.post("/create/deck", validateHeaders, async (req, res) => {
    let finalRes;
    const newDeck = req.body;
    console.dir(req.body);
    let deckId;
    await app.locals.db
      .collection("decks")
      .insertOne(newDeck, function (err, result) {
        if (err) throw err.trace;
        deckId = newDeck._id;
        console.log(`New deck created successfully with _id of ${deckId}`);
        finalRes = result;
      });
    const createdByUser = await app.locals.db
      .collection("users")
      .findOne({ email: JSON.parse(req.body.createdByEmail) });
    console.dir(createdByUser);
    const newVals = {
      $set: {
        ...createdByUser,
        decks: {
          createdDecks: [
            ...createdByUser.decks.createdDecks,
            {
              deckId,
              deckTitle: newDeck.deckTitle,
              createdDate: today,
              categories: ["defaultCategory"],
            },
          ],
          subscribedToDecks: createdByUser.decks.subscribedToDecks || [],
        },
      },
    };
    app.locals.db
      .collection("users")
      .updateOne(
        { email: JSON.parse(req.body.createdByEmail) },
        newVals,
        { upsert: false },
        function (err, result) {
          if (err) throw err;
          res.json(finalRes);
        }
      );
  });

  router.get("/view/decks", validateHeaders, async (req, res) => {
    const userEmail = req.query.email;
    let foundDecks = [];
    const dbDecks = await app.locals.db
      .collection("users")
      .findOne({ email: userEmail });
    for (const deck of dbDecks.decks.createdDecks) {
      let { deckId, deckTitle, createdDate, categories } = deck;
      console.dir({ deckId, deckTitle });
      foundDecks.push({
        deckId,
        deckTitle,
        createdDate,
        categories,
      });
    }
    res.send(JSON.stringify(foundDecks));
  });

  router.get("/view/decks/:id", async (req, res) => {
    const deckId = req.params.id;
    const query = { _id: deckId };
    const deck = await app.locals.db.collection("decks").findOne(query);
    res.json(deck);
  });

  router.post("/create/flashcard", validateHeaders, async (req, res) => {
    const { deckId } = req.body.flashcard;
    const query = { _id: deckId };
    const deck = await app.locals.db.collection("decks").findOne(query);
    const updatedDeck = [...deck.flashcards, req.body.flashcard];
    const newVals = { $set: { flashcards: updatedDeck } };
    app.locals.db
      .collection("decks")
      .updateOne(query, newVals, { upsert: false }, function (err, result) {
        if (err) throw err;
        res.json(result);
      });
  });

  router.post("/edit/flashcard", validateHeaders, async (req, res) => {
    const { deckId, flashcardId } = req.body.flashcard;
    const query = { _id: deckId };
    const deck = await app.locals.db.collection("decks").findOne(query);
    const deckMinusUpdatedFlashcard = deck.flashcards.filter(
      d => d.flashcardId !== flashcardId
    );
    const updatedDeck = [...deckMinusUpdatedFlashcard, req.body.flashcard];
    const newVals = { $set: { flashcards: updatedDeck } };
    app.locals.db
      .db()
      .collection("decks")
      .updateOne(query, newVals, function (err, result) {
        if (err) throw err;
        res.json(result);
      });
  });

  router.delete("/delete/flashcard", validateHeaders, async (req, res) => {
    const { deckId, flashcardId } = req.body.flashcard;
    const query = { _id: deckId };
    const deck = await app.locals.db.collection("decks").findOne(query);
    const deckMinusDeletedFlashcard = deck.flashcards.filter(
      d => d.flashcardId !== flashcardId
    );
    const newVals = { $set: { flashcards: deckMinusDeletedFlashcard } };
    app.locals.db
      .db()
      .collection("decks")
      .updateOne(query, newVals, function (err, result) {
        if (err) throw err;
        res.json(result);
      });
  });

  router.delete("/delete/deck", validateHeaders, async (req, res) => {
    const { deckId, email } = req.body;
    const query = { _id: deckId };
    const deck = await app.locals.db.collection("decks").deleteOne(query);
    const createdByUser = await app.locals.db
      .collection("users")
      .findOne({ email: userEmail });
    let updatedCreatedDecks = dbDecks.decks.createdDecks.filter(deck => {
      return deck.deckId !== deckId;
    });

    const newVals = {
      $set: {
        ...createdByUser,
        decks: {
          createdDecks: updatedCreatedDecks,
          subscribedToDecks: createdByUser.decks.subscribedToDecks || [],
        },
      },
    };

    await app.locals.db
      .collection("users")
      .updateOne({ email: userEmail }, newVals);
    return res.status(204);
  });

  app.use(router);
});

module.exports = app;
