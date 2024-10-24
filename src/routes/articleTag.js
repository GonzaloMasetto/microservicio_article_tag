const express = require('express');
const router = express.Router();
const articleTagController = require('../controllers/articleTagController'); 
const authMiddleware = require('../middleware/authMiddleware');

// Todas las rutas de perfil requerirán autenticación

router.get('/', authMiddleware, articleTagController.getArticleTag);
router.post('/:id', authMiddleware, articleTagController.createOrUpdateArticleTag);
router.get('/:articleId/tags', articleTagController.getTags);

module.exports = router;
