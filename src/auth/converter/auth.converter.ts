import { UserEntity } from "src/core/entity/user.entity";
import { RegistrasiRequest } from "src/core/model/request/registrasi.upsert.request";

export class AuthConverter {
        static convertUpsertRequestToEntity(request: RegistrasiRequest): UserEntity {
                const userEntity = new UserEntity();

                userEntity.username = request.username;
                userEntity.email = request.email;
                userEntity.password = request.password;
                userEntity.createdAt = BigInt(Date.now());

                return userEntity;
        }
}
