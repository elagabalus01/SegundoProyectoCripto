var mysql = require('mysqlconnector');
const fs = require('fs');

class DatabaseFacade{
    constructor(){
        const env = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
        const database_config=env["database"]
        // Conexión con la base de datos
        this.connection = new mysql.MySqlConnection('localhost',
            database_config["user"], database_config["password"], database_config["database"]);

        // Se informa el estado de la conexión
        this.connection.connectAsync().then((result)=>{
            console.log(`Conexión establecida ${result}`)
        },(error)=>{
            console.log("No se pudo establecer la conexión")
            return false
        }).catch((error)=>{
            console.log(`Excepción: ${error}`)
            return false
        });
    }

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
