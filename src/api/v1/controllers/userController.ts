import { Request, Response, NextFunction } from "express";
import { UserRecord } from "firebase-admin/auth";
import { auth } from "../../../../config/firebaseConfig";
import { successResponse } from "../models/responseModel";
import { HTTP_STATUS } from "../../../constants/httpConstants";

export const getUserDetails = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const { uid } = req.params;

    try {
        const user: UserRecord = await auth.getUser(uid);

        res.status(HTTP_STATUS.OK).json(successResponse(user));
    } catch (error: unknown) {
        next(error);
    }
};
