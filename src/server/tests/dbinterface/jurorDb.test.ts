import { PgJurorDb } from "../../dbinterface/jurorDbInterface";
import pg from 'pg'
import { testDb } from "./testConfig";

const pgJurorDb = new PgJurorDb()
const client = new pg.Client(testDb)


beforeAll(() => {
    client.connect()
    
})


beforeEach(async () => {
    await client.query("\
    INSERT INTO juror(wallet, is_doxed, email, certifications, work_experience, education_history) \
    VALUES ('doug', false, 'doug@harvard.edu', ARRAY['certification'], ARRAY[('tattoo', 5)]::experience[], ARRAY[('masters', 'MIT', 'meche')]::education[]),\
    ('Sarah', false, 'sarah@email.com', ARRAY['certification4'], ARRAY[('experience4', 2)]::experience[], ARRAY[('Bachelor', 'Yale', 'History')]::education[]),\
    ('Michael', true, 'michael@student.com', ARRAY['certification5'], ARRAY[('experience5', 3)]::experience[], ARRAY[('Bachelor', 'Columbia', 'Mathematics')]::education[]),\
    ('Emily', false, 'emily@gmail.com', ARRAY['AWS'], ARRAY[('experience6', 4), ('experience7', 5)]::experience[], ARRAY[('Bachelor', 'Princeton', 'Economics')]::education[]);")

})


afterEach(async () => {
    await client.query("DELETE FROM juror")
})



describe("Test find juror", () => {
    it("Should return empty juror if juror not found", async () => {
        let juror = await pgJurorDb.findById("Not exist")
        expect(juror.isNull()).toBe(true)
    })
    it("Should return an existing juror", async () => {
        let juror = await pgJurorDb.findById('Emily')
        expect(juror.email).toBe('emily@gmail.com')
    })
})