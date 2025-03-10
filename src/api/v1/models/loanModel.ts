/**
 * @interface Loan
 * @description Represents a loan object with essential properties.
 */
export type Loan = {
    id: string;
    borrowerName: string;
    borrowerEmail: string;
    loanAmount: number;
    loanPurpose: string;
    status: string;
    applicationDate: Date;
    repaymentTerm: number;
    interestRate: number;
};
