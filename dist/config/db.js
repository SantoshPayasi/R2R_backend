"use strict";
const mongoose = require('mongoose');
// Connecting Database
const DB_URI = process.env.URI;
// console.log(DB_URI)
mongoose.set('strictQuery', true);
console.log('current DB status;', mongoose.connection.readyState); //logs 0
mongoose.connection.on('connecting', () => {
    console.log('db connecting, Status:', mongoose.connection.readyState); //logs 2
});
mongoose.connection.on('connected', () => {
    console.log('db connected, Status:', mongoose.connection.readyState); //logs 1
});
mongoose.connection.on('disconnecting', () => {
    console.log('db disconnecting, Status:', mongoose.connection.readyState); // logs 3
});
mongoose.connection.on('disconnected', () => {
    console.log('db disconnected, Status:', mongoose.connection.readyState); //logs 0
});
try {
    mongoose.connect(DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => {
        console.log("Db is connected");
    });
}
catch (error) {
    console.log(error);
}
