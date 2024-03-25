var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var DocSchema = new Schema({
  id: {
    type: String,
  },
  projectId: String,
  version: Number,
  archived: Boolean,
  regionCode: String,
  languageCode: String,
  content: String,
  name: String,
});

module.exports = mongoose.model("Doc", DocSchema);
