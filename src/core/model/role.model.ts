import { Expose } from "class-transformer";

export class Role {
        @Expose({ name: "id" })
        id: string;

        @Expose({ name: "name" })
        name: string;

        @Expose({ name: "created_at" })
        createdAt: bigint;

        @Expose({ name: "updated_at" })
        updatedAt?: bigint;
}
