import { Expose, Type } from "class-transformer";

export class User {
        @Expose({ name: "id" })
        id: string;

        @Expose({ name: "email" })
        email: string;

        @Expose({ name: "created_at" })
        @Type(() => Number)
        createdAt: bigint;

        @Expose({ name: "updated_at" })
        @Type(() => Number)
        updatedAt?: bigint;
}
