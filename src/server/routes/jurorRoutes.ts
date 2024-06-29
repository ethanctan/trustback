import express, { Request, Response, response } from 'express';

const router = express.Router()

/**
 * Route to handle votes on a specific case. 
 * Requires the following json format:
 * {
 * caseId : string
 * jurorId : string 
 * decision : "accept" or "deny"
 * }
 * jurorId refers to the wallet id of the juror
 */
router.post("/vote", (req : Request, res : Response) => {
    res.send("juror vote submitted")
})


/**
 * 
 */
router.post("/apply", (req : Request, res : Response) => {
    res.send("application received")
})


/**
 * Gets juror info
 */
router.get("/info/:walletId", (req : Request, res : Response) =>{ 
    res.send("Sending juror info")
})


/**
 * Handles routes whether juror opts in or opts out
 * Requires the request to be:
 * {
 * jurorId : string
 * protocol : string
 * isOptedIn : boolean
 * }
 */
router.post("/commitProtocol", (req : Request, res : Response) => {

})

router.get("/cases/:walletId", (req : Request, res : Response) => {
    
})

export default router