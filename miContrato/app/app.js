const express=require('express') // Biblioteca para definir rutas y enviar respuestas
const pug=require('pug') // Biblioteca de renderizado de plantillas
const bodyParser = require("body-parser");
const connectLedger=require('./connectLedger') // Biblioteca fachada para conexión con red fabric
const utils = require('./infraestructure')
const models = require('./modelo')
const cookieParser = require('cookie-parser');
const enrollAdmin = connectLedger.enrollAdmin
enrollAdmin() // Se ejecuta el registro del adminitrador del nodo
var app = express()
var connection=new connectLedger.LedgerFacade('elagabalus')
var database_connection=new utils.DatabaseFacade()
var sessions={}
var cadena;
const USER_ADMIN_FABRIC=new connectLedger.UserManagement()

app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('static')) // Se define la carpeta de archivos estáticos del servidor

// Middleware para comprobar si el usario tiene permiso de consulta la página
app.use('/app',(req,res,next)=>{
    var sesssionid=req.cookies['gobchaincookie']
    cadena="Esto viene del middleware"
    if(sessions[sesssionid]){
        next()
    }else{
        res.redirect('/')
    }
});

// MIddleware para comprobar si el usuario está logeado
app.use('/login',(req,res,next)=>{
    var sesssionid=req.cookies['gobchaincookie']
    if(sessions[sesssionid]){
        res.redirect('/app')
    }else{
        next()
    }
});

app.get('/app',(req,res)=>{
    res.send(cadena);
});

app.get('/app/registro_movimientos',(req,res)=>{
    var rendered = pug.compileFile('templates/movimientos.pug');
    res.send(rendered())
});

app.get('/', function(req, res) {
    res.send("Hola Mundo! <a href='/login'>Login</a>");
});

app.get('/render', function(req, res) {
    render=renderHello()
    res.send(render({name:"Ian"}));
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
    var result;
    // console.log((req.body.userid & req.body.password & req.body.nombre & req.body.paterno &
    //     req.body.dependenciaid))
    // if(!(req.body.userid & req.body.password & req.body.nombre & req.body.paterno &
    //     req.body.dependenciaid)){
    //     response['data']="Faltan datos en el formulario"
    //     res.send(response);
    //     return;
    // }
    user_data={
        userid:req.body.userid,
        password:req.body.password,
        nombre:req.body.nombre,
        paterno:req.body.paterno,
        materno:req.body.materno?req.body.materno:'',
        dependenciaid:req.body.dependenciaid
    }
    // Registra usuario en la base de datos
    result=utils.RegisterUser.register_user(user_data)
    result.then((data)=>{
        console.log("Usuario registrado en la base de datos")
        // Registra al usuario en fabric
        return USER_ADMIN_FABRIC.registerUser(req.body.userid)
    },(error)=>{
        response['data']=`Error ${error}`
        console.log(response['data'])
        return new Promise((resolve,reject)=>{
            reject(error)
        })
    }).then((result)=>{
        if(result){
            response['data']="Hecho"
            res.send(response);
        }else{
            throw new Error();
        }
    },(error)=>{
        response['data']=`Error ${error}`
        res.send(response);
    }).catch((exception)=>{
        response['data']=`Exception ${exception}`
        res.send(response);
    })
})

app.get('/login',(req,res)=>{
    var rendered = pug.compileFile('templates/login.pug');
    res.send(rendered())
})
app.post('/login',(req,res)=>{
    // Registra la sesión de un usuario si se autentica de manera exitosa
    var user_promise=models.User.auth(req.body.userid,req.body.password,database_connection)
    user_promise.then((user)=>{
        sessions[user.userid]={
            user_obj:user,
            ledger_obj:new connectLedger.LedgerFacade(user.userid)
        }
        console.log(sessions)
        console.log(`Usuario autentiacado ${user.userid}`)
        res.cookie('gobchaincookie', user.userid)
        res.redirect(`/app/registro_movimientos`);
    },(error)=>{
        console.log(`error al autenticar al usuario ${error}`)
        res.send(`error al autenticar al usuario ${error}`);
    })
})

app.post('/logout',(req,res)=>{
    // Elimina la sesión de un usario del arreglo de sesiones
    delete sessions[req.body.userid]
    res.clearCookie("gobchaincookie");
    console.log(sessions)
    res.send(`Sesión cerrada correctamente`);
})

app.post('/dependencias',(req,res)=>{
    var query_promise=database_connection.runQuery(`SELECT * FROM catalogo_dependencia;`)
    var data=[]
    query_promise.then((result)=>{
        result.forEach((item) => {
            data.push({dependenciaid:item.dependenciaid,dependencia:item.dependencia})
        });
        console.log(data)
        res.send({data:data})
        // console.log(JSON.parse({data:result}))
    },(error)=>{
        console.log(`Hubo un error ${error}`)
        res.send({data:error})
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
