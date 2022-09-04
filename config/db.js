if (process.env.NODE_ENV == "production") {
  module.exports = { mongoURI: "mongodb+srv://israel:<07111995>@blogapp-prod.x5pnwe0.mongodb.net/?retryWrites=true&w=majority" }
} else {
  module.exports = { mongoURI: "mongodb://localhost/blogapp" }
}