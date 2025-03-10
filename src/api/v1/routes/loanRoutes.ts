/**
 * Loan Routes (loanRoutes.ts)
 *
 * This file defines the routes for managing loans in our application.
 * It uses the Express framework for routing and makes calls to the loan controller
 * (loanController.ts) to handle the logic for each route.
 */
import express, { Router } from "express";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";
import {
    applyForLoan,
    reviewLoan,
    getAllLoans,
    approveLoan,
} from "../controllers/loanController";

const router: Router = express.Router();

/**
 * @route POST /
 * @description Create a new loan application.
 * @note Accessible to authenticated users.
 *
 * @openapi
 * /api/v1/loans:
 *   post:
 *     summary: Create a new loan application
 *     tags: [Loans]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               borrowerName:
 *                 type: string
 *               borrowerEmail:
 *                 type: string
 *               loanAmount:
 *                 type: number
 *               loanPurpose:
 *                 type: string
 *               applicationDate:
 *                 type: string
 *                 format: date
 *               repaymentTerm:
 *                 type: number
 *               interestRate:
 *                 type: number
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       201:
 *         description: Loan application created
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Internal server error
 */
router.post(
    "/",
    authenticate,
    isAuthorized({ hasRole: ["user"] }),
    applyForLoan
);

/**
 * @route PUT /:id/review
 * @description Mark a loan application as "under review".
 * @note Accessible to loan officers.
 *
 * @openapi
 * /api/v1/loans/{id}/review:
 *   put:
 *     summary: Mark loan as under review
 *     tags: [Loans]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the loan
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Loan marked as under review
 *       403:
 *         description: Forbidden - User not authorized
 *       500:
 *         description: Internal server error
 */
router.put(
    "/:id/review",
    authenticate,
    isAuthorized({ hasRole: ["officer"] }),
    reviewLoan
);

/**
 * @route GET /
 * @description Retrieve a list of all loans, optionally filtered by status.
 * @note Accessible to loan officers and managers.
 *
 * @openapi
 * /api/v1/loans:
 *   get:
 *     summary: Retrieve all loans
 *     tags: [Loans]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter loans by status
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of loans retrieved
 *       403:
 *         description: Forbidden - User not authorized
 *       500:
 *         description: Internal server error
 */
router.get(
    "/",
    authenticate,
    isAuthorized({ hasRole: ["officer", "manager"] }),
    getAllLoans
);

/**
 * @route PUT /:id/approve
 * @description Approve a loan application.
 * @note Accessible to managers.
 *
 * @openapi
 * /api/v1/loans/{id}/approve:
 *   put:
 *     summary: Approve a loan application
 *     tags: [Loans]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the loan
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Loan approved
 *       403:
 *         description: Forbidden - User not authorized
 *       500:
 *         description: Internal server error
 */
router.put(
    "/:id/approve",
    authenticate,
    isAuthorized({ hasRole: ["manager"] }),
    approveLoan
);

export default router;
