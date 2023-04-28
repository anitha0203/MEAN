const express = require("express");
const multer = require("multer")
const postControllers = require('../controllers/posts')
const router = express.Router();
const checkAuth = require("../middleware/check-auth")

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype]
        let error = new Error("Invalid mime type");
        if (isValid) {
            error = null
        }
        cb(error, "backend/images")
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype]
        cb(null, name + '-' + Date.now() + '.' + ext)
    }
})

router.post("/api/posts",checkAuth, multer({storage: storage}).single("image"), postControllers.createPost)

router.use('/api/posts', postControllers.usee)

router.get("/api/getId", postControllers.getPosts)

router.get("/api/getId/:id", postControllers.getPostsById)

router.put('/api/update/:id',checkAuth, multer({storage: storage}).single("image"), postControllers.updatePost)

router.delete("/api/post/:id",checkAuth, postControllers.deletePost)

module.exports = router;