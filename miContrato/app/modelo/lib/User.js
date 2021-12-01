const crypto=require('crypto') // Importación de la biblioteca criptográfica de node
class User{
    static async auth(userid,password,db_connection){
        return new Promise((resolve,reject)=>{
            // Primer query para evular la contraseña
            var query_promise=db_connection.runQuery(`select password from users where userid='${userid}'`)
            var try_hashed=crypto.createHash('sha256').update(password, 'utf8').digest().toString("hex")
            query_promise.then((result)=>{
                // Se evalúa la contraseña hasheada
                if(result[0].password==try_hashed){
                    // Segunda consulta para recuperar los datos
                    User.retrive_user_data(userid,db_connection).then((user)=>{
                        resolve(user)
                    },(error)=>{
                        reject(`No se pudo recuperar la información del usuario ${error}`)
                    })
                }else{
                    reject("Contraseña incorrecta")
                }
            },(error)=>{
                reject(error)
            })
        })
    }
    // Función para crear el objeto con base en los datos recuperados de la base de datos
    static async retrive_user_data(userid,db_connection){
        return new Promise((resolve,reject)=>{
            var query_promise=db_connection.runQuery(`select * from users where userid='${userid}'`)
            query_promise.then((result)=>{
                var user=new User(result[0])
                resolve(user)
            },(error)=>{
                reject(error)
            })
        })

    }
    constructor(data){
        this.userid=data.userid;
        this.nombre=data.nombre;
        this.paterno=data.paterno
        this.materno=data.materno
        this.dependenciaid=data.dependenciaid
        this.API_KEY=data.API_KEY
    }
}
module.exports = User;
