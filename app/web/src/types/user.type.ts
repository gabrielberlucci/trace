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

export interface PaginatedUsers {
  status: string;
  message: string;
  meta: PaginatedUsersMeta;
  data: PaginatedUsersData;
}

export interface PaginatedUsersMeta {
  totalUsers: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface UserItem {
  id: number;
  name: string;
  active: boolean;
  role: {
    name: string;
  };
}

export interface PaginatedUsersData {
  userData: UserItem[];
}

// POST USER

export interface CreateUserDataResponse {
  status: string;
  message: string;
  data: {
    id: number;
    name: string;
    birthdate: Date;
    phone: string;
    address: string;
    zipcode: string;
    addressNumber: number;
    complement: string;
    email: string;
    username: string;
    active: boolean;
    cityId: number;
    roleId: number;
  };
}

export interface CreateUserData {
  name: string;
  birthdate?: Date;
  phone?: string;
  address?: string;
  zipcode?: string;
  addressNumber?: number;
  complement?: string;
  email?: string;
  username: string;
  cityId?: number;
  roleId: number;
}
