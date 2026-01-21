const router = require("express").Router()
const multer = require("multer")
const Video = require("../models/Video")

const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname)
})

const upload = multer({ storage })

module.exports = (io) => {
  router.post("/upload", upload.single("video"), async (req, res) => {
    const video = await Video.create({
      filename: req.file.filename,
      status: "processing",
      userId: "demo"
    })

    let progress = 0

    const interval = setInterval(async () => {
      progress += 20
      io.emit("progress", progress)

      if (progress >= 100) {
        clearInterval(interval)
        video.status = "safe"
        await video.save()
      }
    }, 1000)

    res.json({ message: "Upload started" })
  })

  router.get("/list", async (req, res) => {
    const videos = await Video.find()
    res.json(videos)
  })

  return router
}
