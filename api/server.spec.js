const request = require('supertest');
const server = require('./server.js');
const db = require('../database/dbConfig.js')


describe('Server.js', ()=> {
    test("That the server is using the test environment", () => {
        expect(process.env.DB_ENV).toBe('testing')
    });

    describe('Register', () => {
        it('Should return status 200 on Register', async ()=> {
            db('users').truncate()
            let data = {
                username: "Lauren",
                password: "fiddlestix"
            }
            const res =  await request(server).post('/api/auth/register').send(data)
            let addedMember = await db('users').where({username: data.username})
            expect(res.status).toBe(201)
            await request(server).delete(`/api/auth/${addedMember[0].id}`)

        })

        it("Should return error code 500 when mallformed submission", async ()=> {
            let brokeData = {
                things: "Broken"
            }

            const res = await request(server).post('/api/auth/register').send(brokeData)
            expect(res.status).toBe(500)
        })
    })

    describe('/Login', () => {
        it('Checks for code 200 on log in', async ()=> {
            let data = {
                username: "Lauren",
                password: "fiddlestix"
            } 
           const member  =  await request(server).post('/api/auth/register').send(data)
            
            const res =  await request(server).post('/api/auth/login').send(data)
            let addedMember = await db('users').where({username: data.username})

            expect(res.status).toBe(200)
            await request(server).delete(`/api/auth/${addedMember[0].id}`)


        })

        it("Checks for failed credentials", async()=> {
            let data = {
                user: "Lauren",
                pass: "fiddlestix"
            } 
           const member  =  await request(server).post('/api/auth/register').send(data)
            
            const res =  await request(server).post('/api/auth/login').send(data)

            expect(res.status).toBe(500)
        })
    })
});