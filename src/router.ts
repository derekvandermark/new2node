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



class Router {

    routes: Routes = {
        '/': {
            reqHandlers: {},
            subRoutes: {}
        }
    };

    private getRouteDestination = (pathname: Pathname): RouteDestination => {
        let routeDest = this.routes['/'];
        if (pathname === '/') return routeDest;

        const pathSegments: string[] = pathname.split('/'); // DOES NOT YET ACCOUNT FOR TRAILING SLASH, ENFORCE IN Pathname TYPE

        for (let i = 1; i < pathSegments.length; i++) {
            const segment = pathSegments[i];
            const nextRoute: RouteDestination | undefined = routeDest.subRoutes[segment];

            if (!nextRoute) {
                routeDest.subRoutes[segment] = {
                    reqHandlers: {},
                    subRoutes: {}
                };
            }

            routeDest = nextRoute;
        }

        return routeDest;
    }

    private setRoute = (handlerType: HandlerType, pathname: Pathname, handler: ReqHandler): void => {
        const routeDest = this.getRouteDestination(pathname);
        const handlers: ReqHandler[] | undefined = routeDest.reqHandlers[handlerType];

        if (handlers) {
            handlers.push(handler);
        } else {
            routeDest.reqHandlers[handlerType] = [handler];
        }
    }

    private runHandlers = (handlers: ReqHandler[], req: IncomingMessage, res: OutgoingMessage): void => {
        // event emitter for next() or errors?
    }

    // route = (req: IncomingMessage, res: OutgoingMessage): void => {
    //     // run general middleware first
    //     if (req.url && req.method) {
    //         const url = new URL(req.url, `http://${req.headers.host}`);
    //         const routeDest = this.getRouteDestination(url.pathname);
    //         if (routeDest.reqHandlers.USE) {
    //             this.runHandlers(routeDest.reqHandlers.USE, req, res);
    //         }
    //         if (routeDest.reqHandlers[req.method]) {
    //             this.runHandlers(routeDest.reqHandlers[req.method], req, res);
    //         }
            
    //     }
    // }


    use = (pathname: Pathname, handler: ReqHandler) => {
        this.setRoute('USE', pathname, handler);
    }

    get = (pathname: Pathname, handler: ReqHandler) => {
        this.setRoute('GET', pathname, handler);
    }

    post = (pathname: Pathname, handler: ReqHandler) => {
        this.setRoute('POST', pathname, handler);
    }

    put = (pathname: Pathname, handler: ReqHandler) => {
        this.setRoute('PUT', pathname, handler);
    }

    delete = (pathname: Pathname, handler: ReqHandler) => {
        this.setRoute('DELETE', pathname, handler);
    }

    head = (pathname: Pathname, handler: ReqHandler) => {
        this.setRoute('HEAD', pathname, handler);
    }

    connect = (pathname: Pathname, handler: ReqHandler) => {
        this.setRoute('CONNECT', pathname, handler);
    }

    options = (pathname: Pathname, handler: ReqHandler) => {
        this.setRoute('OPTIONS', pathname, handler);
    }

    patch = (pathname: Pathname, handler: ReqHandler) => {
        this.setRoute('PATCH', pathname, handler);
    }

}

const router = new Router();
export default router;