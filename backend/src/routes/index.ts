import { Router } from 'express';
import authRoutes from './auth.routes';
// import userRoutes from './user.routes';
// import profileRoutes from './profile.routes';
// import jobRoutes from './job.routes';
// import proposalRoutes from './proposal.routes';
// import paymentRoutes from './payment.routes';
// import reviewRoutes from './review.routes';

const router = Router();

// Ana route
router.get('/', (req, res) => {
    res.json({
        message: 'Freelanza API',
        version: '1.0.0',
        documentation: '/api-docs',
    });
});

// API Routes
router.use('/auth', authRoutes);
// router.use('/users', userRoutes);
// router.use('/profiles', profileRoutes);
// router.use('/jobs', jobRoutes);
// router.use('/proposals', proposalRoutes);
// router.use('/payments', paymentRoutes);
// router.use('/reviews', reviewRoutes);

export default router; 