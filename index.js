import express from 'express'
import { headers } from './middleware/headers.js'
const app = express()

app.use(express.json())
app.disable('x-powered-by');
app.use(headers)

//Express variables
const adminKeyEnv = process.env.DYNAMIC_EP_ADMIN_KEY
const hostname = process.env.DYNAMIC_EP_HOSTNAME || '0.0.0.0'
const port = process.env.DYNAMIC_EP_PORT || 3000

// Store routes under each unique key
const routeRegistry = {};

// Function to remove a specific route
function removeRoute(httpVerb, fullEndpoint) {
    app._router.stack = app._router.stack.filter(layer => {
        return !(layer.route && layer.route.path === fullEndpoint && layer.route.methods[httpVerb.toLowerCase()]);
    });
}

// Create an Express Router
const apiRouter = express.Router();

// API to create or update an endpoint
apiRouter.post('/create-endpoint', (req, res) => {
    const { myUniqueKey, endpoint, httpVerb, responseCode, responseBodyInJson, responseDelay } = req.body;

    if (!myUniqueKey || myUniqueKey.length !== 16 || !endpoint || !httpVerb || !responseCode || !responseBodyInJson) {
        return res.status(400).json({ error: "Missing or invalid required fields" });
    }

    // Prefix dynamic endpoints with `/api`
    const fullEndpoint = `/api/${myUniqueKey}${endpoint}`;
    const delay = Math.min(responseDelay || 0, 10000);

    // Ensure routeRegistry[myUniqueKey] is initialized
    if (!routeRegistry[myUniqueKey]) {
        routeRegistry[myUniqueKey] = [];
    }

    // Check if a route with the same endpoint and httpVerb already exists, and remove it if so
    const existingRouteIndex = routeRegistry[myUniqueKey].findIndex(route => route.endpoint === fullEndpoint && route.httpVerb === httpVerb);
    if (existingRouteIndex !== -1) {
        removeRoute(httpVerb, fullEndpoint);
        routeRegistry[myUniqueKey].splice(existingRouteIndex, 1);
    }

    // Register the new or updated route dynamically
    app[httpVerb.toLowerCase()](fullEndpoint, (req, res) => {
        const route = routeRegistry[myUniqueKey].find(route => route.endpoint === fullEndpoint && route.httpVerb === httpVerb);
        if (route) {
            route.callCount += 1; // Increment counter each time route is called
        }

        setTimeout(() => {
            res.status(responseCode).json(responseBodyInJson);
        }, delay);
    });

    // Save updated route details in the registry with an initial call count of 0
    routeRegistry[myUniqueKey].push({ endpoint: fullEndpoint, httpVerb, responseCode, responseBodyInJson, responseDelay: delay, callCount: 0 });

    res.status(201).json({ message: `Route ${httpVerb} ${fullEndpoint} created or updated` });
});

// API to retrieve all endpoints for a given myUniqueKey
apiRouter.get('/list-endpoints/:myUniqueKey', (req, res) => {
    const { myUniqueKey } = req.params;
    
    if (!routeRegistry[myUniqueKey]) {
        return res.status(404).json({ error: "No endpoints found for the provided unique key" });
    }

    res.json({ endpoints: routeRegistry[myUniqueKey] });
});

// Admin endpoint to see all endpoints
apiRouter.get('/admin/list-all-endpoints', (req, res) => {
    const adminKey = req.headers['admin-key'];

    if (adminKey !== adminKeyEnv) {
        return res.status(403).json({ error: "Unauthorized access" });
    }
    res.json({ endpoints: routeRegistry });
});

// API to delete all endpoints for a given myUniqueKey
apiRouter.delete('/delete-endpoints/:myUniqueKey', (req, res) => {
    const { myUniqueKey } = req.params;

    if (!routeRegistry[myUniqueKey]) {
        return res.status(404).json({ error: "No endpoints found for the provided unique key" });
    }

    // Remove each route under the unique key
    routeRegistry[myUniqueKey].forEach(route => {
        removeRoute(route.httpVerb, route.endpoint);
    });

    // Clear the unique key's registry entry
    delete routeRegistry[myUniqueKey];

    res.status(200).json({ message: `All endpoints for unique key ${myUniqueKey} have been deleted.` });
});

// Respond with a static message on the /api root
app.get('/api', (req, res) => {
    res.send(`Website coming soon! Check out the documentation at 
            <a href="https://github.com/necrolingus/dynamic_endpoints">https://github.com/necrolingus/dynamic_endpoints</a> for usage details.`);
});

// Mount the API router under /api
app.use('/api', apiRouter);

//Start express
app.listen(port, hostname, () => {
    console.log(`Server listening on ${hostname}:${port}`);
});
