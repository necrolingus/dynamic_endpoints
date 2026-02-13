import express from 'express';
import { createEndpoint, listEndpoints, listAllEndpoints, deleteEndpoints, login } from '../controller/endpointController.js';

export const apiRouter = express.Router();

// Login route
apiRouter.post('/login', login);

// Authentication is now handled globally in index.js for /api

// API to create or update an endpoint
apiRouter.post('/create-endpoint', createEndpoint);

// API to retrieve all endpoints for a given myUniqueKey
apiRouter.get('/list-endpoints/:myUniqueKey', listEndpoints);

// Admin endpoint to see all endpoints
apiRouter.get('/admin/list-all-endpoints', listAllEndpoints);

// API to delete all endpoints for a given myUniqueKey
apiRouter.delete('/delete-endpoints/:myUniqueKey', deleteEndpoints);
