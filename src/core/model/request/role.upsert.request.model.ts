import { Expose } from "class-transformer";

export class RoleUpsertRequest {
        @Expose({ name: "name" })
        name: string;
}
