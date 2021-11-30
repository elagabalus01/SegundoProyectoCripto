var mysql = require('mysql');
class DatabaseFacade{
    constructor(){
        this.con = mysql.createConnection({
            host: "localhost",
            user: "xxxx",
            password: "xxxx",
            database: "prueba"
        });
        this.con.connect(function(err) {
            if (err){
                throw err;
            }
            console.log("Database connected!");
        });
    }

    async runQuery(query){
        this.con.query(query, function(err, result){
            if (err){
                throw err
            }else{
                console.log("Query excecuted");
            }
        })
    }
}

module.exports = DatabaseFacade;
