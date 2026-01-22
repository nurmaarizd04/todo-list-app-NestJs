import { Body, Controller, Logger, Post, Res } from "@nestjs/common";
import { AuthService } from "../service/auth.service";
import { plainToInstance } from "class-transformer";
import { DefaultResult } from "src/core/alias/core.alias";
import { sendInternalServerErrorResponse, sendResponseByResult, sendLoginResponse } from "src/core/utils/response.util";
import { Response } from "express";
import { LoginRequest } from "src/core/model/request/login.upsert.request";
import { LoginResult } from "../alias/auth.alias";
import { RegistrasiRequest } from "src/core/model/request/registrasi.upsert.request";
import { setAccessTokenCookie } from "src/core/utils/auth.cookie.util";

@Controller()
export class AuthController {
        private logger: Logger;

        constructor(private readonly authService: AuthService) {
                this.logger = new Logger(AuthController.name);
        }

        @Post("register")
        register(@Body() requestBody: RegistrasiRequest, @Res() response: Response): void {
                const requestData: RegistrasiRequest = plainToInstance(RegistrasiRequest, requestBody);

                this.authService
                        .createRegisterUser(requestData)
                        .then((result: DefaultResult): void => {
                                sendResponseByResult(response, result);
                                this.logger.log(`[POST /register] ${result.statusCode.message}`);
                        })
                        .catch((error): void => {
                                sendInternalServerErrorResponse(response);
                                this.logger.error("[POST /register] Error", error);
                        });
        }

        // sett login cookie
        @Post("login")
        login(@Body() requestBody: LoginRequest, @Res() response: Response): void {
                const requestData = plainToInstance(LoginRequest, requestBody, {
                        exposeDefaultValues: true
                });

                this.authService
                        .login(requestData)
                        .then((result: LoginResult): void => {
                                const credential = result.responseBody?.payload;

                                setAccessTokenCookie(response, credential?.accessToken);
                                sendLoginResponse(response, result, {
                                        user: credential?.user
                                });

                                this.logger.log(`[POST /login] ${result.statusCode.message}`);
                        })
                        .catch((error): void => {
                                sendInternalServerErrorResponse(response);
                                this.logger.error("[POST /login] Error", error);
                        });
        }

        // noo set cookie
        // @Post("login")
        // login(@Body() requestBody: LoginRequest, @Res() response: Response): void {
        //         const requestData: LoginRequest = plainToInstance(LoginRequest, requestBody, {
        //                 exposeDefaultValues: true
        //         });

        //         this.authService
        //                 .login(requestData)
        //                 .then((result: LoginResult): void => {
        //                         sendResponseByResult(response, result);
        //                         this.logger.log(`[POST /login] ${result.statusCode.message}`);
        //                 })
        //                 .catch((error): void => {
        //                         sendInternalServerErrorResponse(response);
        //                         this.logger.error("[POST /login] Error", error);
        //                 });
        // }
}
