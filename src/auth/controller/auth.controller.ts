import { Body, Controller, Logger, Post, Req, Res } from "@nestjs/common";
import { AuthService } from "../service/auth.service";
import { plainToInstance } from "class-transformer";
import { DefaultResult } from "src/core/alias/core.alias";
import { sendInternalServerErrorResponse, sendResponseByResult } from "src/core/utils/response.util";
import { Request, Response } from "express";
import { LoginRequest } from "src/core/model/request/login.upsert.request";
import { LoginResult } from "../alias/auth.alias";
import { RegistrasiRequest } from "src/core/model/request/registrasi.upsert.request";
import { RefreshTokenRequest } from "src/core/model/request/refresh.token.request";

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

        @Post("login")
        login(@Body() requestBody: LoginRequest, @Res() response: Response): void {
                const requestData: LoginRequest = plainToInstance(LoginRequest, requestBody, {
                        exposeDefaultValues: true
                });

                this.authService
                        .login(requestData)
                        .then((result: LoginResult): void => {
                                sendResponseByResult(response, result);
                                this.logger.log(`[POST /login] ${result.statusCode.message}`);
                        })
                        .catch((error): void => {
                                sendInternalServerErrorResponse(response);
                                this.logger.error("[POST /login] Error", error);
                        });
        }

        @Post("refresh-token")
        refreshToken(@Body() requestBody: RefreshTokenRequest, @Res() response: Response): void {
                const requestData: RefreshTokenRequest = plainToInstance(RefreshTokenRequest, requestBody, {
                        exposeDefaultValues: true
                });

                this.authService
                        .refreshAccessToken(requestData)
                        .then((result: LoginResult): void => {
                                sendResponseByResult(response, result);
                                this.logger.log(`[POST /refresh-token] ${result.statusCode.message}`);
                        })
                        .catch((error): void => {
                                sendInternalServerErrorResponse(response);
                                this.logger.error("[POST /refresh-token] Error", error);
                        });
        }

        @Post("logout")
        logout(@Req() request: Request, @Res() response: Response): void {
                this.authService
                        .logoutFromHeader(request.headers["authorization"])
                        .then((result: DefaultResult) => {
                                sendResponseByResult(response, result);
                                this.logger.log(`[POST /logout] ${result.statusCode.message}`);
                        })
                        .catch((error) => {
                                sendInternalServerErrorResponse(response);
                                this.logger.error("[POST /logout] Error", error);
                        });
        }
}
