import { render } from "../servable";
import { IncomingMessage, ServerResponse } from "http";
import { ReadableStream } from "stream/web";
import { HttpMethod, HandlerType, ErrorHandler, ReqHandler, RequestHandlers, 
    RouteDestination, Routes, Pathname, WildcardSegment } from "./types";


class Router {


    private routes: Routes = {
        '/': {
            reqHandlers: {},
            subRoutes: {}
        }
    };


    private setRouteDestination = (pathname: Pathname): RouteDestination => {
        let routeDest = this.routes['/'];
        const pathSegments: string[] = pathname.split('/').slice(1);

        for (const segment of pathSegments) { 
            if (!routeDest.subRoutes[segment]) routeDest.subRoutes[segment] = {reqHandlers: {}, subRoutes: {}};
            routeDest = routeDest.subRoutes[segment];
        }

        return routeDest;
    }


    private setReqHandler = (handlerType: HandlerType, pathname: Pathname, handler: ReqHandler): void => {
        const routeDest = this.setRouteDestination(pathname);
        routeDest.reqHandlers[handlerType] = handler;
    }


    private getWildcardSegment = (subRoutes: Routes): WildcardSegment | undefined => {
        const routeKeys = Object.keys(subRoutes);
        for (const key of routeKeys) {
            if (key[0] === '*') return key as WildcardSegment;
        }
    }


    private getRouteDestination = (pathname: Pathname): RouteDestination | undefined => {
        let routeDest = this.routes['/'];
        const pathSegments: string[] = pathname.split('/').slice(1);

        for (const segment of pathSegments) {
            if (!routeDest.subRoutes[segment]) {
                const wildcardSegment = this.getWildcardSegment(routeDest.subRoutes);
                if (wildcardSegment) routeDest = routeDest.subRoutes[wildcardSegment];
                else return undefined;
            } else {
                routeDest = routeDest.subRoutes[segment];
            }
        }

        return routeDest;
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


    // Type assertions required due to IncomingMessage type being unable to tell if it was created by a Server or ClientRequest.
    // This function should only be called for IncomingMessage's created by a Server
    route = (req: IncomingMessage, res: ServerResponse): void => {
        // run general middleware first
        const url = new URL(req.url as string, `http://${req.headers.host}`);
        const routeDest = this.getRouteDestination(url.pathname as Pathname);
        
        if (routeDest) {
            const middleware = routeDest.reqHandlers.MIDDLEWARE;
            const reqHandler = routeDest.reqHandlers[req.method as HttpMethod];
            middleware && middleware(req, res, this.errorHandler);
            reqHandler && reqHandler(req, res, this.errorHandler);
        } else {
            this.errorHandler(req, res, 404, 'Page not found');
        }
    }


    // interfaces for setting up routes

    middleware = (pathname: Pathname, handler: ReqHandler) => {
        this.setReqHandler('MIDDLEWARE', pathname, handler);
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