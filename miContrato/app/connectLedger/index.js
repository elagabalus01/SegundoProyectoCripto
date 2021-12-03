const LedgerFacade = require('./lib/LedgerFacade'); // Carga clase Consulta
const UserManagement = require('./lib/UserManagement'); // Carga clase Consulta
const enrollAdmin=require('./lib/enrollAdmin'); // Carga función para registrar administrador
// require('./lib/registerUser'); // Provicional

module.exports.LedgerFacade = LedgerFacade; // Hace pública la clase Consulta para este módulo
module.exports.UserManagement = UserManagement; // Hace pública la clase COnsulta para este módulo
module.exports.enrollAdmin = enrollAdmin // Hace pública la función para regisrar al adiministrador
