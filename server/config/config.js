// Puerto
process.env.PORT = process.env.PORT || 3000;

// Entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// Base de datos
let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    //urlDB = 'mongodb+srv://mongo:Mongo2020@cafe.gxgpg.mongodb.net/cliente?retryWrites=true&w=majority';
    urlDB = process.env.MONGO_URI;
}

process.env.urlDB = urlDB;

//login 
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;
process.env.SEED = process.env.SEED || 'secret-desarrollo';

// Google client ID
process.env.CLIENT_ID = process.env.CLIENT_ID || '218164848881-1unkf6g718van4lieiirhvtm5jmpocb7.apps.googleusercontent.com';