DatabaseFacade=require('./DatabaseFacade')
var database=new DatabaseFacade()
class RegisterUser{
    // Clase para registrar un usuario en la base de datos
    static async register_user (data){
        var api_key="SOY YO"
        var query=`insert into users values('${data.userid}','${data.nombre}','${data.paterno}','${data.materno}',${data.dependenciaid},'${api_key}');`
        var query_promise=database.runQuery(query)
        console.log(query_promise)
        // query_promise.then((result)=>{
        //     console.log(`Registro usuario todo bien: ${result}`)
        //     console.log(result)
        // },(error)=>{
        //     console.log(`Registro usuario error: ${error}`)
        //     console.log(error)
        // })
        //
        // return true
    }
}

module.exports = RegisterUser;
