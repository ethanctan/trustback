const axios = require('axios');

interface BlockExplorer{

    findTransactionByTxnHash(txnHash : string) : Transaction | Promise<Transaction>

}

// TODO: Set 1,000 to be the breakpoint between gwei and eth

type Transaction = {
    "blockNumber": string,
    "timeStamp": string,
    "from": string,
    "to": string,
    "value": number,
    "contractAddress" : string,
    "isError": boolean,
    "errCode" ?: string
}

class MockBlockExplorer implements BlockExplorer{

    findTransactionByTxnHash(txnHash: string) : Transaction{
        return  {
            "blockNumber":"12345",
            "timeStamp":"6789",
            "from":"0x2cac6e4b11d6b58f6d3c1c9d5fe8faa89f60e5a2",
            "to":"0x66a1c3eaf0f1ffc28d209c0763ed0ca614f3b002",
            "contractAddress":"0xc5102fe9359fd9a28f877a67e36b0f050d81a3cc",
            "value": 0.01,
            "isError": false,
            "errCode":""
         }
    }

}

class EtherScanBlockExplorer implements BlockExplorer{

    apiKey : string;

    async findTransactionByTxnHash(txnHash: string) : Promise<Transaction> {
        let baseUrl = "https://api.etherscan.io/api?module=account&action=txlistinternal"
        let url = baseUrl + `&txhash=${txnHash}` + `&apiKey=${txnHash}`
        let response = await axios.get(url)
        return response
    }
}