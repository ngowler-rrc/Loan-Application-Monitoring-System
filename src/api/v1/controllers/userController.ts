import { Request, Response, NextFunction } from "express";
import { successResponse } from "../models/responseModel";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import {
    getDocuments,
    createDocument,
    updateDocument,
    deleteDocument,
    getDocumentsByFieldValue,
} from "../repositories/firestoreRepository";

const COLLECTION = "loans";

/**
 * @description Retrieves all loans from the Firestore collection and sends them in the HTTP response.
 * @route GET /
 * @returns {Promise<void>} A promise that resolves when the response is sent.
 */
export const getAllLoans = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const snapshot: FirebaseFirestore.QuerySnapshot = await getDocuments(
            COLLECTION
        );
        const loans = snapshot.docs.map((doc) => {
            const data: FirebaseFirestore.DocumentData = doc.data();
            return { id: doc.id, ...data };
        });

        res.status(HTTP_STATUS.OK).json(
            successResponse(loans, "Loans Retrieved")
        );
    } catch (error) {
        next(error);
    }
};

