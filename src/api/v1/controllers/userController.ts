import { Request, Response, NextFunction } from "express";
import { Loan } from "../models/loanModel";
import { successResponse } from "../models/responseModel";
import { LOAN_STATUS } from "../../../constants/loanConstants";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import { v4 as uuidv4 } from 'uuid';
import { firestore } from 'firebase-admin';
import {
    getDocuments,
    createDocument,
    updateDocument,
    getDocumentById,
} from "../repositories/firestoreRepository";

const COLLECTION: string = "loans";

/**
 * @description Creates a new loan application, stores it in the Firestore collection, and returns the created loan object.
 * @route POST /
 * @returns {Promise<void>}
 */
export const applyForLoan = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const {
            borrowerName,
            borrowerEmail,
            loanAmount,
            loanPurpose,
            applicationDate,
            repaymentTerm,
            interestRate
        } = req.body;

        if (!borrowerName || !borrowerEmail || !loanAmount || !loanPurpose || !applicationDate || !repaymentTerm || !interestRate) {
            throw new Error("All required fields must be provided");
        }

        const loanData: Loan = {
            id: uuidv4(),
            borrowerName,
            borrowerEmail,
            loanAmount,
            loanPurpose,
            status: LOAN_STATUS.PENDING,
            applicationDate,
            repaymentTerm,
            interestRate
        };

        await createDocument(COLLECTION, loanData);

        res.status(HTTP_STATUS.CREATED).json(
            successResponse(loanData, "Loan Application Created")
        );
    } catch (error) {
        next(error);
    }
};

/**
 * @description Marks a loan application as "under review" by updating its status in Firestore.
 * @route PUT /:uid/review
 * @returns {Promise<void>} A promise that resolves when the loan is updated.
 */
export const reviewLoan = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { uid } = req.params;

        await updateDocument(COLLECTION, uid, { status: LOAN_STATUS.UNDER_REVIEW });

        const updatedLoanDoc = await getDocumentById(COLLECTION, uid);
        const updatedLoan: Loan = updatedLoanDoc.data() as Loan;

        res.status(HTTP_STATUS.OK).json(
            successResponse(updatedLoan, "Loan Marked as Under Review")
        );
    } catch (error) {
        next(error);
    }
};

/**
 * @description Retrieves loans from the Firestore collection, optionally filtered by status, and sends them in the HTTP response.
 * @route GET /
 * @query {string} [status] - Optional status filter to retrieve loans with a specific status.
 * @returns {Promise<void>} A promise that resolves when the response is sent.
 */
export const getAllLoans = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { status } = req.query;

        let query: FirebaseFirestore.Query<FirebaseFirestore.DocumentData> =
            firestore().collection(COLLECTION);

        if (status) {
            query = query.where('status', '==', status);
        }

        const snapshot: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData> = await query.get();
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

/**
 * @description Approves a loan application by updating its status in Firestore.
 * @route PUT /:uid/approve
 * @returns {Promise<void>} A promise that resolves when the loan is approved.
 */
export const approveLoan = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { uid } = req.params;

        await updateDocument(COLLECTION, uid, { status: LOAN_STATUS.APPROVED });

        const updatedLoanDoc = await getDocumentById(COLLECTION, uid);
        const updatedLoan: Loan = updatedLoanDoc.data() as Loan;

        res.status(HTTP_STATUS.OK).json(
            successResponse(updatedLoan, "Loan Approved")
        );
    } catch (error) {
        next(error);
    }
};
