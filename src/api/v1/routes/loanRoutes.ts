import express, { Router } from "express";
import {
    applyForLoan,
    reviewLoan,
    getAllLoans,
    approveLoan,
} from "../controllers/loanController";

const router: Router = express.Router();

router.post(
    "/",
    applyForLoan
);

router.put(
    "/:id/review",
    reviewLoan
);

router.get(
    "/",
    getAllLoans
);

router.put(
    "/:id/approve",
    approveLoan
);

export default router;
