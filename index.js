items_order = ["heads", "shirts", "pants", "accesories"]
items_index = 0

backgrounds = ["The_Hell.webp", "studio.png", "Chain.jpg"]
background_index = 0

z_index = 1

function set_background() {
    background = document.getElementById("background")

    if (backgrounds[background_index] == "none")
        background.src = `background/${backgrounds[background_index]}`


    background.src = `background/${backgrounds[background_index]}`

}

set_background()

function set_items() {

    for (item of items_order)
        document.getElementById(item).style.display = "none"

    document.getElementById(items_order[items_index]).style.display = ""

    document.getElementById("items_title").innerText = capitalizeFirstLetter(items_order[items_index])

}

set_items()

function capitalizeFirstLetter(val) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

function next_background() {
    background_index += 1
    background_index %= backgrounds.length
    set_background()
}

function prev_background() {
    background_index -= 1
    if (background_index < 0) background_index += backgrounds.length
    background_index %= backgrounds.length
    
    set_background()
}


function next_items() {
    items_index += 1
    items_index %= items_order.length
    set_items()
}

function prev_items() {
    items_index -= 1
    if (items_index < 0) items_index += items_order.length
    items_index %= items_order.length
    
    set_items()

}



dialogue = ["Wow, you look awesome", "Slay.", "This is hotter then the lava in bowsers castle!", "Thank god I have my critic credit card"]


function change_dialogue() {
    text = document.getElementById("text")
    text.innerText = dialogue[Math.floor(Math.random() * dialogue.length)]
}


function remove_item_from_list(element) {

    new_element = element.cloneNode(true)

    new_element.classList.add("photo")
    new_element.classList.add("content")

    make_dragging(new_element)
    make_interactable(new_element)

    new_element.draggable = false
    new_element.querySelector("img").draggable = false

    element.style.visibility = "hidden"

    document.body.appendChild(new_element)
    
    oldRect = element.getBoundingClientRect()
    new_element.style.top = oldRect.top + 'px';
    new_element.style.left = oldRect.left + 'px';

}

mouseOffsetX = 0
mouseOffsetY = 0

mouseX = 0
mouseY = 0


for (continer of document.querySelectorAll(".img_container")) {
        continer.addEventListener("mousedown", function (e) {

        remove_item_from_list(e.currentTarget)
    })
}



let dragging_element;
let selected_element;
let scaling_corner;
let rotating = false;


current_rotation = 0

function make_dragging(element) {
    remove_dragging()
    element.classList.add("dragging");
    dragging_element = element
}

function remove_dragging() {
    if (dragging_element == undefined) return
    dragging_element.classList.remove("dragging");
    dragging_element = undefined
}

function make_selected(element) {
    remove_selected()

    element.classList.add("selected")
    selected_element = element

    rot = document.createElement("div")
    rot.classList.add("handle")
    rot.id = "rotation_handle"

    Xhandle = document.createElement("div")
    Xhandle.classList.add("handle")
    Xhandle.id = "Xhandle"

    Yhandle = document.createElement("div")
    Yhandle.classList.add("handle")
    Yhandle.id = "Yhandle"

    XYhandle = document.createElement("div")
    XYhandle.classList.add("handle")
    XYhandle.id = "XYhandle"

    center = document.createElement("div")
    center.classList.add("handle")
    center.id = "center"


    element.appendChild(rot)
    element.appendChild(Xhandle)
    element.appendChild(Yhandle)
    element.appendChild(XYhandle)
    element.appendChild(center)


    rot.addEventListener("mousedown", () => {make_rotating()})
    Xhandle.addEventListener("mousedown", () => {make_scaling(Xhandle)})
    Yhandle.addEventListener("mousedown", () => {make_scaling(Yhandle)})
    XYhandle.addEventListener("mousedown", () => {make_scaling(XYhandle)})


}

function remove_selected() {
    if (selected_element == undefined) return
    for (handle of selected_element.querySelectorAll(".handle"))
        selected_element.removeChild(handle)

    selected_element.classList.remove("selected");
    selected_element = undefined

}

function make_rotating() {
    rotating = true
}

function remove_rotating() {
    rotating = false
}

function make_scaling(corner) {
    scaling_corner = corner
}

function remove_scaling() {
    scaling_corner = undefined
}


