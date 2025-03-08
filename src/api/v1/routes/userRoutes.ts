import express, { Router } from "express";
import {
    getAllLoans,
} from "../controllers/userController";

const router: Router = express.Router();

router.post(
    "/",
    createNewLoan
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
