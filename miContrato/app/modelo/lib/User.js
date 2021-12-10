const crypto=require('crypto') // Importación de la biblioteca criptográfica de node

// Clase User
class User{

    // Función para autenticar usuario
    static async auth(userid,password,db_connection){
        return new Promise((resolve,reject)=>{
            var query_promise=db_connection.runQuery(`select password from users where userid='${userid}'`)
            var try_hashed=crypto.createHash('sha256').update(password, 'utf8').digest().toString("hex")
            query_promise.then((result)=>{
                if (result.length>0){
                    if(result[0].password==try_hashed){
                        resolve(true)
                    }else{
                        reject("Contraseña incorrecta")
                    }
                }else{
                    reject("No existe el usuario")
                }
            },(error)=>{
                reject(error)
            })
        })
    }

    // Función para crear el objeto con base en la información recuperada de la base de datos
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

    // Función para obtener datos de la dependencia
    async retrive_dependency_data(db_connection){
        var dependenciaid = this.dependenciaid
        return new Promise((resolve,reject)=>{
            var query_promise=db_connection.runQuery(`select * from catalogo_dependencia where dependenciaid='${dependenciaid}'`)
            query_promise.then((result)=>{
                resolve(result[0].dependencia)
            },(error)=>{
                reject(error)
            }).catch((exception)=>{
                reject(exception)
            })
        })
    }

    // Construcción para un objeto User
    constructor(data){
        this.userid=data.userid;
        this.nombre=data.nombre;
        this.paterno=data.paterno
        this.materno=data.materno
        this.nombreCompleto=`${this.paterno} ${this.materno?this.materno+' ':''}${this.nombre}`
        this.dependenciaid=data.dependenciaid
        this.API_KEY=data.API_KEY
    }
}
module.exports = User;
