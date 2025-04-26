import request from 'supertest';

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:3003';
const GATEWAY_URL = process.env.GATEWAY_URL || 'http://localhost:3000';

export let token: string = '';
export let createdUserId: string = '';

export const loginAndGetToken = async () => {
    const res = await request(AUTH_SERVICE_URL)
        .post('/auth/login')
        .send({username: 'admin', password: 'password'});

    token = res.body.token;
    return token;
}

export {AUTH_SERVICE_URL, GATEWAY_URL};