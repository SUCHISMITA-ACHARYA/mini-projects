const mongoose = require("mongoose")

const videoSchema = new mongoose.Schema({
  filename: String,
  status: String,
  userId: String
})

module.exports = mongoose.model("Video", videoSchema)
