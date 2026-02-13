import dotenv from 'dotenv'
dotenv.config({ override: true }) // Force .env to override system variables
import express from 'express'
import cookieParser from 'cookie-parser'
import { engine } from 'express-handlebars'
import { headers } from './middleware/headers.js'
import { authenticate } from './middleware/auth.js'
import { apiRouter } from './routes/api.js'
import { uiRouter } from './routes/ui.js'

const app = express()

// Middleware
app.use(express.json())
app.use(cookieParser())
app.disable('x-powered-by');
app.use(express.static('public'));
app.use(headers)

// Global Authentication for all /api routes
app.use('/api', authenticate);

// View Engine
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

// Routes
app.use('/api', apiRouter);
app.use('/', uiRouter);

// Express variables
const hostname = process.env.DYNAMIC_EP_HOSTNAME || '0.0.0.0'
const port = process.env.DYNAMIC_EP_PORT || 3000

// Start express
app.listen(port, hostname, () => {
    console.log(`Server listening on ${hostname}:${port}`)
});
