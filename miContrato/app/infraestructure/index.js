const DatabaseFacade = require('./lib/DatabaseFacade'); // Carga clase para conexión a la base de datos
const RegisterUser = require('./lib/RegisterUser'); // Carga clase para registrar un usuario
const calcularFecha = require('./lib/Fecha'); // Función para calcular la fecha actual

module.exports.DatabaseFacade = DatabaseFacade; // Hace pública la clase COnsulta para este módulo
module.exports.RegisterUser = RegisterUser; // Hace pública la clase COnsulta para este módulo
module.exports.calcularFecha = calcularFecha;