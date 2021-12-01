DatabaseFacade=require('./DatabaseFacade')
var database=new DatabaseFacade()
class RegisterUser{
    // Clase para registrar un usuario en la base de datos
    static async register_user (data){
        var api_key="unaLllave"
        var query=`insert into users values('${data.userid}','${data.nombre}','${data.paterno}','${data.materno}',${data.dependenciaid},'${api_key}');`
        return new Promise((resolve,reject)=>{
            var query_promise=database.runQuery(query)
            query_promise.then((result)=>{
                return resolve(result)
            },(error)=>{
                reject(error)
            })
        })
    }
}

module.exports = RegisterUser;
