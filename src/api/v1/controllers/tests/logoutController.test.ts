import request from 'supertest';
import app from "../../../../app";
import { StatusCodes } from 'http-status-codes';
import { jest } from '@jest/globals';

import dotenv from "dotenv";
import { Session } from '../../models/session';
dotenv.config();
jest.mock("../../models/user")


describe('POST /logout', () => {
    it('should log out a user with a valid session token', async () => {
      // Assuming you have a valid session token
      const validSessionToken = 'valid-session-token';
      const mockSession = {
        token: validSessionToken,
        userId:"650eb609d7b42e5e44a50d64"

      } 
const session = jest.spyOn(Session,"findOneAndDelete").mockResolvedValue(mockSession);


const response = await request(app)
        .post('/api/v1/auth/logout')
        .set('token', validSessionToken);

      expect(response.status).toBe(StatusCodes.NO_CONTENT); 
    });


    it('should return an error with an invalid session token', async () => {
      const invalidSessionToken = 'invalid-session-token';
      jest.spyOn(Session,"findOneAndDelete").mockResolvedValue(null); 

      const response = await request(app)
        .post('/api/v1/auth/logout')
        .set('token', invalidSessionToken);

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body.message).toBe('Session not found');
    });

    //TODO Implementation - Need to implement multi-user device login system

    // it('should allow a user to log out from one device while staying logged in on another', async () => {
    //     // Step 1: Register a new user and obtain their session token
    //     const userRegistrationResponse = await request(app)
    //       .post('/api/v1/auth/register')
    //       .send({
    //         name: 'Multi-Device User',
    //         email: 'multi-device@example.com',
    //         password: 'password123',
    //       });
      
    //     const sessionToken = userRegistrationResponse.body.data.accessToken;
      
    //     const device1 = request(app);
    //     const device2 = request(app);
      
    //     device1.set('token', sessionToken);
    //     device2.set('token', sessionToken);
      
    //     const logoutResponse1 = await device1.post('/auth/logout');
      
    //     const someProtectedEndpointResponse = await device2.get('/some-protected-endpoint');
      
    //     expect(logoutResponse1.status).toBe(200);
    //     expect(logoutResponse1.body.message).toBe('Logout successful');
      
    //     expect(someProtectedEndpointResponse.status).toBe(200);
    //     expect(someProtectedEndpointResponse.body.message).toBe('Protected endpoint accessed');
    //   });
      
})
