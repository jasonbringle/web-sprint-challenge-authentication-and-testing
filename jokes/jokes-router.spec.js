const request = require('supertest')
const server = require('../api/server.js');
const db = require('../database/dbConfig.js');

describe("JOKES",()=> {
        let token = ''

        beforeAll(async ()=> {
            await db("users").truncate()
            let user = {username: 'Todd', password: 'Passworeo'}
            await request(server).post("/api/auth/register").send(user)
            await request(server).post("/api/auth/login")
                .send(user)
                .then(res => {
                    token = res.body.token;
                    console.log("TOKEN AT BEFOREALL",token)
            })
        })

        describe('/Get', ()=> {    
            it("Returns status 200", async ()=> {
                await request(server).get("/api/jokes/")
                    .set("Authorization",token)
                    .then(res => {
                        expect(res.status).toBe(200)
                    })
                    
                let added = await db('users').where({username: "Todd"})
                await request(server).delete(`/api/auth/${added[0].id}`)
            })

            it('Returns a JSON/app', async ()=> {
                await request(server).get("/api/jokes/")
                        .set("Authorization",token)
                        .then(res => {
                            expect(res.type).toBe('application/json')
                        })
            })
        })

            
})