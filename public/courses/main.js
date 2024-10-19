
// Color Mapping
const brightCartoonColors = [
    "#FF5733", // Red Orange
    "#FFB300", // Vivid Yellow
    "#75FF33", // Bright Green
    "#33FF57", // Light Green
    "#33B5FF", // Sky Blue
    "#335BFF", // Bright Blue
    "#A333FF", // Bright Purple
    "#FF33B5", // Vivid Pink
    "#FFDA33", // Bright Gold
    "#FF5E33"  // Coral
];
if (!localStorage.getItem("classes") || localStorage.getItem("classes").trim().length == 0) {
    localStorage.setItem("classes", JSON.stringify([]))
}
var data = JSON.parse(localStorage.getItem("classes"))
function save() {
    setTimeout(function () {
        localStorage.setItem("classes", JSON.stringify(data))
        save()
    }, 2000)
}
save()

const ADD = document.getElementById("add-button")
const IMPORT = document.getElementById("import")
const EXPORT = document.getElementById("export")
const CANVAS = document.getElementById("canvas")
const CANVAS_EDIT = document.getElementById("canvas-edit")
var classes = document.getElementsByClassName("card")

ADD.onclick = function() {
    var obj = {
        "name": "New Class",
        "grades": {
            "Homework": {
                "weight": 50,
                "grades": []
            },
            "Tests": {
                "weight": 50,
                "grades": []
            }
        }
    }
    data.push(obj)
    constructEdit(obj)
}

IMPORT.onclick = function() {
    var input = document.createElement("input")
    input.type = "file"
    input.accept = ".grades"
    input.click()

    input.onchange = function(ev) {
        var file = ev.target.files[0]
        var reader = new FileReader();
        reader.readAsText(file,"UTF-8");
        reader.onload = readerEvent => {
            var content = readerEvent.target.result
            var c = JSON.parse(content)
            if (c) {
                CANVAS.innerHTML = ""
                CANVAS_EDIT.innerHTML = ""
                data = c
                for (var i = 0; i < data.length; i++) {
                    constructCard(data[i])
                }
            }
        }
    }
}

EXPORT.onclick = function() {
    var blob = new Blob([JSON.stringify(data)], { type: "text/plain" })
    var link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = "classes.grades"
    link.click()
}

function select(element) {
    if (!CANVAS_EDIT.hasChildNodes()) {
        for (var i = 0; i < data.length; i++) {
            if (element.id.includes(data[i]["name"])) {
                constructEdit(data[i])
                element.remove()
                break
            }
        }
    }
}

function constructCard(obj) {
    var card = document.createElement("div")
    card.className = "card"
    card.id = "class-" + obj["name"]
    if (!obj["position"]) {
        obj["position"] = [20,20]
    }
    card.style.top = obj["position"][0] + "px"
    card.style.left = obj["position"][1] + "px"
    card.style.backgroundColor = lerpColor("#FFFFFF", brightCartoonColors[Math.floor(Math.random() * brightCartoonColors.length)], 0.05)
    card.addEventListener('mousedown', mouseDown)
    function mouseDown(e) {
        document.addEventListener('mousemove', mouseMove)
        document.addEventListener('mouseup', mouseUp)
    }
    function mouseMove(e) {
        var top = parseInt(card.style.top, 10)
        var left = parseInt(card.style.left, 10)
        card.style.top = (top + e.movementY) + 'px'
        card.style.left = (left + e.movementX) + 'px'
    }
    function mouseUp(e) {
        document.removeEventListener('mousemove', mouseMove)
        var top = parseInt(card.style.top, 10)
        var left = parseInt(card.style.left, 10)
        if (top != NaN && left != NaN) {
            var dy = Math.abs(top - obj["position"][0])
            var dx = Math.abs(left - obj["position"][1])
            if (dy > 5 || dx > 5) {
                obj["position"] = [top, left]
            } else {
                select(card)
            }
        }
        document.removeEventListener('mouseup', mouseUp)
    }

    var card_title = document.createElement("div")
    card_title.className = "card-title"
    card_title.innerText = obj["name"]
    card.append(card_title)

    finalGrade = 0
    for (var key in obj["grades"]) {
        var card_component = document.createElement("ul")
        card_component.className = "card-component"

        var card_component_title = document.createElement("li")
        card_component_title.className = "card-component-title"
        card_component_title.innerText = "(" + (obj["grades"][key]["weight"]).toString() + "%) " + key + ":"
        card_component.appendChild(card_component_title)

        var finalTop = 0
        var finalBottom = 0
        for (var i in obj["grades"][key]["grades"]) {
            var grade = obj["grades"][key]["grades"][i]

            var card_component_grade = document.createElement("li")
            card_component_grade.innerText = ((grade[0] / grade[1]) * 100).toString() + "%"
            card_component.appendChild(card_component_grade)

            finalTop += grade[0]
            finalBottom += grade[1]
        }

        if (finalBottom == 0) {
            finalBottom = 1
            finalTop = 1
        }

        var card_component_final = document.createElement("li")
        card_component_final.className = "card-component-final"
        card_component_final.innerText = ((finalTop / finalBottom) * 100).toString().substring(0,5) + "%"
        card_component.appendChild(card_component_final)

        card.appendChild(card_component)

        finalGrade += (obj["grades"][key]["weight"] / 100) * (finalTop / finalBottom)
    }

    var card_final = document.createElement("div")
    card_final.className = "card-final"
    card_final.innerText = (finalGrade * 100).toString().substring(0,5) + "%"
    card_final.style.color = lerpColor("#FF5733", "#75FF33", finalGrade)
    card.appendChild(card_final)

    CANVAS.appendChild(card)
}
for (var i = 0; i < data.length; i++) {
    constructCard(data[i])
}

