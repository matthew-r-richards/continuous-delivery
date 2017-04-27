import { expect } from 'chai';
import { stub } from 'sinon';
import nock from 'nock';

import reload from 'helpers/reload';

import { APIEndpoints } from 'constants/ApiConstants';

describe('ApiUtils', () => {
    let ServerActionCreators;
    let ApiUtils;

    beforeEach(() => {
        ServerActionCreators = reload('../../src/actions/ServerActionCreators');
        stub(ServerActionCreators, 'receiveEntries');
        stub(ServerActionCreators, 'receiveAddedEntry');
        stub(ServerActionCreators, 'entryDeleted');
        stub(ServerActionCreators, 'entryUpdated');
        ApiUtils = reload('../../src/utils/ApiUtils');
    });

    describe('getAllEntries', () => {
        const mockData = [
            { id: 1, taskName: 'task 1', taskDescription: 'description 1', taskStart: new Date().toUTCString(), taskEnd: null },
            { id: 2, taskName: 'task 2', taskDescription: null, taskStart: new Date().toUTCString(), taskEnd: new Date().toUTCString() }
        ];

        // set up nock to mock out the external API
        nock('http://localhost:80/api')
            .get('/entries')
            .reply(200, mockData);
        
        it('should create an action with the entries received from the API if there is no error', done => {
            ApiUtils.getAllEntries();

            // not really sure the best way of doing this, but I want to wait until the asynchronous request
            // in ApiUtils.getAllEntries is complete, so that I can assert its output
            setTimeout(() => {
                expect(ServerActionCreators.receiveEntries.calledWith(mockData)).to.be.true;
                done();
            }, 20);
        });

        it('should not create an action if there is an error', done => {
            // set up nock to create an error
            nock('http://localhost:80/api')
                .get('/entries')
                .replyWithError('error');

            ApiUtils.getAllEntries();

            // not really sure the best way of doing this, but I want to wait until the asynchronous request
            // in ApiUtils.getAllEntries is complete, so that I can assert its output
            setTimeout(() => {
                expect(ServerActionCreators.receiveEntries.notCalled).to.be.true;
                done();
            }, 20);
        });
    });

    describe('addEntry', () => {
        const mockData = { id: 3, taskName: 'task 3', taskDescription: 'description 3', taskStart: new Date().toUTCString(), taskEnd: new Date().toUTCString() };

        // set up nock to mock out the external API
        nock('http://localhost:80/api')
            .post('/entries', { taskName: 'task 3', taskDescription: 'description 3' })
            .reply(201, mockData);
        
        it('should create an action with the entry received from the API if there is no error', done => {
            ApiUtils.addEntry('task 3', 'description 3');

            // not really sure the best way of doing this, but I want to wait until the asynchronous request
            // in ApiUtils.addEntry is complete, so that I can assert its output
            setTimeout(() => {
                expect(ServerActionCreators.receiveAddedEntry.calledWith(mockData)).to.be.true;
                done();
            }, 20);
        });

        it('should not create an action if there is an error', done => {
            // set up nock to create an error
            nock('http://localhost:80/api')
                .post('/entries')
                .replyWithError('error');

            ApiUtils.addEntry('task 3', 'description 3');

            // not really sure the best way of doing this, but I want to wait until the asynchronous request
            // in ApiUtils.addEntry is complete, so that I can assert its output
            setTimeout(() => {
                expect(ServerActionCreators.receiveAddedEntry.notCalled).to.be.true;
                done();
            }, 20);
        });

        it('should not create an action if the supplied data was not complete (400)', done => {
            // set up nock to create an error
            nock('http://localhost:80/api')
                .post('/entries', { taskName: null, taskDescription: 'description 4' })
                .reply(400, 'Bad Request');

            ApiUtils.addEntry(null, 'description 4');

            // not really sure the best way of doing this, but I want to wait until the asynchronous request
            // in ApiUtils.addEntry is complete, so that I can assert its output
            setTimeout(() => {
                expect(ServerActionCreators.receiveAddedEntry.notCalled).to.be.true;
                done();
            }, 20);
        });
    });

    describe('deleteEntry', () => {
        // set up nock to mock out the external API
        nock('http://localhost:80/api')
            .delete('/entries/1')
            .reply(204);
        
        it('should create an action if there is no error', done => {
            ApiUtils.deleteEntry(1);

            // not really sure the best way of doing this, but I want to wait until the asynchronous request
            // in ApiUtils.deleteEntry is complete, so that I can assert its output
            setTimeout(() => {
                expect(ServerActionCreators.entryDeleted.calledWith(1)).to.be.true;
                done();
            }, 20);
        });

        it('should not create an action if there is an error', done => {
            // set up nock to create an error
            nock('http://localhost:80/api')
                .delete('/entries/1')
                .replyWithError('error');

            ApiUtils.deleteEntry(1);

            // not really sure the best way of doing this, but I want to wait until the asynchronous request
            // in ApiUtils.deleteEntry is complete, so that I can assert its output
            setTimeout(() => {
                expect(ServerActionCreators.entryDeleted.notCalled).to.be.true;
                done();
            }, 20);
        });

        it('should not create an action if the Entry was not found (404)', done => {
            // set up nock to create an error
            nock('http://localhost:80/api')
                .delete('/entries/-1')
                .reply(404, 'Not Found');

            ApiUtils.deleteEntry(-1);

            // not really sure the best way of doing this, but I want to wait until the asynchronous request
            // in ApiUtils.deleteEntry is complete, so that I can assert its output
            setTimeout(() => {
                expect(ServerActionCreators.entryDeleted.notCalled).to.be.true;
                done();
            }, 20);
        });
    });

    describe('stopEntry', () => {
        const mockData = { id: 1, taskName: 'task 1', taskDescription: 'description 1', taskStart: new Date().toUTCString(), taskEnd: null };

        // set up nock to mock out the external API
        nock('http://localhost:80/api')
            .post('/entries/1/stop')
            .reply(200, mockData);
        
        it('should create an action if there is no error', done => {
            ApiUtils.stopEntry(1);

            // not really sure the best way of doing this, but I want to wait until the asynchronous request
            // in ApiUtils.stopEntry is complete, so that I can assert its output
            setTimeout(() => {
                expect(ServerActionCreators.entryUpdated.calledWith(mockData)).to.be.true;
                done();
            }, 20);
        });

        it('should not create an action if there is an error', done => {
            // set up nock to create an error
            nock('http://localhost:80/api')
                .post('/entries/1/stop')
                .replyWithError('error');

            ApiUtils.stopEntry(1);

            // not really sure the best way of doing this, but I want to wait until the asynchronous request
            // in ApiUtils.stopEntry is complete, so that I can assert its output
            setTimeout(() => {
                expect(ServerActionCreators.entryUpdated.notCalled).to.be.true;
                done();
            }, 20);
        });

        it('should not create an action if the Entry was not found (404)', done => {
            // set up nock to create an error
            nock('http://localhost:80/api')
                .delete('/entries/-1/stop')
                .reply(404, 'Not Found');

            ApiUtils.stopEntry(-1);

            // not really sure the best way of doing this, but I want to wait until the asynchronous request
            // in ApiUtils.stopEntry is complete, so that I can assert its output
            setTimeout(() => {
                expect(ServerActionCreators.entryUpdated.notCalled).to.be.true;
                done();
            }, 20);
        });
    });
});

