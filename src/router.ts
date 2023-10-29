import { IncomingMessage, OutgoingMessage } from "http";

type RequestType = (
    'USE'     | // middleware called upon every request to pathname
    'GET'     |
    'POST'    |
    'PUT'     |
    'DELETE'  |
    'HEAD'    |
    'CONNECT' |
    'OPTIONS' |
    'PATCH'
);

type Middleware = (req: IncomingMessage, res: OutgoingMessage) => void;

type RequestHandlers = Partial<{[T in RequestType]: Middleware[]}>;

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
        let routeDest: RouteDestination = this.routes['/'];
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

    private setRoute = (reqType: RequestType, pathname: Pathname, method: Middleware): void => {
        const routeDest = this.getRouteDestination(pathname);
        const methods: Middleware[] | undefined = routeDest.reqHandlers[reqType];
        
        if (methods) {
            methods.push(method);
        } else {
            routeDest.reqHandlers[reqType] = [method];
        }
    }

    private runHandlers = (handlers: Middleware[]): void => {
        // event emitter for next() or errors?
    }

    // route = (req: IncomingMessage, res: OutgoingMessage): void => {
    //     const url = new URL(req.url, `http://${req.headers.host}`);
    //     const routeDest = this.getRouteDestination(url.pathname);
    //     if (routeDest.reqHandlers.USE) {
    //         this.runHandlers(routeDest.reqHandlers.USE);
    //     }
    //     this.runHandlers(routeDest.reqHandlers[req.method]);
    // }


    use = (pathname: Pathname, method: Middleware) => {
        this.setRoute('USE', pathname, method);
    }

    get = (pathname: Pathname, method: Middleware) => {
        this.setRoute('GET', pathname, method);
    }

    post = (pathname: Pathname, method: Middleware) => {
        this.setRoute('POST', pathname, method);
    }

    put = (pathname: Pathname, method: Middleware) => {
        this.setRoute('PUT', pathname, method);
    }

    delete = (pathname: Pathname, method: Middleware) => {
        this.setRoute('DELETE', pathname, method);
    }

    head = (pathname: Pathname, method: Middleware) => {
        this.setRoute('HEAD', pathname, method);
    }

    connect = (pathname: Pathname, method: Middleware) => {
        this.setRoute('CONNECT', pathname, method);
    }

    options = (pathname: Pathname, method: Middleware) => {
        this.setRoute('OPTIONS', pathname, method);
    }

    patch = (pathname: Pathname, method: Middleware) => {
        this.setRoute('PATCH', pathname, method);
    }

}

const router = new Router();
export default router;