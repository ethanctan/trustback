import { PgParser } from "../../dbinterface/pgDb";


const pgParser = new PgParser()
describe("Test parse parentheses string", () => {
    it("Should parse a string", () => {
        expect(pgParser.parseParenthesesString(
            '(experience6,4),(experience7,5)')).toStrictEqual(["(experience6,4)", "(experience7,5)"])
    })
    it("Should parse a single string", () => {
        expect(pgParser.parseParenthesesString(
            "(Bachelor,Princeton,Economics)")).toStrictEqual(["(Bachelor,Princeton,Economics)"])
    })
})

describe("Test parse list", () => {
    it("Should parse a single string", () => {
        expect(pgParser.parseTupleList(
            '{"(Bachelor,Princeton,Economics)"}')).toStrictEqual([["Bachelor","Princeton","Economics"]])
    })
    it("Should parse multiple strings", () => {
        expect(pgParser.parseTupleList(
            '{"(experience6,4)","(experience7,5)"}')).toStrictEqual([["experience6","4"],["experience7","5"]])
    })
})