var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ProjectSchema = new Schema({
  id: {
    type: String,
  },
  token: String,
  name: String,
  documentIds: [String],
  owner: String,
});

module.exports = mongoose.model("Project", ProjectSchema);
