const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'NEW-POLYGOGO',
            version: '1.0.0',
            description: 'NEW-POLYGOGO monopoly pero mejor',
        },
    },
    apis: ['./routes/*.js'],
};

const specs = swaggerJsdoc(options);

module.exports = specs;
