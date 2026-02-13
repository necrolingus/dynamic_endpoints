const routeRegistry = {};

function removeRoute(app, httpVerb, fullEndpoint) {
    if (!app._router || !app._router.stack) return;
    app._router.stack = app._router.stack.filter(layer => {
        return !(layer.route && layer.route.path === fullEndpoint && layer.route.methods[httpVerb.toLowerCase()]);
    });
}

// Middleware authenticate moved to middleware/auth.js


export const login = (req, res) => {
    const { apiKey } = req.body;
    const adminKeyEnv = process.env.DYNAMIC_EP_ADMIN_KEY;

    if (apiKey === adminKeyEnv) {
        // Set HTTP-only cookie
        res.cookie('adminKey', apiKey, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });
        res.json({ success: true });
    } else {
        res.status(401).json({ error: "Invalid API Key" });
    }
};

export const createEndpoint = (req, res) => {
    const { myUniqueKey, endpoint, httpVerb, responseCode, responseBodyInJson, responseDelay } = req.body;
    const app = req.app;

    if (!myUniqueKey || myUniqueKey.length < 8 || myUniqueKey.length > 20) {
        return res.status(400).json({ error: "Unique Key must be between 8 and 20 characters" });
    }
    if (!endpoint) {
        return res.status(400).json({ error: "Endpoint path is required" });
    }
    if (!httpVerb) {
        return res.status(400).json({ error: "HTTP Verb is required" });
    }
    if (!responseCode) {
        return res.status(400).json({ error: "Response Code is required" });
    }
    if (!responseBodyInJson) {
        return res.status(400).json({ error: "Response Body is required" });
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
        removeRoute(app, httpVerb, fullEndpoint);
        routeRegistry[myUniqueKey].splice(existingRouteIndex, 1);
    }

    // Register the new or updated route dynamically
    // Note: Dynamic endpoints themselves are NOT authenticated as per original design, 
    // but management of them is.
    app[httpVerb.toLowerCase()](fullEndpoint, (req, res) => {
        const route = routeRegistry[myUniqueKey]?.find(route => route.endpoint === fullEndpoint && route.httpVerb === httpVerb);
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
};

export const listEndpoints = (req, res) => {
    const { myUniqueKey } = req.params;

    if (!routeRegistry[myUniqueKey]) {
        return res.status(404).json({ error: "No endpoints found for the provided unique key" });
    }

    res.json({ endpoints: routeRegistry[myUniqueKey] });
};

export const listAllEndpoints = (req, res) => {
    // Authentication is handled by middleware
    res.json({ endpoints: routeRegistry });
};

export const deleteEndpoints = (req, res) => {
    const { myUniqueKey } = req.params;
    const app = req.app;

    if (!routeRegistry[myUniqueKey]) {
        return res.status(404).json({ error: "No endpoints found for the provided unique key" });
    }

    // Remove each route under the unique key
    routeRegistry[myUniqueKey].forEach(route => {
        removeRoute(app, route.httpVerb, route.endpoint);
    });

    // Clear the unique key's registry entry
    delete routeRegistry[myUniqueKey];

    res.status(200).json({ message: `All endpoints for unique key ${myUniqueKey} have been deleted.` });
};

export { routeRegistry };
