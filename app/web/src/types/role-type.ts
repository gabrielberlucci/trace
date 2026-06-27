export interface RoleResponse {
  status: string;
  message: string;
  data: RoleData[];
}

export interface RoleData {
  id: number;
  name: string;
}
