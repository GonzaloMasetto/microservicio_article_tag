const ArticleTag = require('../models/articleTagModel');
const axios = require('axios')
const { Op, where } = require('sequelize');

// Obtener  los articulos para el perfil con tags
const getArticleTag = async (req, res) => {

    const token = req.headers.authorization;

    try {
        
        const response = await axios.get('http://localhost:3005/api/profiles', {
            headers:{
                Authorization: token
            }
        })

        const userTags = response.data.tags

        const articleTags = await ArticleTag.find({
            tags: { $in: userTags }  // Filtrar los tags que coincidan
        });

        res.status(200).json(articleTags)
    } catch (error) {
        console.error('Error al obtener los tags:', error.message);
        res.status(500).json({ error: 'Error al obtener los tags del perfil' });
    }

};

// Obtener  las tags de un articulo
const getTags = async (req, res) => {
    const articleId = req.params.articleId;

    try {
        // Buscar las tags asociadas al articleId
        const articleTags = await ArticleTag.find({
            articleId: articleId
        });

        // Extraer solo el campo 'tags' del resultado
        const tags = articleTags.map(articleTag => articleTag.tags).flat();

        res.status(200).json(tags);
    } catch (error) {
        console.error('Error al obtener los tags:', error.message);
        res.status(500).json({ error: 'Error al obtener los tags del artículo.' });
    }
};


// Crear o editar article tag
const createOrUpdateArticleTag = async (req, res) => {
    const articleId  = req.params.id;
    const userPermissions = req.user.permissions; // Tomamos el userId del token autenticado
    const tags = req.body;

    try {
        
        if (!userPermissions.includes("admin")) {
            res.status(401);
        }
        

        let articleTag = await ArticleTag.findOne({ articleId });

        if (articleTag) {
            // Actualizar el perfil existente
            articleTag.tags = tags;
            articleTag.updatedAt = Date.now();
            await articleTag.save();
            return res.json(articleTag);
        }

        // Crear nuevo perfil
        articleTag = new ArticleTag({
            articleId,
            tags,
        });

        await articleTag.save();
        res.status(201).json(articleTag);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Exportamos todos los controladores
module.exports = {
    getArticleTag,
    getTags,
    createOrUpdateArticleTag,
    
};
