import express, { Router } from "express";
import {
    applyForLoan,
    reviewLoan,
    getAllLoans,
    approveLoan,
} from "../controllers/userController";

const router: Router = express.Router();

router.post(
    "/",
    applyForLoan
);

router.put(
    "/:uid/review",
    reviewLoan
);

router.get(
    "/",
    getAllLoans
);

router.put(
    "/:uid/approve",
    approveLoan
);

export default router;
