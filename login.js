/***************************************
* MOndragón Delgado Mezly Zahory       *
* 4 - C                                *
* Actividad 3                          *
***************************************/

//Se incluyen los paquetes, se crean las variables y se solicitan los modulos instalados:
var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');

//Conexión a la base de datos
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'nodelogin'
});

//Inicializr express para el manejo de aplicaciones web:
var app = express();

//Usaremos estos paquetes de express
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use(bodyParser.urlencoded({
    extended: true 
}));
app.use(bodyParser.json());

//Mostramos el html al cliente
app.get('/', function(request, response) {
    response.sendFile(path.join(__dirname + '/login.html')); 
    //E cliente se conecta, se mustra la página de inicio de sesión, y se envia el archivo login.html.
});

app.post('/auth', function(request, response) {
    var username = request.body.username; //Obtenemos el nombre de usuario.
    var password = request.body.password; //Obtenemos la contraseña. 

    if (username && password) { //Validamos
        //Hacemos la consulta para verificar el usuario y contraseña.
        connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
        if (results.length > 0) { // Que si hay resultados (usuarios) en existencia
                request.session.loggedin = true; // Se asigna a loggedin como TRUE
                request.session.username = username; // Se asina el nombre de usuario a una variable de sesión.
                response.redirect('/home'); //Se redirecciona a /home
            }else {
            response.send('Usuarios y/o contraseña incorrectos!'); //Si no hay usuarios, se manda mensaje.
        }
        response.end(); // Terminamos el proceso
    });
    } else {
        response.send('Ingresa usuario y contraseña!'); // Si se encuentran vacios los campos se manda mensaje.
        response.end(); // Fin del proceso.
    }
});

app.get('/home', function(request, response) {
    if (request.session.loggedin) { // Se verifica la variable de sesión loggedin sea TRUE
        response.send('Bienvenido de nuevo, ' + request.session.username + '! <br><br> <a href="/logout" class="btn btn-success">Cerrar sesión</a>'); // Si es TRUE mostramos mensaje con el nombre de usuario de la sesión.
    } else {
        response.send('Iniciar sesión de nuevo, por favor!'); // Si loggedin es FALSO solicitamos que inicie sesión de nuevo.
    }
    response.end(); // Terminamos proceso.
});

//Cerrar sesión 
app.get('/logout', function (request, response) {
  request.session.destroy();
  response.send('Sesión terminada correctamente <br><br> <a href="/" class="btn btn-success">Inicar sesión de nuevo.</a>');
});

//La aplicación web necesita escuchar en un puerto, para propósitos de prueba se utilizará el puerto 3000:
app.listen(3000, function(){
    console.log('Puesto en marcha el server en puerto 3000');
});