function constructEdit(obj) {

    function constructInput(val, onchange) {
        var input = document.createElement("input")
        input.type = "text"
        input.className = "edit-input"
        input.value = val
        input.onchange = onchange
        return input
     }

    var card = document.createElement("div")
    card.className = "edit"
    card.id = "class-" + obj["name"]

    var edit_add = document.createElement("div")
    edit_add.className = "edit-add"
    edit_add.innerText = "+"
    edit_add.onclick = function() {
        constructCard(obj)
        card.remove()
    }
    card.appendChild(edit_add)

    var edit_remove = document.createElement("div")
    edit_remove.className = "edit-remove"
    edit_remove.innerText = "-"
    edit_remove.onclick = function() {
        var nData = []
        for (var i = 0; i < data.length; i++) {
            if (data[i]["name"] != obj["name"]) {
                nData.push(data[i])
            }
        }
        data = nData
        card.remove()
    }
    card.appendChild(edit_remove)

    var card_title = constructInput(obj["name"], function(ev) {
        obj["name"] = ev.target.value
    })
    card_title.className = "edit-title"
    card.append(card_title)

    for (const key in obj["grades"]) {
        var card_component = document.createElement("ul")
        card_component.className = "card-component"

        var card_component_title = document.createElement("li")
        card_component_title.className = "card-component-title"
        card_component_title.appendChild(document.createTextNode("("))
        card_component_title.appendChild(constructInput(obj["grades"][key]["weight"], function(ev) {
            if (Number(ev.target.value) != NaN) {
                obj["grades"][key]["weight"] = Number(ev.target.value)
            }
        }))
        card_component_title.appendChild(document.createTextNode("%) "))
        card_component_title.appendChild(constructInput(key, function(ev) {
            obj["grades"][ev.target.value] = obj["grades"][key]
            delete obj["grades"][key]
            card.remove()
            constructEdit(obj)
        }))
        card_component_title.appendChild(document.createTextNode(":"))
        card_component.appendChild(card_component_title)

        for (var i in obj["grades"][key]["grades"]) {
            const grade = obj["grades"][key]["grades"][i]

            var card_component_grade = document.createElement("li")
            card_component_grade.appendChild(constructInput(grade[0], function(ev) {
                if (Number(ev.target.value) != NaN) {
                    grade[0] = Number(ev.target.value)
                }
            }))
            card_component_grade.appendChild(document.createTextNode("/"))
            card_component_grade.appendChild(constructInput(grade[1], function(ev) {
                if (Number(ev.target.value) != NaN) {
                    grade[1] = Number(ev.target.value)
                }
            }))
            card_component.appendChild(card_component_grade)
        }


        var edit_component_component_add = document.createElement("li")
        var edit_component_component_add_div = document.createElement("div")
        edit_component_component_add_div.innerText = "+"
        edit_component_component_add_div.className = "edit-component-add"
        edit_component_component_add_div.onclick = function() {
            obj["grades"][key]["grades"].push([1,1])
            constructEdit(obj)
            card.remove()
        }
        edit_component_component_add.appendChild(edit_component_component_add_div)
        card_component.appendChild(edit_component_component_add)

        card.appendChild(card_component)
    }
    var edit_component_add = document.createElement("div")
    edit_component_add.innerText = "+"
    edit_component_add.className = "edit-component-add"
    edit_component_add.onclick = function() {
        obj["grades"]["New"] = {
            "weight": 0,
            "grades": []
        }
        constructEdit(obj)
        card.remove()
    }
    card.appendChild(edit_component_add)

    CANVAS_EDIT.appendChild(card)
}

function animate() {
    requestAnimationFrame(animate);
}

animate();




// Helper
function hexToRgb(hex) {
    // Remove the hash at the start if it's there
    hex = hex.replace(/^#/, '');
    
    // Parse r, g, b values
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    return { r, g, b };
}

function rgbToHex(r, g, b) {
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}

function lerpColor(hex1, hex2, t) {
    const rgb1 = hexToRgb(hex1);
    const rgb2 = hexToRgb(hex2);
    
    const r = Math.round(rgb1.r + (rgb2.r - rgb1.r) * t);
    const g = Math.round(rgb1.g + (rgb2.g - rgb1.g) * t);
    const b = Math.round(rgb1.b + (rgb2.b - rgb1.b) * t);

    return rgbToHex(r, g, b);
}