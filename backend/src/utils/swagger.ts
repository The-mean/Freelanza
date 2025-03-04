import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';
import { logger } from './logger';

// OpenAPI specification
const swaggerDocument = {
    openapi: '3.0.0',
    info: {
        title: 'Freelanza API',
        version: '1.0.0',
        description: 'Freelanza platformu için RESTful API dokümantasyonu',
        contact: {
            name: 'Freelanza API Desteği',
            url: 'https://freelanza.com/api-docs',
            email: 'api@freelanza.com',
        },
    },
    servers: [
        {
            url: 'http://localhost:{port}/api',
            description: 'Yerel geliştirme sunucusu',
            variables: {
                port: {
                    default: '5000',
                },
            },
        },
        {
            url: 'https://api.freelanza.com/api',
            description: 'Üretim API sunucusu',
        },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
    },
    security: [
        {
            bearerAuth: [],
        },
    ],
    tags: [
        {
            name: 'Auth',
            description: 'Kullanıcı doğrulama ve yetkilendirme',
        },
        {
            name: 'Users',
            description: 'Kullanıcı yönetimi',
        },
        {
            name: 'Profiles',
            description: 'Kullanıcı profil yönetimi',
        },
        {
            name: 'Jobs',
            description: 'İş ilanları yönetimi',
        },
        {
            name: 'Proposals',
            description: 'İş teklifleri yönetimi',
        },
        {
            name: 'Contracts',
            description: 'Sözleşme yönetimi',
        },
        {
            name: 'Payments',
            description: 'Ödeme işlemleri',
        },
        {
            name: 'Reviews',
            description: 'Değerlendirme ve yorumlar',
        },
    ],
    paths: {},
};

export const swaggerDocs = (app: Express) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    // API dökümantasyonu JSON endpoint'i
    app.get('/api-docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerDocument);
    });

    logger.info(`Swagger docs available at http://localhost:${process.env.PORT || 5000}/api-docs`);
}; 