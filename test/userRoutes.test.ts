import { Request, Response, NextFunction } from "express";
import { getUserDetails } from "../src/api/v1/controllers/userController";
import request from "supertest";
import app from "../src/app";

jest.mock("../src/api/v1/middleware/authorize", () =>
    jest.fn(() => {
        return (req: Request, res: Response, next: NextFunction): Response | void => {
            if (
                req.headers["x-roles"] !== "admin" &&
                req.params.uid !== req.headers["x-uid"]
            ) {
                return res.status(403).json({ error: "Forbidden: Insufficient permissions" });
            }
            next();
        };
    })
);

jest.mock("../src/api/v1/middleware/authenticate", () =>
    jest.fn((req: Request, res: Response, next: NextFunction) => {
        if (!req.headers["authorization"]) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        next();
    })
);

jest.mock("../src/api/v1/controllers/userController", () => ({
    getUserDetails: jest.fn((req: Request, res: Response) => {
        res.status(200).json({ uid: req.params.uid, name: "John Doe", email: "john@example.com" });
    }),
}));

describe("/api/v1/users/:uid Route", () => {
    it("should allow access for an admin user and call the controller", async () => {
        // eslint-disable-next-line @typescript-eslint/typedef
        const response = await request(app)
            .get("/api/v1/users/123")
            .set("authorization", "Bearer token")
            .set("x-roles", "admin");

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            uid: "123",
            name: "John Doe",
            email: "john@example.com",
        });
        expect(getUserDetails).toHaveBeenCalled();
    });

    it("should allow access for the same user and call the controller", async () => {
        // eslint-disable-next-line @typescript-eslint/typedef
        const response = await request(app)
            .get("/api/v1/users/123")
            .set("authorization", "Bearer token")
            .set("x-uid", "123");

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            uid: "123",
            name: "John Doe",
            email: "john@example.com",
        });
        expect(getUserDetails).toHaveBeenCalled();
    });

    it("should deny access if the user is neither admin nor the same user", async () => {
        // eslint-disable-next-line @typescript-eslint/typedef
        const response = await request(app)
            .get("/api/v1/users/123")
            .set("authorization", "Bearer token")
            .set("x-roles", "user")
            .set("x-uid", "456");

        expect(response.status).toBe(403);
        expect(response.body.error).toBe("Forbidden: Insufficient permissions");
        expect(getUserDetails).not.toHaveBeenCalled();
    });

    it("should return an error if authentication fails", async () => {
        // eslint-disable-next-line @typescript-eslint/typedef
        const response = await request(app)
            .get("/api/v1/users/123")
            .set("x-roles", "admin");

        expect(response.status).toBe(401);
        expect(response.body.error).toBe("Unauthorized");
        expect(getUserDetails).not.toHaveBeenCalled();
    });

    it("should return an error if both authorization and roles/uid headers are missing", async () => {
        // eslint-disable-next-line @typescript-eslint/typedef
        const response = await request(app).get("/api/v1/users/123");

        expect(response.status).toBe(401);
        expect(response.body.error).toBe("Unauthorized");
        expect(getUserDetails).not.toHaveBeenCalled();
    });
});
