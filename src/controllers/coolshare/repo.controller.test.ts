

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
        it ('should 200 after consuming /api/repo and successfully retrieving the users files from the database', (done: DoneFn) => {
            request(app)
                .get('/api/repo')
                .set({ 'Authorization': token })
                .query({ id: id, path: '/' })
                .then((response) => {
                    expect(response.status).toBe(200)
                    expect(response.body.result.length).toBeGreaterThan(0)
                    done()
                })
                .catch((error) => {
                    expect(error).toBeTruthy()
                    done()
                })
        })

        it ('should 200 after consuming /api/repo/download and downloading the specified resource', (done: DoneFn) => {
            request(app)
                .get('/api/repo/download')
                .set('Content-Type', 'application/json')
                .set('Accept', '*/*')
                .responseType('json')
                .query({ path: '/', resource: 'Gunner Madsen - Help Desk Technician.docx', id: id })
                .then((response) => {
                    expect(response.status).toBe(200)
                    done()
                })
                .catch((error) => {
                    expect(error).toBeTruthy()
                    done()
                })
        })
    })

    describe ('POST', () => {
        it ('should 204 after consuming /api/repo/delete and creating the MyMovies folder', (done: DoneFn) => {
            request(app)
                .post('/api/repo/create')
                .set({ 'Authorization': token })
                .send({ id: id, path: '/', data: { FolderName: 'MyMovies', Accessibility: 0 }})
                .then((response) => {
                    expect(response.status).toBe(204)
                    done()
                })
                .catch((error) => {
                    expect(error).toBeTruthy()
                    done()
                })
        })

        it ('should 204 after consuming /api/repo/upload and successfully uploading a file', (done: DoneFn) => {
            request(app)
                .post('/api/repo/upload')
                .attach('0', path.join(__dirname, 'resume.pdf'))
                .attach('path', '/')
                .attach('userId', id)
                .then((response) => {
                    expect(response.status).toBe(204)
                    done()
                })
                .catch((error) => {
                    expect(error).toBeTruthy()
                    done()
                })
        })

        it ('should 201 after deleting the MyMovies folder', async () => {
            const response = await request(app)
                .post('/api/repo/delete')
                .set({ 'Authorization': token })
                .send({ id: id, path: '/', entities: [{ name: 'MyMovies', path: '/MyMovies', type: 'Folder'}] })
            
            expect(response.status).toBe(201)
            
        })

        it ('should 200 after marking an entity as a favorite', (done: DoneFn) => {
            request(app)
                .post('/api/repo/favorite')
                .set({ 'Authorization': token })
                .send({ fileId: '90d8d2f7-b3f0-47f4-bbb4-2b646b729a16', state: true, userId: id })
                .then((response) => {
                    expect(response.status).toBe(200)
                    done()
                })
                .catch((error) => {
                    expect(error).toBeTruthy()
                    done()
                })
            
        })

        it ('should 204 after renaming the file', (done: DoneFn) => {
            
            const payload = {
                cwd: '/',
                userId: id,
                entity: {
                    fileId: '5aa8cbd4-e58c-48ef-bcd5-a30dbb6915cc',
                    newName: 'music',
                    type: 'Folder',
                    path: '/music'
                }
            }
            
            request(app)
                .post('/api/repo/rename')
                // .set({ 'Authorization': token })
                .send(payload)
                .then((response) => {
                    expect(response.status).toBe(200)
                    done()
                })
                .catch((error) => {
                    expect(error).toBeFalsy()
                    done()
                })
            
        })
    })

    afterAll(() => mongoose.disconnect())
})