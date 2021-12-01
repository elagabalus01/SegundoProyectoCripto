DatabaseFacade=require('./DatabaseFacade')
const crypto=require('crypto') // Importación de la biblioteca criptográfica de node
var database=new DatabaseFacade()
class RegisterUser{
    // Clase para registrar un usuario en la base de datos
    static async register_user (data){
        var api_key=RegisterUser.generateAPIKey()
        var hashed_pass=crypto.createHash('sha256').update(data.password, 'utf8').digest().toString("hex")
        var query=`insert into users values('${data.userid}','${hashed_pass}','${data.nombre}','${data.paterno}','${data.materno}',${data.dependenciaid},'${api_key}');`
        return new Promise((resolve,reject)=>{
            var query_promise=database.runQuery(query)
            query_promise.then((result)=>{
                return resolve(result)
            },(error)=>{
                reject(error)
            })
        })
    }
    static generateAPIKey(){
        var user_uuid=crypto.randomUUID()
        return crypto.createHash('sha256').update(user_uuid, 'utf8').digest().toString("hex")
    }
}

module.exports = RegisterUser;
