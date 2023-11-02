import { compileFile } from "pug";
import fs from 'fs';
import path from "path";
import { ServerResponse } from "http";
import { MIMEType } from "util";

export function render<Data extends { title: string }>(templateFile: string, data?: Data): string {
    const compiledFunction = compileFile(templateFile);
    return compiledFunction(data);
}


// more to be added
const mimeTypes = {
    '.txt':   'text/plain',
    '.css':   'text/css',
    '.html':  'text/html',
    '.js':    'text/javascript',
    '.jpeg':  'image/jpeg',
    '.png':   'image/png'
};

export function serveStaticFile(res: ServerResponse, pathname: string) {
    res.setHeader('Content-Type', 'text/css');
    fs.createReadStream(pathname.substring(1)).pipe(res);
    
}

