import { expect } from 'chai';
import nock from 'nock';
import request from 'supertest';
import app from 'app';

const testApp = request(app);
const API_URL = 'http://localhost:5000/api';

describe('Client App', () => {
    describe('GET /api/entries', () => {
        const mockData = [
            { id: 1, taskName: 'task 1', taskDescription: 'description 1', taskStart: new Date().toUTCString(), taskEnd: null },
            { id: 2, taskName: 'task 2', taskDescription: null, taskStart: new Date().toUTCString(), taskEnd: new Date().toUTCString() }
        ];

        // set up nock to mock out the external API
        nock(API_URL)
            .defaultReplyHeaders({
                'Content-Tye': 'application/json'
            })
            .get('/entries')
            .reply(200, JSON.stringify(mockData))

        it('should proxy request to external API and return response if it receives a 200 status', done => {
            testApp
                .get('/api/entries')
                .expect('Content-Type', /application\/json/)
                .expect(200)
                .expect(JSON.stringify(mockData), done);
        });

        it('should return 500 status if an error is encountered', done => {
            // set up the mocked API to return an error when attempting to call it
            nock(API_URL)
                .get('/entries')
                .replyWithError('error');

            testApp
                .get('/api/entries')
                .expect(500)
                .expect('Error in making API call', done); 
        });

        it('should return 500 status if an unknown response is received', done => {
            // set up the mocked API to return an unexpected response (not 200 or 500)
            nock(API_URL)
                .defaultReplyHeaders({
                    'Content-Tye': 'application/json'
                })
                .get('/entries')
                .reply(404);

            testApp
                .get('/api/entries')
                .expect(500)
                .expect('Unexpected response from API', done); 
        });
    });

    describe('POST /api/entries', () => {
        const mockData = { id: 3, taskName: 'new task', taskDescription: 'new description', taskStart: new Date().toUTCString(), taskEnd: null }

        // set up nock to mock out the external API
        nock(API_URL)
            .defaultReplyHeaders({
                'Content-Tye': 'application/json'
            })
            .post('/entries', {
                taskName: 'new task',
                taskDescription: 'new description'
            })
            .reply(201, JSON.stringify(mockData))

        it('should proxy request to external API and return response if it receives a 201 status', done => {
            testApp
                .post('/api/entries')
                .send({ taskName: 'new task', taskDescription: 'new description' })
                .expect('Content-Type', /application\/json/)
                .expect(201)
                .expect(JSON.stringify(mockData), done);
        });

        it('should return 400 status if taskName value is not supplied', done => {
            testApp
                .post('/api/entries')
                .send({ taskDescription: 'new description' })
                .expect(400)
                .expect('A value must be supplied for taskName', done); 
        });

        it('should return 500 status if an error is encountered', done => {
            // set up the mocked API to return an error when attempting to call it
            nock(API_URL)
                .post('/entries', {
                    taskName: 'new task',
                    taskDescription: 'new description'  
                })
                .replyWithError('error');

            testApp
                .post('/api/entries')
                .send({ taskName: 'new task', taskDescription: 'new description' })
                .expect(500)
                .expect('Error in making API call', done); 
        });

        it('should return 500 status if an unknown response is received', done => {
            // set up the mocked API to return an unexpected response (not 200 or 500)
            nock(API_URL)
                .post('/entries', {
                    taskName: 'new task',
                    taskDescription: 'new description'  
                })
                .reply(404);

            testApp
                .post('/api/entries')
                .send({ taskName: 'new task', taskDescription: 'new description' })
                .expect(500)
                .expect('Unexpected response from API', done); 
        });
    });

    describe('POST /api/entries/{id}/stop', () => {
        const mockData = { id: 1, taskName: 'new task', taskDescription: 'new description', taskStart: new Date().toUTCString(), taskEnd: new Date().toUTCString() }

        // set up nock to mock out the external API
        nock(API_URL)
            .defaultReplyHeaders({
                'Content-Tye': 'application/json'
            })
            .post('/entries/1/stop')
            .reply(200, JSON.stringify(mockData))

        it('should proxy request to external API and return response if it receives a 200 status', done => {
            testApp
                .post('/api/entries/1/stop')
                .expect('Content-Type', /application\/json/)
                .expect(200)
                .expect(JSON.stringify(mockData), done);
        });

        it('should return 404 status if the Entry does not exist', done => {
            // set up the mocked API to return a 404 response
            nock(API_URL)
                .post('/entries/-1/stop')
                .reply(404);

            testApp
                .post('/api/entries/-1/stop')
                .expect(404)
                .expect('Entry with ID -1 not found', done); 
        });

        it('should return 500 status if an error is encountered', done => {
            // set up the mocked API to return an error when attempting to call it
            nock(API_URL)
                .post('/entries/1/stop')
                .replyWithError('error');

            testApp
                .post('/api/entries/1/stop')
                .expect(500)
                .expect('Error in making API call', done); 
        });

        it('should return 500 status if an unknown response is received', done => {
            // set up the mocked API to return an unexpected response (not 200 or 500)
            nock(API_URL)
                .post('/entries/1/stop')
                .reply(401);

            testApp
                .post('/api/entries/1/stop')
                .expect(500)
                .expect('Unexpected response from API', done); 
        });
    });

    describe('DELETE /api/entries/{id}', () => {
        // set up nock to mock out the external API
        nock(API_URL)
            .defaultReplyHeaders({
                'Content-Tye': 'application/json'
            })
            .delete('/entries/1')
            .reply(204)

        it('should proxy request to external API and return response if it receives a 204 status', done => {
            testApp
                .delete('/api/entries/1')
                .expect(204, done);
        });

        it('should return 404 status if the Entry does not exist', done => {
            // set up the mocked API to return a 404 response
            nock(API_URL)
                .delete('/entries/-1')
                .reply(404);

            testApp
                .delete('/api/entries/-1')
                .expect(404)
                .expect('Entry with ID -1 not found', done); 
        });

        it('should return 500 status if an error is encountered', done => {
            // set up the mocked API to return an error when attempting to call it
            nock(API_URL)
                .delete('/entries/1')
                .replyWithError('error');

            testApp
                .delete('/api/entries/1')
                .expect(500)
                .expect('Error in making API call', done); 
        });

        it('should return 500 status if an unknown response is received', done => {
            // set up the mocked API to return an unexpected response (not 200 or 500)
            nock(API_URL)
                .delete('/entries/1')
                .reply(401);

            testApp
                .delete('/api/entries/1')
                .expect(500)
                .expect('Unexpected response from API', done); 
        });
    });
});