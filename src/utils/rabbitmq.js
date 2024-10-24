const amqp = require('amqplib');

let channel;

const connectRabbitMQ = async () => {
    try {
        const connection = await amqp.connect(process.env.RABBITMQ_URL);
        channel = await connection.createChannel();
        console.log('Conectado a RabbitMQ');
    } catch (error) {
        console.error('Error al conectar a RabbitMQ:', error);
    }
};

const getChannel = () => {
    if (!channel) {
        throw new Error('No hay canal de RabbitMQ');
    }
    return channel;
};

module.exports = { connectRabbitMQ, getChannel };
