const mongoose = require('mongoose');

// Define the schema for posts
const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    content: {
      type: String,
      required: [true, 'Please provide content'],
    },
    featuredImage: {
      type: String,
      default: 'default-post.jpg',
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    excerpt: {
      type: String,
      maxlength: [200, 'Excerpt cannot be more than 200 characters'],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        content: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);


// Generate slug before validation happens
PostSchema.pre("validate", function (next) {
  if (!this.slug || this.isModified("title")) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w ]+/g, "")
      .replace(/ +/g, "-");
  }
  next();
});

// Ensure slug uniqueness even if titles repeat
PostSchema.pre('save', async function (next) {
  if (!this.isModified('slug')) return next();

  const existing = await this.constructor.findOne({ slug: this.slug });
  if (existing && existing._id.toString() !== this._id.toString()) {
    this.slug = `${this.slug}-${Date.now()}`;
  }
  next();
});

// Virtual field for URL
PostSchema.virtual('url').get(function () {
  return `/posts/${this.slug}`;
});

// Method: Add a comment
PostSchema.methods.addComment = function (userId, content) {
  this.comments.push({ user: userId, content });
  return this.save();
};

//  Method: Increment view count
PostSchema.methods.incrementViewCount = function () {
  this.viewCount += 1;
  return this.save();
};

module.exports = mongoose.model('Post', PostSchema);
