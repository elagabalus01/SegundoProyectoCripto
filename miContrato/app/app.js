express=require('express')
pug=require('pug')
var app = express()

app.use(express.static('static'))

app.get('/', function(req, res) {
    res.send('Hola Mundo!');
});

app.get('/render', function(req, res) {
    render=renderHello()
    res.send(render({name:"Ángel"}));
});

app.listen(3000,function(){
    console.log("Runnig")
});
console.log("Hola mundo");

function renderHello() {
    var rendered = pug.compileFile('templates/entrada.pug');
    console.log(rendered)
    return rendered;
}
