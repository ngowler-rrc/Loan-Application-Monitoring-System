/**
 * Represents a standardized API response structure.
 * This interface ensures consistent response formatting across all API endpoints.
 *
 * @template T - The type of data being returned in case of success
 *
 * @property status - Indicates if the operation was successful ('success' or 'error')
 * @property data - Optional payload returned on successful operations
 * @property message - Optional informational message about the operation result
 * @property error - Error message in case of failure
 * @property code - Optional error code for client-side error handling
 */
interface ApiResponse<T> {
    status: string;
    data?: T;
    message?: string;
    error?: string;
    code?: string;
}

/**
 * Creates a standardized success response object.
 * Use this helper to ensure consistent success response formatting.
 *
 * @template T - The type of data being returned
 * @param data - Optional payload to be returned to the client
 * @param message - Optional success message
 * @returns A properly formatted success response object
 */
export const successResponse = <T>(
    data?: T,
    message?: string
): ApiResponse<T> => ({
    status: "success",
    data,
    message,
});

/**
 * Creates a standardized error response object.
 * Use this helper to ensure consistent error response formatting.
 *
 * @param message - Error message describing what went wrong
 * @param code - Optional error code for client-side error handling
 * @returns A properly formatted error response object
 */
export const errorResponse = (
    message: string,
    code?: string
): ApiResponse<null> => ({
    status: "error",
    message,
    code,
});
