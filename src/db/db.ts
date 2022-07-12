import sqlite3 from 'sqlite3'
const bcrypt = require('bcrypt')

const DBSOURCE = 'db.sqlite'

const SQL_TABLES_CREATE = `
    CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        password TEXT NOT NULL,
        salt TEXT,    
        token TEXT,
        dateLoggedIn DATE,
        createdAt DATE,
        updatedAt DATE

    );
    CREATE TABLE posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        image TEXT,
        user_id INTEGER NOT NULL,
        createdAt DATE,
        updatedAt DATE,
        FOREIGN KEY("user_id") REFERENCES "users"
    );
    CREATE TABLE comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        description TEXT,
        post_id INTEGER,
        user_id INTEGER,
        createdAt DATE,
        updatedAt DATE,
        FOREIGN KEY("user_id") REFERENCES "users",
        FOREIGN KEY("post_id") REFERENCES "posts"
    );
`

var salt = bcrypt.genSaltSync(10);

const database = new sqlite3.Database(DBSOURCE,async (err) => {
    if (err) {
        //NÃO FOI POSSIVEL ABRIR O DATABASE
        console.log(err)
        throw err
    } else {
        console.log('Base de dados conectada com sucesso.')
        database.exec(SQL_TABLES_CREATE, (err) => {
            if (err) {
                //Possivelmente as tabelas já existem
                console.log(err);
            } else {
                console.log('Tabelas criadas com sucesso.')
                var insert = 'INSERT INTO Users (name, email, password, salt, createdAt, updatedAt) VALUES (?,?,?,?,?,?)'
                database.run(insert, ["David", "david12gyn@gmail.com", bcrypt.hashSync("admin", salt), salt, Date.now(),Date.now()])
            }
        })
    }
})
export default database
