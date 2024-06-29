import express, { Request, Response, response } from 'express';
import UserReader from '../interactor/userInteractor/userReader'; 



const router = express.Router()


/**
 * Sends a disputeForm object from the user to the backend
 * Form is of the following json structure:
 *  DisputeForm{
    dispute : DisputeInfo
    email ?: string
    disputeFee : number
    gasCost : number
  }
   DisputeInfo = {
    txnHash : string;
    textEvidence : string;
    sender : string;
    recipient : string;
    amount : number;    
}

 */
router.post('/form', (req : Request, res : Response) => {
  res.send('Form submitted')
})


/**
 * Sends an appeal form from the user to the backend.
 * Same formatting as sending a dispute form.
 */
router.post('/appeal', (req : Request, res : Response) => {
    res.send("Appeal submitted")
})

/**
 * Requests for current disputes 
 * Returns a list of dispute objects in the following format:
 * {
 * dispute : [{
 * txnHash : string;
    textEvidence : string;
    sender : string;
    recipient : string;
    amount : number;  
    status : VoteStatus;
  }, {} ... 
 * }]
 * }
 */

const userReader = new UserReader()
router.get('/info', (req : Request, res : Response) => {
    /**
     * Note: Every time you start the server, the third time this endpoint is called, the vote status will change from inProgress to accepted.
     */
    let userInfo = userReader.getUser(req.body)
    res.send(userInfo)
})


export default router