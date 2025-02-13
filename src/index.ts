import express from 'express';
import "dotenv/config";
import App from './services/ExpressApp';
import dbConnection from './services/Database';
import { PORT } from './config';

const StartServer = async () => { 
	const app = express();
	await dbConnection();
	await App(app);

	app.listen(PORT, () => {
		console.log(`Server running on port ${PORT}`);
	});
}

StartServer();