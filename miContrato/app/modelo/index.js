// Carga clase user para la adminitración de la sesión
// y recupera los datos del usuario desde la base de datos
const User = require('./lib/User');

module.exports.User = User; // Hace pública la clase User
