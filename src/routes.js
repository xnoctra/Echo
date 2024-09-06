import express from 'express';
import path from 'path';
const router = express.Router();

let __dirname = process.cwd();

router.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'public/index.html'));
});

router.get("/go", (req, res) => {
	res.sendFile(path.join(process.cwd(), "/public/go.html"));
});

router.use((req, res, next) => {
	res.status(404).sendFile(path.join(__dirname, 'public/404.html'));
});
  

export default router;