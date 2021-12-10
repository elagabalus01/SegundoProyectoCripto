const utils=require('./infraestructure') // Biblioteca fachada para conexión con base de datos
const modelos=require('./modelo') // Importa los modelos de la lógica de negocio
const crypto=require('crypto') // Importación de la biblioteca criptográfica de node

// Función de prueba para obtener las transacciones
function testFabric(){
    facade=new connectLedger.LedgerFacade()
    var result;
    result=facade.getAllTransactions()
    result.then((datos)=>{
        console.log(`Datos: ${datos}`)
    })
}

// Función de prueba para probar la conexión a la BD
function test_db(){
    database=new utils.DatabaseFacade()
    var username='elagabalus'
    var query_promise;
    query_promise=database.runQuery(`SELECT * FROM catalogo_dependencia;`)
    query_promise.then((result)=>{
        result.forEach((item) => {
            console.log(item.dependenciaid)
            console.log(item.dependencia)
        });
    },(error)=>{
        console.log(`Hubo un error ${error}`)
    })
    return;
}

// Función de prueba para registrar usuario
function test_user_reg(){
    user_data={
        userid:"usuario",
        password:"password",
        nombre:"Ángel",
        paterno:"Santander",
        materno:"Martínez",
        dependenciaid:1
    }
    utils.RegisterUser.register_user(user_data).then((result)=>{
        console.log("Se insertó usuario")
    },(error)=>{
        console.log(`Error al insertar usuario ${error}`)
    })
}

// Función de prueba para el UUID
function test_uuid(){
    user_uuid=crypto.randomUUID()
    console.log(crypto.createHash('sha256').update(user_uuid, 'utf8').digest().toString("hex"))
}

// Función de prueba para la API KEY
function test_api_key(){
    console.log(utils.RegisterUser.generateAPIKey())
}

// Función de prueba para el usuario
function test_user(){
    database=new utils.DatabaseFacade()
    sessions={}
    user_promise=modelos.User.auth('userx','password',database);
    user_promise.then((user)=>{
        sessions[user.userid]=user
        console.log(sessions)
    },(error)=>{
        console.log(`error al autenticar al usuario ${error}`)
    })
    console.log(sessions)
}

// Función de prueba para dependencias
function dependencias(){
    database=new utils.DatabaseFacade()
    var query_promise;
    var data=[]
    query_promise=database.runQuery(`SELECT * FROM catalogo_dependencia;`)
    query_promise.then((result)=>{
        result.forEach((item) => {
            data.push({dependenciaid:item.dependenciaid,dependencia:item.dependencia})
        });
        console.log(data)
    },(error)=>{
        console.log(`Hubo un error ${error}`)
    })
}

// Función de prueba para obtener dependencia
function test_dependencia(){
    database=new utils.DatabaseFacade()
    user=new modelos.User({userid:"gus",nombre:"gustavo",paterno:"jimenez", materno:"",dependenciaid:1})
    console.log(user.nombreCompleto)
    dependencia_promesa=user.retrive_dependency_data(database)
    dependencia_promesa.then((result)=>{
        console.log(result)
    })
}

// Función de prueba para calcular fecha actual
function calcularFecha(){
    var mydate = new Date(Date.now())
    var month = ["enero", "febrero", "marzo", "abril", "mayor", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"][mydate.getMonth()];
    mydate_today=mydate.getDay()+" de "+month+" del "+mydate.getFullYear()
    +" a las "+mydate.getHours()+":"+mydate.getMinutes()+" hrs"
    console.log(mydate_today)
}

//test_db()
//test_user_reg()
//test_uuid()
//test_api_key()
//test_user()
//dependencias()
//test_dependencia()
//calcularFecha()