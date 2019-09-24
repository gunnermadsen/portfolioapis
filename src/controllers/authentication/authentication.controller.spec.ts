
import { PortfolioServer } from '../../../app'
import { DoneFn } from '@jest/types/build/Global'

import * as mongoose from 'mongoose'
import * as request from 'supertest'
import * as path from 'path'
import * as fs from 'fs'

const portfolioserver = new PortfolioServer()

let app = portfolioserver.server

const token = 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZDJmODE4ZjgxODA4NzQ3Yjc3YThkMTciLCJlbWFpbCI6Im1hZGd1bm5lciIsImV4cCI6MTU2OTYyOTUxMCwiaWF0IjoxNTY5MDI0NzEwfQ.QLC-aOVvkw65ZpZNLp0q1Cy_Gq5Vo0Umlt5IBjK92fKE0FkVw4J57MNIXLvSZ6kdXLRkwUoFSnIEeXbJlaVcT7hFKHriX4sXBiR7HZbhRXoEtGRLxM_byK18VNWeExvnlmBYJ9DLr6LcSZk5pqQlombrM1oaLTJPyHTVCIrcWPI'
const id = '5d2f818f81808747b77a8d17'

describe('Authentication Tests', () => {
    describe('POST', () => {
        it.skip('should 200 after authenticating the user', (done: DoneFn) => {
            request(app)
                .post('/api/users/login')
                .send({ UserName: 'madgunner', Password: 'Megatron1234!' })
                .then((response) => {
                    expect(response.status).toBe(200)
                    console.log(response.body)
                    done()
                })
                .catch((error) => {
                    expect(error).toMatch('error')
                    done()
                })
        })

        it ('should 400 after attempting to register a user while the username is taken', (done: DoneFn) => {
            request(app)
                .post('/api/users/register')
                .send({ UserName: 'madgunner', Email: 'gunner@madsen.com', Password: 'megatron1234' })
                .then((response) => {
                    expect(response.status).toBe(400)
                    done()
                })
                .catch((error) => {
                    expect(error.status).toBe(500)
                    done()
                })
        })

        it.skip('should 400 after attemping to authenticate the user with the wrong password', (done: DoneFn) => {
            request(app)
                .post('/api/users/login')
                .send({ UserName: 'madgunner', Password: 'megatron!' })
                .then((response) => {
                    expect(response.status).toBe(400)
                    done()
                })
                .catch((error) => {
                    console.log(error)
                    expect(error.status).toBe(500)
                    done()
                })
        })
    })

    describe('GET', () => {
        it ('should 200 after destroying the users login session', (done: DoneFn) => {
            request(app)
                .get('/api/users/logout')
                .set({ 'Authorization': token })
                .then((response) => {
                    expect(response.status).toBe(200)
                    done()
                })
                .catch((error) => {
                    expect(error).toMatch('error')
                    done()
                })
        })

        it ('should 200 after retrieving all users from the database', (done: DoneFn) => {
            request(app)
                .get('/api/users')
                .set({ 'Authorization': token })
                .then((response) => {
                    expect(response.status).toBe(200)
                    done()
                })
                .catch((error) => {
                    expect(error.status).toBe(500)
                    done()
                })
        })
    })

    afterAll(() => mongoose.disconnect())
})