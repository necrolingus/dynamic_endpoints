import axios from 'axios';
import assert from 'assert';
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';

const BASE_URL = 'http://localhost:3000';
const jar = new CookieJar();
const client = wrapper(axios.create({ jar, withCredentials: true }));

async function verify() {
    try {
        console.log('Verifying Auth Redirects ...');
        // accessing dashboard without cookie should redirect or return 200 (login page)
        // Actually, our UI route redirects to / if no cookie, and / renders login.
        try {
            await client.get(`${BASE_URL}/dashboard`, { maxRedirects: 0 });
        } catch (err) {
            assert(err.response.status === 302);
            assert(err.response.headers.location === '/');
        }
        console.log('Auth Redirects passed');

        console.log('Verifying Login Failure ...');
        try {
            await client.post(`${BASE_URL}/api/login`, { apiKey: 'wrong' });
            assert.fail('Should have failed');
        } catch (err) {
            assert(err.response.status === 401);
        }
        console.log('Login Failure passed');

        console.log('Verifying Login Success ...');
        const loginRes = await client.post(`${BASE_URL}/api/login`, { apiKey: 'change_me_to_something_secure' });
        assert(loginRes.status === 200);
        // Cookie should be set in jar
        console.log('Login Success passed');

        console.log('Verifying Dashboard access ...');
        const dashboardRes = await client.get(`${BASE_URL}/dashboard`);
        assert(dashboardRes.status === 200);
        assert(dashboardRes.data.includes('Dashboard'));
        console.log('Dashboard access passed');

        console.log('Verifying Create Endpoint ...');
        const uniqueKey = '1234567890123456';
        const endpoint = '/test-auth';
        const createRes = await client.post(`${BASE_URL}/api/create-endpoint`, {
            myUniqueKey: uniqueKey,
            endpoint: endpoint,
            httpVerb: 'GET',
            responseCode: 200,
            responseBodyInJson: { success: true },
            responseDelay: 0
        });
        assert(createRes.status === 201);
        console.log('Create Endpoint passed');

        console.log('Verifying Validation Failure ...');
        try {
            await client.post(`${BASE_URL}/api/create-endpoint`, {
                myUniqueKey: uniqueKey,
                // endpoint missing
                httpVerb: 'GET',
                responseCode: 200,
                responseBodyInJson: { success: true }
            });
            assert.fail('Should have failed validation');
        } catch (err) {
            assert(err.response.status === 400);
            assert(err.response.data.error === 'Endpoint path is required');
        }
        console.log('Validation Failure passed');

        console.log('Verifying Dynamic Endpoint (Needs Auth) ...');
        const dynamicRes = await client.get(`${BASE_URL}/api/${uniqueKey}${endpoint}`);
        assert(dynamicRes.status === 200);
        assert(dynamicRes.data.success === true);
        console.log('Dynamic Endpoint passed');

        console.log('Verifying Dynamic Endpoint Security (Should Fail without Cookie) ...');
        try {
            await axios.get(`${BASE_URL}/api/${uniqueKey}${endpoint}`);
            assert.fail('Should have failed with 401');
        } catch (err) {
            assert(err.response.status === 401);
        }
        console.log('Dynamic Endpoint Security passed');
        console.log('All verification passed!');
    } catch (err) {
        console.error('Verification failed:', err.message);
        if (err.response) console.error(err.response.data);
        process.exit(1);
    }
}

verify();