// make it so content elements can be moved around screen
function make_interactable(element) {

    // Handle click and hold
    element.addEventListener('mousedown', (e) => {
        if (e.target.classList.contains("handle"))
            return

        make_dragging(element)

        element.style.zIndex = z_index
        z_index += 1

    });

    element.addEventListener('mouseup', () => {
        remove_dragging();
        make_selected(element)

    });
}

document.addEventListener("mousemove", (e) => {
    prevX = mouseX
    prevY = mouseY
    mouseX = e.clientX
    mouseY = e.clientY

    if (rotating) {
        image = selected_element.querySelector("img")
        imgRect = image.getBoundingClientRect()
        imgX = imgRect.left + imgRect.width / 2
        imgY = imgRect.top + imgRect.height / 2

        selected_element.style.transform = `rotate(${Math.atan2(mouseY - imgY, mouseX - imgX) + 3 * Math.PI / 4}rad)`

        current_rotation = Math.atan2(mouseY - imgY, mouseX - imgX) + 3 * Math.PI / 4
    }


    if (dragging_element != undefined) {

        dragging_element.style.top = parseFloat(dragging_element.style.top) + (mouseY - prevY) +'px';
        dragging_element.style.left = parseFloat(dragging_element.style.left) + (mouseX - prevX) + 'px';

    }

    if (scaling_corner != undefined) {
        image = selected_element.querySelector("img")
        if (scaling_corner.id == "Xhandle") {
            rect = image.getBoundingClientRect()
            scales = (image.style.scale).split(" ")
            if (scales.length == 0)
                scales.push("1")
            if (scales.length == 1)
                scales.push("1")
            if (scales[0] == '')
                scales[0] = '1'

            mouseDelta = [mouseX - prevX, mouseY - prevY]
            handleVector = [Math.cos(current_rotation), Math.sin(current_rotation)]
            dotProduct = mouseDelta[0] * handleVector[0]+ mouseDelta[1] * handleVector[1]


            image.style.scale = parseFloat(scales[0]) + 2 * dotProduct / image.width + " " + String(scales[1])
        }

        if (scaling_corner.id == "Yhandle") {
            rect = image.getBoundingClientRect()
            scales = (image.style.scale).split(" ")
            if (scales.length == 0)
                scales.push("1")
            if (scales.length == 1)
                scales.push("1")
            if (scales[0] == '')
                scales[0] = '1'

            mouseDelta = [mouseX - prevX, mouseY - prevY]
            handleVector = [Math.cos(current_rotation - Math.PI / 2), Math.sin(current_rotation - Math.PI / 2)]
            dotProduct = mouseDelta[0] * handleVector[0] + mouseDelta[1] * handleVector[1]

            

            image.style.scale = String(scales[0]) + " " + (parseFloat(scales[1]) + (2 * dotProduct / image.height))

        }

        if (scaling_corner.id == "XYhandle") {
            rect = image.getBoundingClientRect()
            scales = (image.style.scale).split(" ")
            if (scales.length == 0)
                scales.push("1")
            if (scales[0] == '')
                scales[0] = '1'
            if (scales.length == 1)
                scales.push(scales[0])
            


            mouseDelta = [mouseX - prevX, mouseY - prevY]
            handleVector = [Math.cos(current_rotation - Math.PI / 2), Math.sin(current_rotation - Math.PI / 2)]
            YdotProduct = mouseDelta[0] * handleVector[0] + mouseDelta[1] * handleVector[1]

            mouseDelta = [mouseX - prevX, mouseY - prevY]
            handleVector = [Math.cos(current_rotation), Math.sin(current_rotation)]
            XdotProduct = mouseDelta[0] * handleVector[0] + mouseDelta[1] * handleVector[1]

            image.style.scale = (parseFloat(scales[0]) + 2 * XdotProduct / image.width) + " " + (parseFloat(scales[1]) + (2 * YdotProduct / image.height))
        }

    }

})

document.addEventListener("mouseup", (e) => {
    remove_dragging()
    remove_rotating()
    remove_scaling()
})

document.addEventListener("mousedown", (e) => {
    if (!e.target.classList.contains("handle"))
        remove_selected()
})

document.addEventListener('keydown', function(event) {
  if (event.key === 'Delete' || event.key === 'Backspace') {
    if (selected_element == undefined)
        return
    

    image = selected_element.querySelector("img")

    original = document.querySelector(`.items > .img_container > img[src*=\"${image.src.split("/")[4]}\"]`).parentElement

    original.style.visibility = "visible"
    selected_element.remove()

    remove_selected()
    remove_dragging()

    
  }
});