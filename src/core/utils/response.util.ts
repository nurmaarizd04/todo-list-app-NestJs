import { HttpStatus } from "@nestjs/common";
import { instanceToPlain } from "class-transformer";
import { Response } from "express";
import { AppResponse } from "../model/response/app.response.model";
import { PageInfo } from "../model/page.info.model";
import { DefaultResponse } from "../model/response/default.response.model";
import { PagingResponse } from "../model/response/paging.response.model";
import { StatusCode } from "../model/status.code.model";

export function sendResponseByResult<T>(response: Response, result: AppResponse<T>) {
        response.status(result.statusCode.code).json(
                instanceToPlain(result.responseBody, {
                        exposeUnsetFields: false
                })
        );
}

export function sendUnauthorizedResponse(response: Response) {
        response.status(HttpStatus.UNAUTHORIZED).json({
                code: HttpStatus.UNAUTHORIZED,
                message: "Unauthorized"
        });
}

export function sendInternalServerErrorResponse(response: Response) {
        response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                code: HttpStatus.INTERNAL_SERVER_ERROR,
                message: "Internal Server Error"
        });
}

export function composeDefaultResponseResult<T>(
        statusCode: StatusCode,
        payload: T | undefined = undefined
): AppResponse<DefaultResponse<T>> {
        const result: AppResponse<DefaultResponse<T>> = new AppResponse<DefaultResponse<T>>();
        result.statusCode = statusCode;

        const defaultResponse = new DefaultResponse<T>();
        defaultResponse.code = statusCode.code;
        defaultResponse.message = statusCode.message;
        defaultResponse.payload = payload;
        result.responseBody = defaultResponse;

        return result;
}

export function composePagingResponseResult<T>(
        statusCode: StatusCode,
        pageInfo?: PageInfo,
        payload: T[] = []
): AppResponse<PagingResponse<T>> {
        const result: AppResponse<PagingResponse<T>> = new AppResponse<PagingResponse<T>>();
        result.statusCode = statusCode;

        const pagingResponse = new PagingResponse<T>();
        pagingResponse.code = statusCode.code;
        pagingResponse.message = statusCode.message;
        pagingResponse.payload = payload;
        pagingResponse.pageInfo = pageInfo;
        result.responseBody = pagingResponse;

        return result;
}

export function sendLoginResponse<T>(response: Response, result: AppResponse<DefaultResponse<T>>, payload: Partial<T>) {
        response.status(result.statusCode.code).json({
                code: result.responseBody.code,
                message: result.responseBody.message,
                payload
        });
}
