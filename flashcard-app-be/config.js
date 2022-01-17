const { MongoClient } = require("mongodb");

const USERNAME = process.env.USERNAME;
const PASSWORD = process.env.PASSWORD;
const uri = `mongodb+srv://${USERNAME}:${PASSWORD}@sandbox.dqsvm.mongodb.net/sandbox?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let dbConnection;

module.exports = {
  client,
};

// module.exports = {
//   connection: (async function (callback) {
//     await client.connect(function (err, db) {
//       if (err || !db) {
//         return callback(err);
//       }
//       dbConnection = db.db("video");
//       console.log(dbConnection);
//       return dbConnection;
//     });
//   })(),
// };
