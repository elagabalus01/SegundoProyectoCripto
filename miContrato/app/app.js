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

const USER_ADMIN_FABRIC=new connectLedger.UserManagement()

app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('static')) // Se define la carpeta de archivos estáticos del servidor

// Middleware para ercuperar conexión a fabric a partir de la sesión
function fabricConnectionMiddleware(req,res,next){
    console.log(`Fabric middleware user ${req.userid}`)
    if(req.userid){
        req.fabric_obj=new connectLedger.LedgerFacade(req.userid)
        req.fabric_obj.getCredentials()
        next()
    }else{
        res.redirect('/')
    }
}

// Middleware para proteger rutas con credenciales
function notLoggedInMiddleware(req,res,next){
    console.log(`user ${req.userid}`)
    if(req.userid){
        var promise_user=models.User.retrive_user_data(req.userid,database_connection)
        promise_user.then((result)=>{
            req.user_obj=result
            next()
        },(error)=>{
            console.log("Auth middleware: No se pudo recuperar al usuario")
            res.redirect('/')
        })
    }else{
        res.redirect('/')
    }
}
// Middleware para proteger rutas para usuarios sin credenciales
function alreadyLoggedInMiddleware(req,res,next){
    if(req.userid){
        res.redirect('/app')
    }else{
        next()
    }
}

// Middleware para proteger rutas para usuarios sin credenciales
function authMiddleware(req,res,next){
    var sesssionid=req.cookies['gobchaincookie']
    if(sessions[sesssionid]){
        req.userid=sessions[sesssionid]
    }else{
        req.userid=false
    }
    next()
}

// MIddleware para comprobar si el usuario está logeado
app.use('/',authMiddleware);
app.use('/app',notLoggedInMiddleware);
app.use('/app/fabric',fabricConnectionMiddleware);
app.use('/login',alreadyLoggedInMiddleware);

app.get('/app',(req,res)=>{
    var rendered = pug.compileFile('templates/app.pug');
    res.send(rendered())
});

app.get('/app/registro_movimientos',(req,res)=>{
    var rendered = pug.compileFile('templates/movimientos.pug');
    res.send(rendered())
});

app.get('/', function(req, res) {
    if(req.user){
        res.redirect('/app')
    }else{
        var rendered = pug.compileFile('templates/entrada.pug');
        res.send(rendered())
    }
});
// cambiar método a post para consumir de manera asíncrona
app.get('/gobchain', function(req, res) {
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

app.post('/app/fabric/agregar_transaccion', function(req, res) {
    var user=req.user_obj
    var fabric_con=req.fabric_obj
    response={}
    user.getDependencia.then((result)=>{
        promise_data=fabric_con.createTransaction(user.userid,req.body.fecha,req.body.monto
            ,user.nombreCompleto,req.body.referencia,result)
            promise_data.then((data)=>{
                response['data']='Hecho'
                res.send(response)
            },(error)=>{
                response['data']="Hubo un error"
                res.send(response);
            })

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
        // Si falla la creación de un usuario en fabric
        // se debe eliminar el usuario de la base de datos
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
    var userid=req.body.userid;
    var user_promise=models.User.auth(req.body.userid,req.body.password,database_connection)
    user_promise.then((result)=>{
        // genear_sessionid(userid)
        sessions[userid]=userid
        console.log(sessions)
        res.cookie('gobchaincookie', userid)
        res.redirect('/app');
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
    // res.send(`Sesión cerrada correctamente`);
    res.redirect('/')
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
