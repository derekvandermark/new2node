import http from 'http';
import { render } from './render';
const fs = require('node:fs');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');

	if (req.url === '/') {
		console.log("here1")
		const renderedHtml = render('views/layout.pug');
		res.end(renderedHtml);
	} else {
		console.log("here2")
		if (req.url && req.url.substring(0, 7) === '/public') {
			res.setHeader('Content-Type', 'text/css');
			const file = fs.readFileSync(req.url.substring(1), { encoding: 'utf-8' });
			res.end(file);
		}
	}
	
});

server.listen(port, hostname, () => {
	console.log(`Server running at http://${hostname}:${port}`);
})