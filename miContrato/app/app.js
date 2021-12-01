const express=require('express') // Biblioteca para definir rutas y enviar respuestas
const pug=require('pug') // Biblioteca de renderizado de plantillas
const bodyParser = require("body-parser");
const connectLedger=require('./connectLedger') // Biblioteca fachada para conexión con red fabric
const utils = require('./infraestructure')
var app = express()
var connection=new connectLedger.LedgerFacade('elagabalus')
var session={}
var cadena;
const USER_ADMIN_FABRIC=new connectLedger.UserManagement()

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
    error=false
    var result;
    if(!req.body.userid & req.body.nombre & req.body.paterno &
        req.body.dependenciaid){
        response['data']="Faltan datos en el formulario"
        res.send(response);
        return;
    }
    user_data={
        userid:req.body.userid,
        nombre:req.body.nombre,
        paterno:req.body.paterno,
        materno:req.body.materno?req.body.materno:'',
        dependenciaid:req.body.dependenciaid
    }
    // Registra usuario en la base de datos
    try {
        result=utils.RegisterUser.register_user(user_data)
    } catch (e) {
        error=true
        response['data']="Hubo un error"
        console.log("Se chacha error de mysql")
    }
    result.then((data)=>{
        if(data){
            response['data']="Hecho"
        }else{
            throw new Error();
        }
    },(error)=>{
        response['data']="Hubo un error"
    }).catch(()=>{
        response['data']="Hubo un error"
    })

    if(!error){
        // Registra al usuario en fabric
        result=USER_ADMIN_FABRIC.registerUser(req.body.userid)
        result.then((data)=>{
            if(data){
                response['data']="Hecho"
                res.send(response);
            }else{
                throw new Error();
            }
        },(error)=>{
            response['data']="Hubo un error"
        }).catch(()=>{
            response['data']="Hubo un error"
        })
    }
    res.send(response);
})

app.listen(3000,function(){
    console.log("Runnig")
});

function renderHello() {
    var rendered = pug.compileFile('templates/entrada.pug');
    console.log(rendered)
    return rendered;
}
