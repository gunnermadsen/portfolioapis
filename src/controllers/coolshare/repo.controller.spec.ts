// import * as chai from 'chai'
// import { expect } from 'chai';
// import chaiHttp = require('chai-http')

// import 'mocha'


import * as request from 'request'

import { PortfolioServer } from '../../../app'
const portfolioserver = new PortfolioServer()

let app = portfolioserver.server

// chai.use(chaiHttp)

const token = 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZDJmODE4ZjgxODA4NzQ3Yjc3YThkMTciLCJlbWFpbCI6Im1hZGd1bm5lciIsImV4cCI6MTU2OTYyOTUxMCwiaWF0IjoxNTY5MDI0NzEwfQ.QLC-aOVvkw65ZpZNLp0q1Cy_Gq5Vo0Umlt5IBjK92fKE0FkVw4J57MNIXLvSZ6kdXLRkwUoFSnIEeXbJlaVcT7hFKHriX4sXBiR7HZbhRXoEtGRLxM_byK18VNWeExvnlmBYJ9DLr6LcSZk5pqQlombrM1oaLTJPyHTVCIrcWPI'
const id = '5d2f818f81808747b77a8d17'
const path = '/'

const url = 'http://localhost:3000'


describe('File Repository Controller', () => {
    describe('GET', () => {
        xit('should 200 if the server is running', (done: Mocha.Done) => {
            chai.request(app)
                .get('http://localhost:3000')
                .set("Authorization", token)
                .end((error: any, response: any) => {
                    expect(response.status).to.equal(200)
                })
        })
        it("should 200 after find'ing the users files, using the UserID and path", (done: Mocha.Done) => {
            // chai.request(app)
            //     .get('/api/repo')
            //     .query({ id: id, path: path })
            //     .end((error: any, response: any) => {
            //         expect(response.status).to.equal(200)
                    
            //         done()
            //     })
            request.get(url, (error, response, body) => {
                expect()
            })
        })
    })
})
