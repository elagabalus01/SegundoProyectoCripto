const express=require('express') // Biblioteca para definir rutas y enviar respuestas
const pug=require('pug') // Biblioteca de renderizado de plantillas
const bodyParser = require("body-parser");
const connectLedger=require('./connectLedger') // Biblioteca fachada para conexión con red fabric
var app = express()
var connection=new connectLedger.LedgerFacade()

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('static')) // Se define la carpeta de archivos estáticos del servidor

app.get('/', function(req, res) {
    res.send('Hola Mundo!');
});

app.get('/render', function(req, res) {
    render=renderHello()
    res.send(render({name:"Ángel"}));
});

app.get('/fabric', function(req, res) {
    response={}
    promise_data=connection.getData()
    promise_data.then((data)=>{
            data=data.toString()
            data=JSON.parse(data)
            console.log("Se resolvió");
            console.log(`Type data ${typeof(data)}`)
            response['data']=data
            res.send(response)
    },(error)=>{
        response['data']="There was an error ;C"
        res.send(response);
    })
});

app.post('/fabric', function(req, res) {
    response={}

    promise_data=connection.createTransaction(req.body.id,req.body.fecha,req.body.monto
        ,req.body.autor,req.body.referencia)
    promise_data.then((data)=>{
            response['data']='Done'
            res.send(response)
    },(error)=>{
        response['data']="There was an error ;C"
        res.send(response);
    })
});

app.listen(3000,function(){
    console.log("Runnig")
});

function renderHello() {
    var rendered = pug.compileFile('templates/entrada.pug');
    console.log(rendered)
    return rendered;
}
