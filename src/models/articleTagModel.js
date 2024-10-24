const mongoose = require('mongoose');

const articleTagSchema = new mongoose.Schema({
    articleId: { type: String, required: true, unique: true },
    tags: [String],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const ArticleTag = mongoose.model('ArticleTag', articleTagSchema);

module.exports = ArticleTag;
