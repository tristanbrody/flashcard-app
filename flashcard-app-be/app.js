const express = require("express");
const router = new express.Router();
const { v4: uuid } = require("uuid");

const cors = require("cors");

app.use(cors());

module.exports = app;
