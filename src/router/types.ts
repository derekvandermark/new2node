import { IncomingMessage, ServerResponse } from "http";

export type HttpMethod = (
    'GET'     |
    'POST'    |
    'PUT'     |
    'DELETE'  |
    'HEAD'    |
    'CONNECT' |
    'OPTIONS' |
    'PATCH'
);

export type HandlerType = HttpMethod | 'USE';

export type ErrorHandler = (req: IncomingMessage, res: ServerResponse, statusCode: number, message: string) => void;

export type ReqHandler = (req: IncomingMessage, res: ServerResponse, error: ErrorHandler) => void;

export type RequestHandlers = Partial<{[T in HandlerType]: ReqHandler}>;

export type RouteDestination = {
    reqHandlers: RequestHandlers
    subRoutes: Routes
}

export type Routes = {
    [pathSegment: string]: RouteDestination
}

export type Pathname =  `/${string}`;

export type WildcardSegment = `:${string}`;
