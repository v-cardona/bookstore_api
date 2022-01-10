import { IsNotEmpty } from "class-validator";
import { Role } from "src/modules/role/role.entity";
import { RoleType } from "src/modules/role/role.enum";
import { UserDetails } from "../user.details.entity";

export class UserDto {
    @IsNotEmpty()
    id: number;

    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    roles: RoleType[];

    @IsNotEmpty()
    details: UserDetails;
}