var mongoose = require("mongoose");

var CampSchema = new mongoose.Schema({
  name: String,
  price: String,
  phone: String,
  vid: String,
  city: String,
  image: String,
  desc: String,
  loc: String,
  createdAt: { type: Date, default: Date.now },
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    username: String,
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "comment",
    },
  ],
});

module.exports = mongoose.model("Camp", CampSchema);
