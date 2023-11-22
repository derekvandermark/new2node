import { compileFile } from "pug";
import fs from 'fs';
import path from "path";
import { ServerResponse } from "http";

export function render<Data extends { title: string }>(templateFile: string, data?: Data): string {
    const compiledFunction = compileFile(templateFile);
    return compiledFunction(data);
}


const mimeExt = {
    '.txt':   'text/plain',
    '.css':   'text/css',
    '.html':  'text/html',
    '.js':    'text/javascript',
    '.jpeg':  'image/jpeg',
    '.jpg':   'image/jpeg',
    '.png':   'image/png',
    '.woff':  'font/woff',
    '.woff2': 'font/woff2'
};

function isPublic(pathname: string) {

}

export function validatePath(res: ServerResponse, pathname: string): boolean {
    // const publicDir = path.join(__dirname, '/public');
    // console.log(publicDir)
    // console.log('Here', path.resolve(pathname));


    console.log(pathname.split('/'))
    return pathname.split('/')[1] === 'public';
    //return path.extname(pathname) === '.html';
}

export function serveStaticFile(res: ServerResponse, pathname: string) {
    res.setHeader('Content-Type', mimeExt[path.extname(pathname) as keyof typeof mimeExt]);
    fs.createReadStream(pathname.substring(1)).pipe(res);
}

