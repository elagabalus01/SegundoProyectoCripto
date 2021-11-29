const connectLedger=require('./connectLedger') // Biblioteca fachada para conexión con red fabric
facade=new connectLedger.LedgerFacade()
var result;
// result=facade.getData()
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
result=facade.getData()
result.then((datos)=>{
    console.log(`Datos: ${datos}`)
})
