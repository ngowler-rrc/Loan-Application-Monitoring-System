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

router.post(
    "/",
    authenticate,
    isAuthorized({ hasRole: ["user"] }),
    applyForLoan
);

router.put(
    "/:id/review",
    authenticate,
    isAuthorized({ hasRole: ["officer"] }),
    reviewLoan
);

router.get(
    "/",
    authenticate,
    isAuthorized({ hasRole: ["officer", "manager"] }),
    getAllLoans
);

router.put(
    "/:id/approve",
    authenticate,
    isAuthorized({ hasRole: ["manager"] }),
    approveLoan
);

export default router;
