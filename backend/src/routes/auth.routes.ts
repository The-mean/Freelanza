import { Router } from 'express';
import { body } from 'express-validator';
import { register, login, refreshToken, logout, forgotPassword, resetPassword } from '../controllers/auth.controller';
import { validateRequest } from '../middleware/validateRequest';

const router = Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Kullanıcı kaydı
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - role
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *               role:
 *                 type: string
 *                 enum: [FREELANCER, CLIENT]
 *     responses:
 *       201:
 *         description: Kullanıcı başarıyla oluşturuldu
 *       400:
 *         description: Geçersiz giriş
 *       409:
 *         description: Bu email adresi zaten kullanılıyor
 */
router.post(
    '/register',
    [
        body('email')
            .isEmail()
            .withMessage('Geçerli bir email adresi girin'),
        body('password')
            .isLength({ min: 6 })
            .withMessage('Şifre en az 6 karakter olmalıdır'),
        body('role')
            .isIn(['FREELANCER', 'CLIENT'])
            .withMessage('Rol FREELANCER veya CLIENT olmalıdır'),
        validateRequest,
    ],
    register
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Kullanıcı girişi
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Giriş başarılı
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *                 user:
 *                   type: object
 *       401:
 *         description: Hatalı kimlik bilgileri
 */
router.post(
    '/login',
    [
        body('email')
            .isEmail()
            .withMessage('Geçerli bir email adresi girin'),
        body('password')
            .notEmpty()
            .withMessage('Şifre gerekli'),
        validateRequest,
    ],
    login
);

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: Access token yenileme
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token yenilendi
 *       401:
 *         description: Geçersiz veya süresi dolmuş token
 */
router.post(
    '/refresh-token',
    [
        body('refreshToken')
            .notEmpty()
            .withMessage('Refresh token gerekli'),
        validateRequest,
    ],
    refreshToken
);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Çıkış yapma
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Başarıyla çıkış yapıldı
 *       401:
 *         description: Geçersiz token
 */
router.post(
    '/logout',
    [
        body('refreshToken')
            .notEmpty()
            .withMessage('Refresh token gerekli'),
        validateRequest,
    ],
    logout
);

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Şifre sıfırlama e-postası gönderme
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Şifre sıfırlama e-postası gönderildi
 *       404:
 *         description: Bu e-posta ile kullanıcı bulunamadı
 */
router.post(
    '/forgot-password',
    [
        body('email')
            .isEmail()
            .withMessage('Geçerli bir email adresi girin'),
        validateRequest,
    ],
    forgotPassword
);

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Şifre sıfırlama
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - password
 *             properties:
 *               token:
 *                 type: string
 *               password:
 *                 type: string
 *                 minLength: 6
 *     responses:
 *       200:
 *         description: Şifre başarıyla sıfırlandı
 *       400:
 *         description: Geçersiz veya süresi dolmuş token
 */
router.post(
    '/reset-password',
    [
        body('token')
            .notEmpty()
            .withMessage('Token gerekli'),
        body('password')
            .isLength({ min: 6 })
            .withMessage('Şifre en az 6 karakter olmalıdır'),
        validateRequest,
    ],
    resetPassword
);

export default router; 