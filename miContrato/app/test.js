const connectLedger=require('./connectLedger') // Biblioteca fachada para conexión con red fabric
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
    database.runQuery(`insert into user values('${username}')`)
    return;
}
function test_user_reg(){
    user_data={
        nombre:"Ángel",
        paterno:"Santander",
        materno:"Martínez"
    }
    utils.RegisterUser.register_user(user_data)
}

// test_db()
test_user_reg()
