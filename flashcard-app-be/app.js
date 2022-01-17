const express = require("express");
const router = new express.Router();
const { v4: uuid } = require("uuid");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const { client } = require("./config.js");
const jwt = require("jsonwebtoken");

app.use(bodyParser.json());

jwt.sign(
  {
    exp: Math.floor(Date.now() / 1000) + 60 * 60,
    data: {},
  },
  "secret"
);

client.connect(function (err, db) {
  app.locals.db = db;

  router.post("login", (req, res) => {});

  router.post("create/account", (req, res) => {});

  router.get("/deck", (req, res) => {
    return "Hello";
  });

  router.post("/create/deck", (req, res) => {
    const newDeck = req.body;
    console.dir(req.body);
    let deckId;
    app.locals.db
      .db()
      .collection("decks")
      .insertOne(newDeck, function (err, result) {
        if (err) throw err.trace;
        deckId = newDeck._id;
        console.log(`New deck created successfully with _id of ${deckId}`);
        res.json(result);
      });
  });

  router.post("/create/flashcard", async (req, res) => {
    const { deckId } = req.body.flashcard;
    const query = { _id: deckId };
    const deck = await app.locals.db.db().collection("decks").findOne(query);
    const updatedDeck = [...deck.flashcards, req.body.flashcard];
    const newVals = { $set: { flashcards: updatedDeck } };
    app.locals.db
      .db()
      .collection("decks")
      .updateOne(query, newVals, { upsert: false }, function (err, result) {
        if (err) throw err;
        res.json(result);
      });
  });

  router.post("/edit/flashcard", async (req, res) => {
    const { deckId, flashcardId } = req.body.flashcard;
    const query = { _id: deckId };
    const deck = await app.locals.db.db().collection("decks").findOne(query);
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

  router.delete("/delete/flashcard", async (req, res) => {
    const { deckId, flashcardId } = req.body.flashcard;
    const query = { _id: deckId };
    const deck = await app.locals.db.db().collection("decks").findOne(query);
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

  router.delete("/delete/deck", (req, res) => {
    return "Hello";
  });

  app.use(router);
});

module.exports = app;
