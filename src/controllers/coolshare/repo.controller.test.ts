
import 'jest'

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
const url = 'http://localhost:3000'


describe ('Repository Action Method Tests', () => {

    describe ('GET', () => {
        it ('should 200 after consuming /api/repo and successfully retrieving the users files from the database', async () => {
            const response = await request(app)
                .get('/api/repo')
                .set({ 'Authorization': token })
                .query({ id: id, path: '/' })

            expect(response.status).toBe(200)
            expect(response.body.length).toBeGreaterThan(0)
        })

        it ('should 200 after consuming /api/repo/download and downloading the specified resource', async () => {
            const response = await request(app)
                .get('/api/repo/download')
                .set('Content-Type', 'application/json')
                .set('Accept', '*/*')
                .responseType('json')
                .query({ path: '/', resource: 'Gunner Madsen - Help Desk Technician.docx', id: id })
            expect(response.status).toBe(200)
        })
    })

    describe ('POST', () => {
        it ('should 204 after consuming /api/repo/delete and creating the MyMovies folder', async () => {
            const response = await request(app)
                .post('/api/repo/create')
                .set({ 'Authorization': token })
                .send({ id: id, path: '/', data: { FolderName: 'MyMovies', Accessibility: 0 }})

            expect(response.status).toBe(204)
        })

        it ('should 204 after consuming /api/repo/upload and successfully uploading a file', async () => {
            const response = await request(app)
                .post('/api/repo/upload')
                .attach('0', path.join(__dirname, 'resume.pdf'))
                .attach('path', '/')
                .attach('userId', id)

            expect(response.status).toBe(204)

        })

        it ('should 201 after deleting the MyMovies folder', async () => {
            const response = await request(app)
                .post('/api/repo/delete')
                .set({ 'Authorization': token })
                .send({ id: id, path: '/', entities: [{ name: 'MyMovies', path: '/MyMovies', type: 'Folder'}] })
            
            expect(response.status).toBe(201)
            
        })

        it ('should 200 after marking an entity as a favorite', async (done: DoneFn) => {
            const response = await request(app)
                .post('/api/repo/favorite')
                .set({ 'Authorization': token })
                .send({ fileId: '291207d3-64b3-4811-988f-30acf047f3c2', state: true, userId: id })

            expect(response.status).toBe(200)
            done()
        })

        it ('should 200 after renaming an entity in the repository', async (done: DoneFn) => {
            const response = await request(app)
                .post('/api/repo/rename')
                // .set({ 'Authorization': token })
                .send({ userId: id, entity: { Id: '291207d3-64b3-4811-988f-30acf047f3c2', Name: 'resume.pdf' }})

            expect(response.status).toBe(200)
            done()
        })
    })

    afterAll(() => mongoose.disconnect())
})