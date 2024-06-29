import { DisputeInfo, EmptyDisputeInfo } from "./disputeInfo";


interface CaseDbInterface{

    getCaseById(id : string) : Promise<DisputeInfo>

    getCaseBySender(sender : string) : Promise<DisputeInfo[]>

    getCaseByRecipient(recipient : string) : Promise<DisputeInfo[]>

    addCase(dispute : DisputeInfo) : void

}


import pg from 'pg';
import { PostgresDb } from "./pgDb";

class PgDisputeDb extends PostgresDb implements CaseDbInterface {
    
    client : pg.Client

    constructor(dbName ?: string){
        super("dispute", dbName)
    }


    async getCaseById(id: string): Promise<DisputeInfo> {
        let query = await this.search(`txn_hash = ${id}`)
        if (query.rows.length == 0){
            return new EmptyDisputeInfo()
        }
        return this.createFromJson(query.rows[0])
    }

    async getCaseBySender(sender : string): Promise<DisputeInfo[]>{
        let queryResult = await this.search(`sender = '${sender}'`)
        return this.createFromJsonList(queryResult.rows)
    }

    async getCaseByRecipient(recipient : string): Promise<DisputeInfo[]>{
        let queryResult = await this.search(`recipient = '${recipient}'`)
        return this.createFromJsonList(queryResult.rows)
    }


    // TODO - test
    async addCase(dispute : DisputeInfo){
        if (dispute.isNull()){return}

        await this.client.query(`INSERT INTO dispute (
            txn_hash, text_evidence, sender, recipient, amount
        ) VALUES 
        (
            ${dispute.txnHash},
            ${dispute.textEvidence},
            ${dispute.sender},
            ${dispute.recipient},
            ${dispute.amount}
        )`)
    }

    
    private createFromJsonList(jsonList : object[]){
        let result : DisputeInfo[] = []
        for (let i = 0; i < jsonList.length; i++){
            let json = this.createFromJson(jsonList[i])
            result.push(json)
        }
        return result
    }
    
    private createFromJson(json : object){
        json["txnHash"] = json["txn_hash"]
        return new DisputeInfo(json)
    }


}


export { CaseDbInterface, PgDisputeDb }