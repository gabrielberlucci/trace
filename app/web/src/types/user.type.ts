export interface UserLoginPayload {
  username: string;
  password: string;
}

export interface UserLoginToken {
  access_token: string;
}

/*
 * this is used for login pages
 * ZodErrorMessage is for form login error
 * and ErrorMessage is generic message from back-end
 */
interface ZodErrorResponse {
  errorName: string;
  formErrors: string[];
  fieldErrors: Record<string, string[]>;
}

interface ErrorMessage {
  message: string;
}

export type ApiErrorResponse = ErrorMessage | ZodErrorResponse;

/**
 * types used for /me endpoint
 */

export interface UserMeResponse {
  id: number;
  username: string;
  name: string;
}

export interface MeApiResponse {
  status: string;
  message: string;
  data: UserMeResponse;
}
