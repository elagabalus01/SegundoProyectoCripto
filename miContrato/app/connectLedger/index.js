const LedgerFacade = require('./lib/LedgerFacade'); // Carga clase Consulta
const UserManagement = require('./lib/UserManagement'); // Carga clase Consulta
require('./lib/enrollAdmin'); // Provicional
// require('./lib/registerUser'); // Provicional

module.exports.LedgerFacade = LedgerFacade; // Hace pública la clase COnsulta para este módulo
module.exports.UserManagement = UserManagement; // Hace pública la clase COnsulta para este módulo
