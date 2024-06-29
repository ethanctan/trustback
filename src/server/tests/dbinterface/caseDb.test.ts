import { PgDisputeDb } from "../../dbinterface/caseDbInterface";
import pg from 'pg'
import { DisputeInfo } from "../../dbinterface/disputeInfo";
import { testDb } from "./testConfig";

const db = new PgDisputeDb()
const client = new pg.Client(testDb)

const testDispute = new DisputeInfo({
    txnHash : "1234",
    textEvidence : "hello",
    sender : "me",
    recipient : "someone",
    amount : 5
})

describe("Test get case by txn hash", () => {
    it("Should get existing case", async () => {
        let val = await db.getCaseById("1")
        expect(val.amount).toBe(5)
    })
    it("Should return an empty case if user not found", async () => {
        let val = await db.getCaseById("100")
        expect(val.isNull()).toBe(true)
    })
})

describe("Test get case by sender", () => {
    it("Should return an empty list if user not found", async () => {
        let val = await db.getCaseBySender("Not exist")
        expect(val.length).toBe(0)
    })
    it("Should return an multiple cases if found", async () => {
        let val = await db.getCaseBySender("world")
        expect(val.length).toBe(2)
    })
    it("Should return an existing case if found", async () => {
        let val = await db.getCaseBySender("test2")
        expect(val.length).toBe(1)
    })
})

describe("Test get case by recipient", () => {
    it("Should return an empty list if no one found", async () => {
        let val = await db.getCaseByRecipient("Not exist")
        expect(val.length).toBe(0)
    })
    it("Should return a case if it exists", async () => {
        let val = await db.getCaseByRecipient("hello")
        expect(val.length).toBe(1)
    })
    it("Should return multiple cases if they exist", async () => {
        let val = await db.getCaseByRecipient("goodbye")
        expect(val.length).toBe(2)
    })
})


