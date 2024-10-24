const axios = require('axios');

const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ msg: 'Token no proporcionado' });
    }

    try {
        // Llamada al servicio de Auth para obtener la información del usuario actual
        const response = await axios.get('http://localhost:3000/v1/users/current', {
            headers: {
                Authorization: token
            }
        });

        const userData = response.data;

        // Añadimos los datos del usuario a la request para usarlos en los controladores
        req.user = {
            id: userData.id,
            login: userData.login,
            name: userData.name,
            permissions: userData.permissions
        };

        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({ msg: 'Token inválido o error al validar con Auth' });
    }
};

module.exports = authMiddleware;
