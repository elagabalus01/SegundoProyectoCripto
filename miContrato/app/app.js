const express=require('express') // Biblioteca para definir rutas y enviar respuestas
const pug=require('pug') // Biblioteca de renderizado de plantillas
const bodyParser = require("body-parser");
const connectLedger=require('./connectLedger') // Biblioteca fachada para conexión con red fabric
var app = express()
var connection=new connectLedger.LedgerFacade('appUser2')
var sessions={}
var cadena;
const USER_ADMIN=new connectLedger.UserManagement()

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('static')) // Se define la carpeta de archivos estáticos del servidor

app.use('/app',(req,res,next)=>{
    cadena="Esto viene del middleware"
    if(false){
        next()
    }else{
        res.redirect('/')
    }
});

app.get('/app',(req,res)=>{
    res.send(cadena);
});

app.get('/', function(req, res) {
    res.send('Hola Mundo!');
});

app.get('/render', function(req, res) {
    render=renderHello()
    res.send(render({name:"Ángel"}));
});

app.get('/fabric', function(req, res) {
    response={}
    promise_data=connection.getAllTransactions()
    promise_data.then((data)=>{
            data=data.toString()
            data=JSON.parse(data)
            response['data']=data
            res.send(response)
    },(error)=>{
        response['data']="Hubo un error"
        res.send(response);
    })
});

app.post('/fabric', function(req, res) {
    response={}
    promise_data=connection.createTransaction(req.body.id,req.body.fecha,req.body.monto
        ,req.body.autor,req.body.referencia,req.body.dependencia)
    promise_data.then((data)=>{
            response['data']='Hecho'
            res.send(response)
    },(error)=>{
        response['data']="Hubo un error"
        res.send(response);
    })
});

app.post('/register_user',function(req,res){
    response={}
    if(!req.body.username){
        response['data']="No se envió el nombre de usuario"
        res.send(response);
        return;
    }
    result=USER_ADMIN.registerUser(req.body.username)
    result.then((data)=>{
        if(data){
            response['data']="Hecho"
            res.send(response);
        }else{
            throw new Error();
        }
    },(error)=>{
        response['data']="Hubo un error"
        res.send(response);
    }).catch(()=>{
        response['data']="Hubo un error"
        res.send(response);
    })
})

app.listen(3000,function(){
    console.log("Runnig")
});

function renderHello() {
    var rendered = pug.compileFile('templates/entrada.pug');
    console.log(rendered)
    return rendered;
}
