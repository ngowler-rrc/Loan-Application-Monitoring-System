import { Request, Response, NextFunction } from "express";
import request from "supertest";
import app from "../src/app";
import {
    applyForLoan,
    reviewLoan,
    getAllLoans,
    approveLoan,
} from "../src/api/v1/controllers/loanController";

jest.mock("../src/api/v1/middleware/authenticate", () =>
    jest.fn((req: Request, res: Response, next: NextFunction) => {
        if (!req.headers["authorization"]) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        next();
    })
);

jest.mock("../src/api/v1/middleware/authorize", () =>
    jest.fn(({ hasRole }: { hasRole: string[] }) => (req: Request, res: Response, next: NextFunction) => {
        const userRole: string | string[] | undefined = req.headers["x-roles"];

        if (Array.isArray(userRole)) {
            if (!userRole.some(role => hasRole.includes(role))) {
                return res.status(403).json({ error: "Forbidden: Insufficient permissions" });
            }
        } else if (!userRole || !hasRole.includes(userRole)) {
            return res.status(403).json({ error: "Forbidden: Insufficient permissions" });
        }

        next();
    })
);


jest.mock("../src/api/v1/controllers/loanController", () => ({
    applyForLoan: jest.fn((req: Request, res: Response) => {
        res.status(200).json({ message: "Loan application submitted successfully" });
    }),
    reviewLoan: jest.fn((req: Request, res: Response) => {
        res.status(200).json({ message: "Loan reviewed successfully" });
    }),
    getAllLoans: jest.fn((req: Request, res: Response) => {
        res.status(200).json({ loans: ["Loan1", "Loan2"] });
    }),
    approveLoan: jest.fn((req: Request, res: Response) => {
        res.status(200).json({ message: "Loan approved successfully" });
    }),
}));

describe("/api/v1/loans Routes", () => {
    describe("POST /api/v1/loans", () => {
        it("should allow a user to apply for a loan", async () => {
            // eslint-disable-next-line @typescript-eslint/typedef
            const response = await request(app)
                .post("/api/v1/loans")
                .set("authorization", "Bearer token")
                .set("x-roles", "user")
                .send({ loanAmount: 5000, loanPurpose: "Business" });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe("Loan application submitted successfully");
            expect(applyForLoan).toHaveBeenCalled();
        });

        it("should deny access if user lacks necessary role", async () => {
            // eslint-disable-next-line @typescript-eslint/typedef
            const response = await request(app)
                .post("/api/v1/loans")
                .set("authorization", "Bearer token")
                .set("x-roles", "officer")
                .send({ loanAmount: 5000, loanPurpose: "Business" });

            expect(response.status).toBe(403);
            expect(response.body.error).toBe("Forbidden: Insufficient permissions");
            expect(applyForLoan).not.toHaveBeenCalled();
        });

        it("should return an error if authentication fails", async () => {
            // eslint-disable-next-line @typescript-eslint/typedef
            const response = await request(app)
                .post("/api/v1/loans")
                .send({ loanAmount: 5000, loanPurpose: "Business" });

            expect(response.status).toBe(401);
            expect(response.body.error).toBe("Unauthorized");
            expect(applyForLoan).not.toHaveBeenCalled();
        });
    });

    describe("PUT /api/v1/loans/:id/review", () => {
        it("should allow an officer to review a loan", async () => {
            // eslint-disable-next-line @typescript-eslint/typedef
            const response = await request(app)
                .put("/api/v1/loans/123/review")
                .set("authorization", "Bearer token")
                .set("x-roles", "officer")
                .send({ reviewNotes: "All good" });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe("Loan reviewed successfully");
            expect(reviewLoan).toHaveBeenCalled();
        });

        it("should deny access if the user does not have officer role", async () => {
            // eslint-disable-next-line @typescript-eslint/typedef
            const response = await request(app)
                .put("/api/v1/loans/123/review")
                .set("authorization", "Bearer token")
                .set("x-roles", "user")
                .send({ reviewNotes: "All good" });

            expect(response.status).toBe(403);
            expect(response.body.error).toBe("Forbidden: Insufficient permissions");
            expect(reviewLoan).not.toHaveBeenCalled();
        });
    });

    describe("GET /api/v1/loans", () => {
        it("should allow an officer or manager to view all loans", async () => {
            // eslint-disable-next-line @typescript-eslint/typedef
            const response = await request(app)
                .get("/api/v1/loans")
                .set("authorization", "Bearer token")
                .set("x-roles", "manager");

            expect(response.status).toBe(200);
            expect(response.body.loans).toEqual(["Loan1", "Loan2"]);
            expect(getAllLoans).toHaveBeenCalled();
        });

        it("should deny access if user lacks necessary roles", async () => {
            // eslint-disable-next-line @typescript-eslint/typedef
            const response = await request(app)
                .get("/api/v1/loans")
                .set("authorization", "Bearer token")
                .set("x-roles", "user");

            expect(response.status).toBe(403);
            expect(response.body.error).toBe("Forbidden: Insufficient permissions");
            expect(getAllLoans).not.toHaveBeenCalled();
        });
    });

    describe("PUT /api/v1/loans/:id/approve", () => {
        it("should allow a manager to approve a loan", async () => {
            // eslint-disable-next-line @typescript-eslint/typedef
            const response = await request(app)
                .put("/api/v1/loans/123/approve")
                .set("authorization", "Bearer token")
                .set("x-roles", "manager")
                .send({ approvalNotes: "Approved" });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe("Loan approved successfully");
            expect(approveLoan).toHaveBeenCalled();
        });

        it("should deny access if user does not have manager role", async () => {
            // eslint-disable-next-line @typescript-eslint/typedef
            const response = await request(app)
                .put("/api/v1/loans/123/approve")
                .set("authorization", "Bearer token")
                .set("x-roles", "officer")
                .send({ approvalNotes: "Approved" });

            expect(response.status).toBe(403);
            expect(response.body.error).toBe("Forbidden: Insufficient permissions");
            expect(approveLoan).not.toHaveBeenCalled();
        });
    });
});
