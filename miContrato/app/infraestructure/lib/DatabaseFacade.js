var mysql = require('mysqlconnector');
const fs = require('fs');

// Clase DatabaseFacade
class DatabaseFacade{

    // Constructor para un objeto DatabaseFacade
    constructor(){
        const env = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
        const database_config=env["database"]

        this.connection = new mysql.MySqlConnection(database_config["host"],
            database_config["user"], database_config["password"], database_config["database"]);

        this.connection.connectAsync().then((result)=>{
            console.log(`Conexión con la base de datos establecida`)
        },(error)=>{
            console.log(`Error: ${error}`)
            return false
        }).catch((error)=>{
            console.log(`Excepción: ${error}`)
            return false
        });
    }

    // Función para hacer una consulta
    async runQuery(query){
        return new Promise((resolve,reject)=>{
            var query_promise=this.connection.queryAsync(query)
            query_promise.then((result)=>{
                resolve(result)
            },(error)=>{
                reject(error)
            }).catch((exception)=>{
                reject(exception)
            })
        })
    }
}

module.exports = DatabaseFacade;
