const express = require("express");
const path = require('path');
const fs = require("fs");
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'front')));
var db;
app.get("/", function (request, response) {
    db = JSON.parse(fs.readFileSync(pathJoin("db", `data.json`, "utf8")))
    console.log("баазу даних зчитано");
    response.sendFile(__dirname + "/front/index10.html");
});
app.post("/users", function (request, response) {
    var id = isInDatabase( request.body);
    if (id === undefined) {
        id = createNewUser( request.body);
        console.log("новий користувач створений");
    }
    response.status(200);
    response.setHeader('Content-Type', /json/);
    response.send(fs.readFileSync(__dirname + `/db/${id}.json`, 'utf8'));
})
app.put("/users", function (request, response) {
    console.log("request.body");
    console.log(request.body);
    var id = isInDatabase(request.body);
    if (id != undefined) {
        fs.writeFileSync(__dirname + `/db/${id}.json`, JSON.stringify(request.body));
        console.log("Дані Оновлені метод put");
    }
    response.status(200);
    response.setHeader('Content-Type', /json/);
    response.send();
})
app.delete("/users", function (request, response) {
    var id = isInDatabase( request.body);
    if (id != undefined) {
        data = JSON.parse(fs.readFileSync(__dirname + `/db/${id}.json`, `utf8`));
        for (let i = 0; i < data.calendar[request.body.number].length; i++) {
            if (data.calendar[request.body.number][i] == request.body.value) {
                data.calendar[request.body.number].splice(i, i+1);
                console.log("видалено");
                break;
            }
        }
        fs.writeFileSync(__dirname + `/db/${id}.json`, JSON.stringify(data));
    }
    response.status(200);
    response.setHeader('Content-Type', /json/);
    response.send();
})
function pathJoin(a, b) {
    if (b === undefined) { return path.join(__dirname, a) }
    else {return path.join(__dirname, a,b)}  
}
function createNewUser(user) {
    fs.open(pathJoin("db", `${db.users.length}.json`), 'w', callBack);
    fs.writeFileSync(pathJoin("db", `${db.users.length}.json`), JSON.stringify(user), callBack);
    db.users.push({ "id": db.users.length.toString(), "name": user.name, "pass": user.pass });
    fs.writeFileSync(pathJoin("db", `data.json`), JSON.stringify(db), callBack);
    return db.users.length - 1;
}
function callBack(err, date) {
    if (err != null) {console.log("err : " + err);}
    if (date != null) { console.log("date : " + date); }
}
function isInDatabase(user) {
    BD();
    for (let i = 0; i < db.users.length; i++) {
        if (db.users[i].name == user.name) {
            console.log(user.name + " - користувач зареєстрований в базі даних");
            if (db.users[i].pass == user.pass) {
                console.log(user.pass + " пароль вірний");

            } else {
                console.log(db.users[i].name + " != " + user.pass + " - пароль невірний");
            }
            return db.users[i].id;
        }
    }
}
function BD() {
    if (db == undefined) { db = JSON.parse(fs.readFileSync(pathJoin("db", `data.json`, "utf8"))) }
    return db;
}

/*"dev": "nodemon server.js",*/


app.listen(5050, "localhost", () => { console.log("Сервер запущений"); });
module.exports.app = app;