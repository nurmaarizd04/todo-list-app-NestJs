import { Expose, Type } from "class-transformer";
import { Role } from "./role.model";

export class User {
        @Expose({ name: "id" })
        id: string;

        @Expose({ name: "username" })
        username: string;

        @Expose({ name: "email" })
        email: string;

        @Expose({ name: "created_at" })
        @Type(() => Number)
        createdAt: bigint;

        @Expose({ name: "updated_at" })
        @Type(() => Number)
        updatedAt?: bigint;

        @Expose({ name: "role" })
        @Type(() => Role)
        role?: Role | null;
}
