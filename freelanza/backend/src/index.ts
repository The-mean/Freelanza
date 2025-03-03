import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import 'dotenv/config';
import { errorHandler } from './middleware/errorHandler';
import routes from './routes';
import { logger } from './utils/logger';
import { swaggerDocs } from './utils/swagger';

// App değişkeni
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware'ler
app.use(helmet()); // Güvenlik başlıkları
app.use(cors()); // CORS yapılandırması
app.use(express.json()); // JSON parser
app.use(express.urlencoded({ extended: true })); // URL parser
app.use(morgan('dev')); // Logging

// API rotaları
app.use('/api', routes);

// Swagger dokümantasyonu
swaggerDocs(app);

// Hata yakalama
app.use(errorHandler);

// 404 yakalama
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Sunucuyu başlatma
app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});

export default app; 