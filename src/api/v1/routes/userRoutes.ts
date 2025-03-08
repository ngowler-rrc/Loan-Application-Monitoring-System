import express, { Router } from "express";

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
    getUserDetails
);

router.put(
    "/:uid/approve",
    approveLoan
);

export default router;