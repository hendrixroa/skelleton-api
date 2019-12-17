import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as helmet from 'helmet';
import { Server } from 'typescript-rest';

// middleware
import { handleError } from './middleware/handleError';
import { initRequest } from './middleware/initRequest';
import { logRequest } from './middleware/logRequest';

// controllers
import './controllers/PingController';

export const api = express();

let corsOptions: cors.CorsOptions = {
  origin: [
    /*
      Put your Regex to match with your domain
    */
  ],
};

// Allow all origins for local development
if (process.env.NODE_ENV === 'development') {
  corsOptions = { origin: '*' };
}

api.options('*', cors(corsOptions));
api.use(cors(corsOptions));

api.use(initRequest());
api.use(bodyParser.urlencoded({ extended: false }));
api.use(bodyParser.json());
api.use(logRequest());
api.use(helmet());

Server.buildServices(api);

api.use(handleError());
