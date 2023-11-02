import http from 'http';
import path from 'path';
import router from './routes/routes';
import { render, serveStaticFile } from './servable';

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
	console.log(req.url)
	

	if (req.url) {
		const url = new URL(req.url, `http://${req.headers.host}`);
		if (path.extname(url.pathname)) {
			serveStaticFile(res, url.pathname);
		} else {
			router.route(req, res);
		}
	} 
	
	// if (req.url === '/') {
	// 	console.log("here1")
	// 	const renderedHtml = render('views/home.pug');
	// 	res.end(renderedHtml);
	// } else {
	// 	console.log("here2")
	// 	if (req.url && req.url.substring(0, 7) === '/public') {
	// 		res.setHeader('Content-Type', 'text/css');
	// 		const file = fs.readFileSync(req.url.substring(1), { encoding: 'utf-8' });
	// 		res.end(file);
	// 	}
	//}
	
});

server.listen(port, hostname, () => {
	console.log(`Server running at http://${hostname}:${port}`);
})