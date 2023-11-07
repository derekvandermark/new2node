import { IncomingMessage, ServerResponse } from "http";
import { render } from "../servable";
import { ReqHandler } from "../router/types";

export const get_home: ReqHandler = (req, res, error) => {
    const homePage = render('views/home.pug', { title: 'new2node' });
    res.end(homePage);
}

export const get_test: ReqHandler = (req, res, error) => {
    const testPage = render('views/test.pug', {title: 'test'});
    res.end(testPage);
}