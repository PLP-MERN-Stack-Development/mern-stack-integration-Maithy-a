const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const multer = require('multer');

const upload = multer({ dest: process.env.UPLOAD_DIR || 'uploads/' });

const auth = require('../middleware/auth');
const postCtrl = require('../controllers/postController');

// Public routes
router.get('/', postCtrl.listPosts);
router.get('/:id', postCtrl.getPost);

// Protected routes
router.post(
    '/',
    auth,
    upload.single('featuredImage'),
    [
        body('title').notEmpty().withMessage('Title required'),
        body('content').isLength({ min: 10 }).withMessage('Content too short'),
        body('category').notEmpty().withMessage('Category required')
    ],
    postCtrl.createPost
);

router.put('/:id', auth, upload.single('featuredImage'), postCtrl.updatePost);
router.delete('/:id', auth, postCtrl.deletePost);

module.exports = router;
