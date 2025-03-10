/**
 * User Routes (userRoutes.ts)
 *
 * This file defines the routes for managing users in our application.
 * It uses the Express framework for routing and makes calls to the user controller
 * (userController.ts) to handle the logic for each route.
 */
import express, { Router } from "express";
import { getUserDetails } from "../controllers/userController";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";

const router: Router = express.Router();

/**
 * @route GET /:uid
 * @description Retrieve user details by UID.
 * @note Accessible to admins or the user themselves.
 *
 * @openapi
 * /api/v1/users/{uid}:
 *   get:
 *     summary: Retrieve user details
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: uid
 *         schema:
 *           type: string
 *         required: true
 *         description: Unique identifier of the user
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   description: Details of the user
 *       401:
 *         description: Unauthorized - User not authenticated
 *       403:
 *         description: Forbidden - User not authorized
 *       500:
 *         description: Internal server error
 */
router.get(
    "/:uid",
    authenticate,
    isAuthorized({ hasRole: ["admin"], allowSameUser: true }),
    getUserDetails
);

export default router;
