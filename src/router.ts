import { IncomingMessage, OutgoingMessage } from "http";

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

type ReqHandler = (req: IncomingMessage, res: OutgoingMessage) => void;

type RequestHandlers = Partial<{[T in HandlerType]: ReqHandler[]}>;

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


    routes: Routes = {
        '/': {
            reqHandlers: {},
            subRoutes: {}
        }
    };


    private setRouteDestination = (pathname: Pathname): RouteDestination => {
        let routeDest = this.routes['/'];
        const pathSegments: string[] = pathname.split('/');

        for (const segment in pathSegments) { 
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
        for (const key in routeKeys) {
            if (key[0] === ':') return key as WildcardSegment;
        }
    }


    private getRouteDestination = (pathname: Pathname): RouteDestination | undefined => {
        let routeDest = this.routes['/'];
        const pathSegments: string[] = pathname.split('/');

        for (const segment in pathSegments) {
            if (segment !== '') {
                if (!routeDest.subRoutes[segment]) {
                    const wildcardSegment = this.getWildcardSegment(routeDest.subRoutes);
                    if (wildcardSegment) routeDest = routeDest.subRoutes[wildcardSegment];
                } else {
                    routeDest = routeDest.subRoutes[segment];
                }
            } 
            
        }

        return routeDest;
    }


    private setReqHandler = (handlerType: HandlerType, pathname: Pathname, handler: ReqHandler): void => {
        const routeDest = this.setRouteDestination(pathname);
        const handlers: ReqHandler[] | undefined = routeDest.reqHandlers[handlerType];

        if (handlers) {
            handlers.push(handler);
        } else {
            routeDest.reqHandlers[handlerType] = [handler];
        }
    }


    next = () => {

    }


    private runHandlers = (req: IncomingMessage, res: OutgoingMessage, handlers: ReqHandler[]): void => {
        for (const handler in handlers) {

        }
    }


    // Type assertions required due to IncomingMessage type being unable to tell if it was created by a Server or ClientRequest.
    // This function should only be called for IncomingMessage's created by a Server
    route = (req: IncomingMessage, res: OutgoingMessage): void => {
        const url = new URL(req.url as string, `http://${req.headers.host}`);
        const routeDest = this.getRouteDestination(url.pathname as Pathname);

        if (routeDest) {
            const useHandlers = routeDest.reqHandlers.USE;
            const reqHandlers = routeDest.reqHandlers[req.method as HttpMethod];
            useHandlers && this.runHandlers(req, res, useHandlers);
            reqHandlers && this.runHandlers(req, res, reqHandlers);
        } else {
            // handle 404 error
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

const router = new Router();
export default router;