// initialization variable and function
const inputBox =  $("#input-box");
const listContainer =  $("#list-container");
let globalStorage = JSON.parse(localStorage.getItem("data"))
let id = globalStorage ? globalStorage.id : 0

$(document).ready(function() {
    $("#currentDate").text(new Date().toDateString())
    refreshData()
})

function makeDone(id){
    const newData = []
    globalStorage = JSON.parse(localStorage.getItem("data"))
    globalStorage.data.forEach(function(data){
        if (data.id == id) {
            data.isDone = true
        }
        newData.push(data)
    })
    globalStorage.data = newData
    localStorage.setItem("data", JSON.stringify(globalStorage))
    return globalStorage
}

function makeUndone(id){
    const newData = []
    globalStorage = JSON.parse(localStorage.getItem("data"))
    globalStorage.data.forEach(function(data){
        if (data.id == id) {
            data.isDone = false
        }
        newData.push(data)
    })
    globalStorage.data = newData
    localStorage.setItem("data", JSON.stringify(globalStorage))
    return globalStorage
}

// function collections
function markAsDone(id, elId, buttonId) {
    console.log({
        id: id,
        el: elId,
        b: buttonId
    })
    $(`#${elId}`).addClass("checked")
    $(`#${buttonId}`).attr("src", "image/checked.png")
    $(`#${buttonId}`).attr("onclick", `markAsUndone(${id}, '${elId}', '${buttonId}')`)
    makeDone(id)
}

function markAsUndone(id, elId, buttonId) {
    console.log({
        id: id,
        el: elId,
        b: buttonId
    })
    $(`#${elId}`).removeClass("checked")
    $(`#${buttonId}`).attr("src", "image/check.png")
    $(`#${buttonId}`).attr("onclick", `markAsDone(${id}, '${elId}', '${buttonId}')`)
    makeUndone(id)
}


function addTask(){
    const priorityValue = $("#priority option:checked").text()
    const priorityColor = $("#priority").val()
    let datePicker = $("#datePicker").val() ? new Date($("#datePicker").val()) : new Date().toDateString()
    datePicker = moment(datePicker).format('DD-MMM-YYYY');

    if(inputBox.val() === ''){
        alert("You must write someething!");
    }
    else{
        listContainer.append(`
            <li id="to${id}" class="flex items-center justify-between">
                <div class="flex items-center justify-center">
                    <img onclick="markAsDone(${id}, 'content${id}', this.id)" id="checkBox${id}" class="checkbox mr-1" src="image/check.png">
                    <div id="content${id}">
                        ${inputBox.val()}
                        <p style="color:${priorityColor};font-size:12px">${priorityValue}</p>
                    </div>
                </div>
                <div>
                    <p style="font-size:10px">${datePicker}</p>
                </div>
                <button class="no-styling" onclick="removeToDo('${id}')">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                    </svg>
                </button>
            </li>  
        `)
    }
    saveData(priorityValue, datePicker, inputBox.val(), priorityColor, false, id);
    id++
}

function saveData(priority, date, value, color, isDone, id){
    globalStorage = JSON.parse(localStorage.getItem("data"))
    if (id) {
        globalStorage.data.push({
                id: id,
                priority: {
                    value: priority,
                    color: color
                },
                date: date,
                value: value,
                isDone: isDone
            }
        )
        globalStorage.id++
        localStorage.setItem("data", JSON.stringify(globalStorage))
    } else {
        localStorage.setItem("data", JSON.stringify({id: id, data: [
                    {   
                        id: id,
                        priority: {
                            value: priority,
                            color: color
                        },
                        date: date,
                        value: value,
                        isDone: isDone
                    }
                ]}));
    }
    
}

function removeToDo(id) {
    globalStorage = JSON.parse(localStorage.getItem("data"))
    globalStorage.data = globalStorage.data.filter(obj => obj.id != id);
    localStorage.setItem("data", JSON.stringify(globalStorage))
    $(`#to${id}`).remove()
}

function deletAll() {
    $(`#list-container`).empty()
    localStorage.removeItem("data")
}

function refreshData(strg) {
    listContainer.empty()
    let storage = JSON.parse(localStorage.getItem("data"))

    if (strg) {
        storage = strg
    }

    const result = []
    storage.data.filter(function (data) {
        if (!data.isDone){
            result.push(data)
        }
    })

    result.forEach(element => {
        listContainer.append(`
            <li id="to${element.id}" class="flex items-center justify-between">
                <div class="flex items-center justify-center">
                    <img onclick="markAsDone(${element.id}, 'content${element.id}', this.id)" id="checkBox${element.id}" class="checkbox mr-1" src="image/check.png">
                    <div id="content${element.id}">
                        ${element.value}
                        <p style="color:${element.priority.color};font-size:12px">${element.priority.value}</p>
                    </div>
                </div>
                <div>
                    <p style="font-size:10px">${element.date}</p>
                </div>
                <div>
                    <p style="font-size:10px;color:red">${Date.parse(element.date) < new Date() ? "LATE" : ""}</p>
                </div>
                <button class="no-styling" onclick="removeToDo('${element.id}')">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                    </svg>
                </button>
            </li>     
        `)
    });
    $(`#showUndone`).addClass("hidden")
    $(`#showDone`).removeClass("hidden")
}

function showDoneData(el) {
    listContainer.empty()
    let storage = JSON.parse(localStorage.getItem("data"))
    const result = []
    storage.data.filter(function (data) {
        if (data.isDone){
            result.push(data)
        }
    })

    result.forEach(element => {
        listContainer.append(`
            <li id="to${element.id}" class="flex items-center justify-between">
                <div class="flex items-center justify-center">
                    <img onclick="markAsUndone(${element.id}, 'content${element.id}', this.id)" id="checkBox${element.id}" class="checkbox mr-1" src="image/checked.png">
                    <div id="content${element.id}" class="checked">
                        ${element.value}
                        <p style="color:${element.priority.color};font-size:12px">${element.priority.value}</p>
                    </div>
                </div>
                <div>
                    <p style="font-size:10px">${element.date}</p>
                </div
                <button class="no-styling" onclick="removeToDo('${element.id}')">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                    </svg>
                </button>
            </li>    
        `)
    });

    $(`#showDone`).addClass("hidden")
    $(`#showUndone`).removeClass("hidden")
}

function filterByDate(value) {
    console.log(value)
}
