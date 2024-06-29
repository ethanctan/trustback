import { JurorDecisions, VoteStatus } from "../../dbinterface/case"

let jurorDecisions = new JurorDecisions()
let testJuror = "testJuror"
beforeEach(() => {
    jurorDecisions = new JurorDecisions
})



describe("Test addJuror", () =>{
    it("Should have 0 jurors to begin with", () =>{
        expect(jurorDecisions.getJurorCount()).toBe(0)
    })
    it("Should add a juror", () =>{
        jurorDecisions.addJuror(testJuror)
        let resultJurors = jurorDecisions.getJurors()
        expect(resultJurors.get(testJuror)).toBe(VoteStatus.inProgress)
    })
    it("Should only add a juror once", () =>{
        jurorDecisions.addJuror(testJuror)
        jurorDecisions.addJuror(testJuror)
        expect(jurorDecisions.getJurorCount()).toBe(1)
    })
    it("Can add two jurors ", () =>{
        jurorDecisions.addJuror(testJuror)
        jurorDecisions.addJuror("testJuror2")
        expect(jurorDecisions.getJurorCount()).toBe(2)
    })
    it("Can add multiple jurors ", () =>{
        jurorDecisions.addJuror(testJuror)
        jurorDecisions.addJuror("testJuror2")
        jurorDecisions.addJuror("testJuror3")
        expect(jurorDecisions.getJurorCount()).toBe(3)
    })
    it("Can add juror and its vote", () => {
        jurorDecisions.addJuror(testJuror, VoteStatus.accepted)
        let resultJurors = jurorDecisions.getJurors()
        expect(resultJurors.get(testJuror)).toBe(VoteStatus.accepted)
    })
})

describe("Test updateJurorVote", () => {
    it("Should update a juror's vote", () => {
        jurorDecisions.addJuror(testJuror)
        jurorDecisions.updateJurorVote(testJuror, VoteStatus.accepted)
        let resultJurors = jurorDecisions.getJurors()
        expect(resultJurors.get(testJuror)).toBe(VoteStatus.accepted)
    })
    it("Should not update a juror's vote if already voted", () => {
        jurorDecisions.addJuror(testJuror, VoteStatus.accepted)
        expect(jurorDecisions.updateJurorVote(testJuror, VoteStatus.inProgress)).toBe(false)
    })
    it("Should not update a juror's vote if juror doesn't exist", () => {
        expect(jurorDecisions.updateJurorVote(testJuror, VoteStatus.inProgress)).toBe(false)
    })
})

