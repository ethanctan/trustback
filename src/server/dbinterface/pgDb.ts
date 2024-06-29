import pg from 'pg'

class PostgresDb{

    client : pg.Client
    tableName : string
    parser : PgParser

    constructor(tableName : string, databaseName = "aegis_test"){
        this.tableName = tableName

        this.client = new pg.Client({
            host: "localhost",
            user: "brandonman",
            port: 5432,
            password: "Aegis123",
            database: databaseName
        })
        this.client.connect()
        this.parser = new PgParser()

    }

    async search(condition : string){
        let queryString = `SELECT * FROM ${this.tableName} WHERE ${condition}`
        let query = await this.client.query(queryString)
        return query
    }

    

}

class PgParser{

    constructor(){}

    parseTupleList(s : string){
        s = s.replace(/['"]+/g, '').replace("{", "").replace("}", "")
        let stringList = this.parseParenthesesString(s)
        let parsedList = []
        for (let i=0; i < stringList.length; i++){
            let parsedString = stringList[i].replace("(", "").replace(")", "")
            parsedList.push(parsedString.split(","))
        }
        return parsedList
    }

    parseParenthesesString(s : string) {
        var depth = 0, seg = 0, rv = [];
        s.replace(/[^(),]*([)]*)([(]*)(,)?/g,
                  function (m, cls, opn, com, off, s) {
          depth += opn.length - cls.length;
          var newseg = off + m.length;
          if (!depth && com) {
            rv.push(s.substring(seg, newseg - 1));
            seg = newseg;
          }
          return m;
        });
        rv.push(s.substring(seg));
        return rv;
      }
}

export {PostgresDb, PgParser}