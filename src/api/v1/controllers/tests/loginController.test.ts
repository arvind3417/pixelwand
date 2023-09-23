import request from 'supertest';
import app from "../../../../app";
import { StatusCodes } from 'http-status-codes';
import { jest } from '@jest/globals';
import { User } from '../../models/user';
import * as hashUtils from "../../helpers/hashPassword";

import dotenv from "dotenv";
import { Session } from '../../models/session';
dotenv.config();
jest.mock("../../models/user")

jest.mock("../../helpers/jwt", () => ({ 
  genAccessToken: jest.fn(() => 'access_token'),
  genRefreshToken: jest.fn(() => 'refresh_token')
}));

const hashCompareMock = jest.spyOn(hashUtils, 'hashCompare');


describe('POST /login', () => {
    it('should log in a user with valid credentials', async () => {
      // Test login with valid credentials
      jest.spyOn(User, 'findOne').mockResolvedValue({ email: 'testuser@example1.com' });
      hashCompareMock.mockReturnValue(true);

      jest.spyOn(Session, 'create').mockImplementation(async () => {
        return {
          _id: '650eb609d7b42e5e44a50d66',
          userId: '650eb609d7b42e5e44a50d64',
          token: 'access_token'
        };
      });
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'testuser@example1.com', 
          password: 'password123', 
        });
 
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('User logged in successfully');
      expect(response.body.data.accessToken).toBeDefined();
    });

    it('should return an error with invalid credentials', async () => {
      // Test login with an invalid email
    //   User.findOne = jest.fn().mockResolvedValue(null);
      jest.spyOn(User, 'findOne').mockResolvedValue(null);


      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'invalid@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(StatusCodes.NOT_FOUND);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid email or user does not exist');
    });

    it('should return an error with incorrect password', async () => {
      // Test login with a valid email but incorrect password
      const mockUser = {
        email: 'testuser@example1.com',
        password: 'correctpassword',
      };
            jest.spyOn(User, 'findOne').mockResolvedValue(mockUser);
            hashCompareMock.mockReturnValue(false);

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({ 
          email: 'testuser@example1.com',  
          password: 'wrongpassword',
        });

      expect(response.status).toBe(StatusCodes.UNAUTHORIZED); 
      expect(response.body.success).toBe(false); 
      expect(response.body.message).toBe('Invalid password');
    });

  });