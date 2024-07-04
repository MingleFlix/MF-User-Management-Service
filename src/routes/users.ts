import {Router} from 'express';
import UserController from "../controllers/userController";
import authMiddleware from "../middlewares/authMiddleware";

const router = Router();
router.use('/user', authMiddleware);

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       500:
 *         description: Error registering new user
 */
router.post('/register', UserController.register);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Authenticate user and return JWT
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid credentials
 *       404:
 *         description: User not found
 *       500:
 *         description: Error logging in
 */
router.post('/login', UserController.login);

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Get user details
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User details retrieved successfully
 *       401:
 *         description: Access denied
 *   patch:
 *     summary: Update user details
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User details updated successfully
 *       401:
 *         description: Access denied
 *       404:
 *         description: User not found
 *       500:
 *         description: Error updating user
 *   delete:
 *     summary: Delete user
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Access denied
 */
router.route('/user')
    .get(UserController.get)
    .patch(UserController.update)
    .delete(UserController.delete)

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User details retrieved successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Error retrieving user details
 *     security:
 *       - cookieAuth: []
 */
router.get('/user/:id', UserController.getById);


/**
 * @swagger
 * /:
 *   get:
 *     summary: Welcome message
 *     tags: [Welcome]
 *     responses:
 *       200:
 *         description: Welcome to the user-management service!
 */
router.get('/', (req, res) => {
    res.send('Welcome to the user-management service!');
});


export default router;