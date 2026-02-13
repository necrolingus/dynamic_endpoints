import express from 'express';

export const uiRouter = express.Router();

uiRouter.get('/', (req, res) => {
    // If cookie exists, redirect to dashboard
    if (req.cookies.adminKey) {
        return res.redirect('/dashboard');
    }
    res.render('login', { layout: 'main' });
});

uiRouter.get('/dashboard', (req, res) => {
    // If no cookie, redirect to login
    if (!req.cookies.adminKey) {
        return res.redirect('/');
    }
    res.render('dashboard', { layout: 'main' });
});
