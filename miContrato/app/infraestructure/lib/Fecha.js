// Función para calcular la fecha actual
function calcularFecha(){
    var mydate = new Date(Date.now())
    var month = ["enero", "febrero", "marzo", "abril", "mayor", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"][mydate.getMonth()];
    mydate_today=mydate.getDate()+" de "+month+" del "+mydate.getFullYear()
    +" a las "+mydate.getHours()+":"+mydate.getMinutes()+" hrs"
    return mydate_today
}

module.exports = calcularFecha;
