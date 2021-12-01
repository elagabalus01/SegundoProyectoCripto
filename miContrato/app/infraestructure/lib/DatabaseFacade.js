var mysql = require('mysql');
const fs = require('fs');

class DatabaseFacade{
    constructor(){
        const env = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
        const database_config=env["database"]
        this.con = mysql.createConnection({
            host: "localhost",
            user: database_config["user"],
            password: database_config["password"],
            database: database_config["database"]
        });
        this.con.connect(function(err) {
            if (err){
                throw err;
            }
            console.log("Database connected!");
        });
    }

    runQuery(query){
        var resultado
        var mycallback=(err,result)=>{
            if(err){
                this
                console.log("Error")
                return true
            }else{
                console.log("Se grabó correctamente")
                return false
            }
        }
        this.con.query(query,mycallback)
        console.log(resultado(false));
        //console.log("Todo bien")
        //console.log("error")
    }
        // query_promise.then((result)=>{
        //     console.log("Query excecuted");
        //     return true
        // },(error)=>{
        //     console.log(`Query rejected ${error}`);
        //     return false
        // }).catch((error)=>{
        //     console.log(`Query exception ${error}`);
        //     return false
        // })
    //}
}

module.exports = DatabaseFacade;
