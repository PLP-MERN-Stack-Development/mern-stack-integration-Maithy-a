const Post = require('../models/Post');
const { validationResult } = require('express-validator');

exports.listPosts = async (req, res, next) => {
    try {
        const { page = 1, limit = 12, q, category, author } = req.query;
        const skip = (page - 1) * limit;
        const filter = {};
        if (q) filter.$or = [{ title: new RegExp(q, 'i') }, { content: new RegExp(q, 'i') }];
        if (category) filter.category = category;
        if (author) filter.author = author;

        const posts = await Post.find(filter)
            .populate('author', 'name email')
            .populate('category', 'name slug')
            .sort({ createdAt: -1 })
            .skip(Number(skip))
            .limit(Number(limit));

        const total = await Post.countDocuments(filter);
        res.json({ data: posts, meta: { total, page: Number(page), limit: Number(limit) } });
    } catch (err) { next(err); }
};

exports.getPost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('author', 'name email')
            .populate('category', 'name slug');
        if (!post) return res.status(404).json({ message: 'Post not found' });
        // increment view count (non-blocking)
        post.incrementViewCount().catch(() => { });
        res.json(post);
    } catch (err) { next(err); }
};

exports.createPost = async (req, res, next) => {
    try {
        // validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { title, content, excerpt, category, tags = [], isPublished } = req.body;
        const featuredImage = req.file ? req.file.path : undefined;

        const post = new Post({
            title,
            content,
            excerpt,
            category,
            tags: Array.isArray(tags) ? tags : (typeof tags === 'string' ? tags.split(',').map(t => t.trim()) : []),
            isPublished: !!isPublished,
            featuredImage,
            author: req.user.id
        });

        await post.save();
        res.status(201).json(post);
    } catch (err) { next(err); }
};

exports.updatePost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });
        if (post.author.toString() !== req.user.id) return res.status(403).json({ message: 'Forbidden' });

        const allowed = ['title', 'content', 'excerpt', 'category', 'tags', 'isPublished'];
        allowed.forEach((k) => {
            if (req.body[k] !== undefined) post[k] = req.body[k];
        });

        if (req.file) post.featuredImage = req.file.path;

        await post.save();
        res.json(post);
    } catch (err) { next(err); }
};

exports.deletePost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });
        if (post.author.toString() !== req.user.id) return res.status(403).json({ message: 'Forbidden' });

        await post.deleteOne();
        res.json({ message: 'Post deleted' });
    } catch (err) { next(err); }
};
