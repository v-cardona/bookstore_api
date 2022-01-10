import { RoleType } from "../role/role.enum";

export interface IJwtPayload {
    id: number;
    username: string;
    email: string;
    roles: RoleType[];
    iat?: Date;
}