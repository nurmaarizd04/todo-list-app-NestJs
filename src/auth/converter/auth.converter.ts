import { UserEntity } from "src/core/entity/user.entity";
import { LoginRequest } from "src/core/model/request/login.upsert.request";

export class AuthConverter {
        static convertUpsertRequestToEntity(request: LoginRequest): UserEntity {
                const userEntity = new UserEntity();

                userEntity.email = request.email;
                userEntity.password = request.password;
                userEntity.createdAt = BigInt(Date.now());

                return userEntity;
        }
}
