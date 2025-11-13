import { app } from '../../app.setup.js';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

// Create an in-memory MongoDB instance
let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    // Connect to the in-memory MongoDB
    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

// After tests, stop the in-memory MongoDB
afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});


describe('Auth Tests', () => {
    test('User can create an account', async () => {
        const response = await request(app).post('/api/v1/auth/sign-up').send({
            "name": "Uchenna Munachimso",
            "email": "uchefabulous@gmail.com",
            "password": "Super_$ecure"
        });
        expect(response.body.status).toBe(201);
        expect(response.body.success).toBeTruthy();
        expect(response.body.message).toBe("User registration successful.");
        expect(response.body).toHaveProperty("data");
        expect(response.body.data.data.password).toBeUndefined();
    });

    test("User cannot create an account if a required field is missing", async () => {
        const response = await request(app).post('/api/v1/auth/sign-up').send({
            "name": "Onyedikachi Raphael",
            "email": "raphaelbuchi@gmail.com"
        });
        expect(response.status).toEqual(400);
        expect(response.body.message).toBe("The request failed with the following errors");
        expect(response.body.error).toBeDefined();
    })
});