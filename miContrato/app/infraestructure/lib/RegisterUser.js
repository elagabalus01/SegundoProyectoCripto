DatabaseFacade=require('./DatabaseFacade')
var database=new DatabaseFacade()
class RegisterUser{
    // Clase para registrar un usuario en la base de datos
    static register_user (data){
        var api_key="SOY YO"
        var query=`insert into users values('${data.nombre}','${data.paterno}','${data.materno}','${api_key}');`
        database.runQuery(query)
    }
}

module.exports = RegisterUser;
