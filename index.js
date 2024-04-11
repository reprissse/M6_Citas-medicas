// Importamos las librerías necesarias
import express from 'express';
import axios from 'axios';
import _ from 'lodash';
import chalk from 'chalk';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

// Se crea una nueva instancia de Express
const app = express();

// Se define el puerto en el que se ejecutará nuestro servidor
const PORT = 3005;

// URL de la API de la que obtendremos los datos de los usuarios
const apiurl = 'https://randomuser.me/api/';

// Array para almacenar los datos de los usuarios
const usuarios = [];

// Formato para la fecha y hora
const formato = "MMMM Do YYYY: hh:mm:ss a";

// Iniciamos el servidor
app.listen(PORT, () => {
    console.log(chalk.green(`El servidor está escuchando en el puerto http://localhost:${PORT}`));
});

// Ruta para obtener los datos de los usuarios
app.get('/usuarios', async(req, res) => {
    try {
        // Se hace una petición a la API para obtener los datos de un usuario
        const userapi = await axios.get(apiurl);

        // Se extrae los datos que nos interesan de la respuesta de la API
        const data = userapi.data.results[0];
        const nombre = data.name.first;
        const apellido = data.name.last;
        const genero = data.gender;

        // Se genera un ID único para el usuario
        const id = uuidv4().slice(0,6);

        // Se obtiene la fecha y hora actual
        const tiempo = moment().format(formato);

        // Se añade el usuario al array de usuarios
        usuarios.push({nombre, apellido, genero, id, tiempo});

        // Se usa lodash para dividir el array de usuarios en dos grupos: usuarios femeninos y masculinos
        const [usuariosFemeninos, usuariosMasculinos] = _.partition(usuarios, (user)=>{
            return user.genero == 'female';
        });

        // Se crea una lista de usuarios femeninos y masculinos
        const listaFemeninos = usuariosFemeninos.map((user)=>{
            return `<li>Nombre:${user.nombre} - Apellido:${user.apellido} - Id: ${user.id} - Hora ${user.tiempo}</li>`
        }).join("");
        const listaMasculinos = usuariosMasculinos.map((user)=>{
            return `<li>Nombre:${user.nombre} - Apellido:${user.apellido} - Id: ${user.id} - Hora ${user.tiempo}</li>`
        }).join("");

        // Se crea el template con las listas de usuarios
        const template = `
        <h4>Mujeres</h4>
        <ol>
        ${listaFemeninos}
        </ol>
        <h4>Hombres</h4>
        <ol>
        ${listaMasculinos}
        </ol>`;

        // Se imprime en la consola los datos del usuario
        console.log(
            chalk.blue.bgWhite(
                `Nombre:${nombre} - Apellido ${apellido} - Id: ${id} - Hora: ${tiempo} \n Nombre: ${nombre} - Apellido: ${apellido} - Id:${id} - Hora: ${tiempo}`
            )
        );

        // Enviamos el template como respuesta
        res.send(template);
    } catch (error) {
        // Si ocurre un error, lo mostramos en la consola y enviamos un mensaje de error como respuesta
        console.error(chalk.red(error));
        res.send('Hubo un error al obtener los datos');
    }
});

