import { IncomingMessage, ServerResponse } from "http";
import { render } from "../servable";

// duplicate types, need to be refactored into separate file

type ErrorHandler = (req: IncomingMessage, res: ServerResponse, statusCode: number, message: string) => void;

type ReqHandler = (req: IncomingMessage, res: ServerResponse, error: ErrorHandler) => void;

export const get_home: ReqHandler = (req, res, error) => {
    const homePage = render('views/home.pug', { title: 'Home' });
    res.end(homePage);
}