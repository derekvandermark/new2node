import { IncomingMessage, ServerResponse } from "http";
import { render } from "./servable";

type HttpMethod = (
    'GET'     |
    'POST'    |
    'PUT'     |
    'DELETE'  |
    'HEAD'    |
    'CONNECT' |
    'OPTIONS' |
    'PATCH'
);

type HandlerType = HttpMethod | 'USE';

type ErrorHandler = (req: IncomingMessage, res: ServerResponse, statusCode: number, message: string) => void;

type ReqHandler = (req: IncomingMessage, res: ServerResponse, error: ErrorHandler) => void;

type RequestHandlers = Partial<{[T in HandlerType]: ReqHandler}>;

type RouteDestination = {
    reqHandlers: RequestHandlers
    subRoutes: Routes
}

type Routes = {
    [pathSegment: string]: RouteDestination
}

type Pathname =  `/${string}`;

type WildcardSegment = `:${string}`;


class Router {


    private routes: Routes = {
        '/': {
            reqHandlers: {},
            subRoutes: {}
        }
    };


    private setRouteDestination = (pathname: Pathname): RouteDestination => {
        let routeDest = this.routes['/'];
        const pathSegments: string[] = pathname.split('/');

        for (const segment of pathSegments) { 
            if (segment !== '') {
                const nextRoute: RouteDestination | undefined = routeDest.subRoutes[segment];
                if (!nextRoute) routeDest.subRoutes[segment] = {reqHandlers: {}, subRoutes: {}};
                routeDest = nextRoute;
            }
        }

        return routeDest;
    }


    private getWildcardSegment = (subRoutes: Routes): WildcardSegment | undefined => {
        const routeKeys = Object.keys(subRoutes);
        for (const key of routeKeys) {
            if (key[0] === ':') return key as WildcardSegment;
        }
    }


    private getRouteDestination = (pathname: Pathname): RouteDestination | undefined => {
        let routeDest = this.routes['/'];
        const pathSegments: string[] = pathname.split('/');

        for (const segment of pathSegments) {
            if (segment !== '') {
                if (!routeDest.subRoutes[segment]) {
                    const wildcardSegment = this.getWildcardSegment(routeDest.subRoutes);
                    if (wildcardSegment) routeDest = routeDest.subRoutes[wildcardSegment];
                    else return undefined;
                } else {
                    routeDest = routeDest.subRoutes[segment];
                }
            } 
        }

        return routeDest;
    }


    private setReqHandler = (handlerType: HandlerType, pathname: Pathname, handler: ReqHandler): void => {
        const routeDest = this.setRouteDestination(pathname);
        routeDest.reqHandlers[handlerType] = handler;
    }


    errorHandler: ErrorHandler = (req, res, statusCode, message) => {
        res.statusCode = statusCode;
        const errorPage = render('views/error.pug', {
            title: 'Error',
            message: message,
            statusCode: statusCode
        });
        res.end(errorPage);
    }


    // route can be refactored into 2 functions, one for general routing called on every request first, then the specific request routing second, within one encompassing function

    // Type assertions required due to IncomingMessage type being unable to tell if it was created by a Server or ClientRequest.
    // This function should only be called for IncomingMessage's created by a Server
    route = (req: IncomingMessage, res: ServerResponse): void => {
        const url = new URL(req.url as string, `http://${req.headers.host}`);
        const routeDest = this.getRouteDestination(url.pathname as Pathname);
        
        if (routeDest) {
            const useHandler = routeDest.reqHandlers.USE;
            const reqHandler = routeDest.reqHandlers[req.method as HttpMethod];
            useHandler && useHandler(req, res, this.errorHandler);
            reqHandler && reqHandler(req, res, this.errorHandler);
        } else {
            this.errorHandler(req, res, 404, 'Page not found');
        }
    }


    use = (pathname: Pathname, handler: ReqHandler) => {
        this.setReqHandler('USE', pathname, handler);
    }

    get = (pathname: Pathname, handler: ReqHandler) => {
        this.setReqHandler('GET', pathname, handler);
    }

    post = (pathname: Pathname, handler: ReqHandler) => {
        this.setReqHandler('POST', pathname, handler);
    }

    put = (pathname: Pathname, handler: ReqHandler) => {
        this.setReqHandler('PUT', pathname, handler);
    }

    delete = (pathname: Pathname, handler: ReqHandler) => {
        this.setReqHandler('DELETE', pathname, handler);
    }

    head = (pathname: Pathname, handler: ReqHandler) => {
        this.setReqHandler('HEAD', pathname, handler);
    }

    connect = (pathname: Pathname, handler: ReqHandler) => {
        this.setReqHandler('CONNECT', pathname, handler);
    }

    options = (pathname: Pathname, handler: ReqHandler) => {
        this.setReqHandler('OPTIONS', pathname, handler);
    }

    patch = (pathname: Pathname, handler: ReqHandler) => {
        this.setReqHandler('PATCH', pathname, handler);
    }

}

export default Router;