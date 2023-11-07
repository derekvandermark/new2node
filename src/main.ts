import http from 'http';
import path from 'path';
import fs from 'fs';
import router from './router/routes';
import { render, serveStaticFile, validatePath } from './servable';

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
	
	if (req.url) {
		const url = new URL(req.url, `http://${req.headers.host}`);
		// if (url.searchParams) {
		// 	console.log(url.searchParams)
		// 	res.setHeader('Content-Type', 'text/plain');
		// 	const file = url.pathname + url.searchParams.get('path')
		// 	fs.createReadStream(file.substring(1)).pipe(res);
		// } else
		if (path.extname(url.pathname)) {
			
			const pathValid = validatePath(res, url.pathname);
			if (pathValid) {
				serveStaticFile(res, url.pathname);
				res.on('finish', () => {
					res.end();
				});
			} else {
				console.log('Access Denied.')
			}
			
		} else {
			router.route(req, res);
		}
	} 
	
});

server.listen(port, hostname, () => {
	console.log(`Server running at http://${hostname}:${port}`);
})