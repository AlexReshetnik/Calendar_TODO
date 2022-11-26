async function POST(name, pass) {//зайшов користувач
    Fetch(method = 'POST', { "name": name, "pass": pass })
        .then(response => response.json())
        .then(data => { if (data.listTasks != undefined || data.calendar != undefined) { fillingData(data); textareaInit(); } })
        .catch((error) => { console.log('Error:', error); });
}
async function PUT() {//якісь зміни
    Fetch(method = 'PUT', json)
        .catch((error) => { console.log('Error:', error); });
}
async function DELETE(number, value) {//видалені дані
    console.log(value);
    Fetch(method = 'DELETE', { "name": json.name, "pass": json.pass, "number": number, "value": value })
        .then(response => console.log(response.ok))
        .catch((error) => { console.error('Error:', error); });
}
function Fetch(method, data) {
    if (isCanLogin()) {
        return fetch("/users", {
            method: method,
            headers: { "Accept": "application/json", "Content-Type": "application/json" },
            body: JSON.stringify(data)
        })
    }
    return new Promise(() => { throw new Error("Не увійшли"); })
}
function isCanLogin() {
    if (json.name == undefined || json.pass == undefined || json.name == "" || json.pass == "") {
        console.log(json.name + "незаповнені дані"); return false;
    }
    console.log(json.name + "+" + json.pass + " увійшли");
    return true;
}
function fillingData(rJson) {
    console.log(rJson);
    var f = document.querySelector("#listTasks");
    f.innerHTML = "";
    rJson.listTasks.forEach(element => { f.innerHTML += newTextarea(element) });
    for (let i = 0; i < 30; i++) { f.innerHTML += newTextarea(); }

    var dayBloc = document.querySelectorAll(".dayBloc")
    var i = 0;
    rJson.calendar.forEach((e) => {
        dayBloc[i].innerHTML = `<div class="numeric">${i.toString()}</div>`
        if (e !== null) {
            e.forEach((text) => { dayBloc[i].innerHTML += newTextarea(text) });
        } i++;
    });
}

var json = {};
function saveDataToJson() {
    json.listTasks = [];
    json.calendar = [];
    document.querySelector("#listTasks").querySelectorAll('textarea').forEach((e) => {
        if (e.value != "") { json.listTasks.push(e.value); }
    });
    document.querySelector(".numbers").querySelectorAll('textarea').forEach((e) => {
        if (e.value != "") {
            let dayNumber = e.parentNode.querySelector('.numeric').textContent
            if (!json.calendar[dayNumber]) { json.calendar[dayNumber] = []; }
            json.calendar[dayNumber].push(e.value);
        }
    });
}
//////////////////////bt///////////////////////////////////////////////////////////////////////
document.querySelector("#btLogin").addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelector("#fonForLoginBloc").classList.add("hide");
    json.name = document.formLoginBloc.login.value;
    json.pass = document.formLoginBloc.password.value;
    POST(json.name, json.pass);
});
document.querySelector("#btLoginGuest").addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelector("#fonForLoginBloc").classList.add("hide");
});
document.querySelector("#openFormLogin").addEventListener('click', () => {
    document.querySelector("#fonForLoginBloc").classList.remove("hide");
})
function newTextarea(text) {
    if (text == undefined) {
        return `<textarea draggable="true"></textarea>`;
    }
    return `<textarea draggable="true">${text}</textarea>`;
}
generateNumbers();
function generateNumbers() {
    for (let i = 0; i < 30; i++) {
        document.querySelector("#listTasks").innerHTML += newTextarea();
    }
    for (let i = 0, a = 1; i < 31 + a; i++) {
        if (a < i + 1) {
            document.querySelector(".numbers").innerHTML +=
                `<div class="dayBloc"><div class="numeric">${(i - a + 1).toString()}</div></div>`;
        } else {
            document.querySelector(".numbers").innerHTML +=
                `<div class="dayBloc"style="visibility: hidden;"><div class="numeric">${i.toString()}</div></div>`;
        }
    }
}
//////////////////////drag/////////////////////////////////////////////////////////////////////////
var position;
for (const dayBloc of document.querySelectorAll('.dayBloc')) {
    dayBloc.addEventListener('dragover', (event) => { event.preventDefault(); });
    dayBloc.addEventListener('dragleave', (event) => { event.target.classList.remove('dragenter'); });
    dayBloc.addEventListener('drop', (event) => { event.target.classList.remove('dragenter'); });
    dayBloc.addEventListener('dragenter', (event) => {
        if (!event.target.getAttribute("draggable") && !event.target.classList.contains("numeric")) {
            position = event.target;
            event.target.classList.add('dragenter');
        }
    });
}
/////////////////////////////////////drag///////////////////////////////////////////////
textareaInit();
window.onresize = (e) => {
    console.log("onresize");
    for (const it of document.querySelectorAll('textarea')) { 
        it.style.height = "fit-content;"
       
        console.dir(it);
        it.style.height = (it.scrollHeight) + "px";
       // it.style.height = (it.firstCh1ild.scrollHeight) + "px";
    }
}

function textareaInit() {
    for (const it of document.querySelectorAll('textarea')) {
        it.style.height = "5px";
        it.style.height = (it.scrollHeight) + "px";
        it.oninput = () => {
            it.style.height = (it.scrollHeight) + "px";
            it.value = it.value[0].toUpperCase() + it.value.slice(1, it.value.length)
            console.log(it.value);
        }

        it.addEventListener('dragstart', (event) => { setTimeout(() => event.target.classList.add('hide'), 0); })
        it.addEventListener('dragend', (event) => {
            if (position) { position.append(event.target); }
            event.target.classList.remove('hide');
            saveDataToJson();
            PUT();
        })
        it.addEventListener('keydown', (event) => {
            if (event.code == 'Delete') {
                if (confirm("question")) {
                    DELETE(event.target.parentNode.querySelector('.numeric').textContent, event.target.value);
                    it.remove();
                }
            }
        })
    }
}

