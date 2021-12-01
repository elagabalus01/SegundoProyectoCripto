// const connectLedger=require('./connectLedger') // Biblioteca fachada para conexión con red fabric
const utils=require('./infraestructure') // Biblioteca fachada para conexión con base de datos
function testFabric(){
    facade=new connectLedger.LedgerFacade()
    var result;
    // result=facade.getAllTransactions()
    // result.then((datos)=>{
        //     console.log(`Datos: ${datos}`)
        // })
        // result=facade.getTransactionById('movimiento0')
        // result.then((datos)=>{
            //     console.log(`Datos: ${datos}`)
            // })
            // result=facade.createTransaction("Movimiento10","11-sep-1999",'10000','Ángel','Prueba')
            // result.then((datos)=>{
                //     console.log(`Datos: ${datos}`)
                // })
                result=facade.getAllTransactions()
                result.then((datos)=>{
                    console.log(`Datos: ${datos}`)
                })
}
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

    // query_promise=database.runQuery(`insert into users values('elagabalus','angel','s','',1,'XXXX');`)
    // query_promise.then((result)=>{
    //     result.forEach((item) => {
    //         console.log(item)
    //     });
    // },(error)=>{
    //     console.log(`Hubo un error ${error}`)
    // })
    // query_promise.then((result)=>{
    //     console.log(result)
    // })
    //database.runQuery(`insert into users values('elagabalus','angel','s','',1,'XXXX');`)
    // console.log("Se ejecutó la consulta")
    return;
}
function test_user_reg(){
    user_data={
        userid:"usuario",
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

// test_db()
test_user_reg()
