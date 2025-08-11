items_order = ["heads", "shirts", "pants", "accesories"]
items_index = 0

backgrounds = ["the_hell.webp", "studio.png", "Chain.jpg"]
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
    }, { once: true })
}



let dragging_element;
let selected_element;
let rotating = false;

let hold_timer;
let timer_done;
var hold_duration = 500;

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
    element.classList.add("selected");
    selected_element = element

    div = document.createElement("div")
    div.id = "rotation_handle"

    element.appendChild(div)

    div.addEventListener("mousedown", () => {make_rotating();})

}

function remove_selected() {
    if (selected_element == undefined) return
    selected_element.removeChild(document.getElementById("rotation_handle"))
    selected_element.classList.remove("selected");
    selected_element = undefined

}

function make_rotating() {
    rotating = true
}

function remove_rotating() {
    rotating = false
}


// make it so content elements can be moved around screen
function make_interactable(element) {

    // Handle click and hold
    element.addEventListener('mousedown', (e) => {
        if (e.target.id == "rotation_handle")
            return
        console.log(e.target.id)

        timer_done = false;

        make_dragging(element)

        element.style.zIndex = z_index
        z_index += 1

        hold_timer = setTimeout(() => {
            timer_done = true;

        }, hold_duration);
    });

    element.addEventListener('mouseup', () => {
        if (!timer_done) {
            clearTimeout(hold_timer);
            remove_dragging();
            make_selected(element)
        }


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


        selected_element.style.transform = `rotate(${Math.atan2(mouseY - imgY, mouseX - imgX) + Math.PI / 2}rad)`
        console.log(mouseY, imgY, mouseX, imgY)
    }


    if (dragging_element != undefined) {

        dragging_element.style.top = parseInt(dragging_element.style.top) + (mouseY - prevY) +'px';
        dragging_element.style.left = parseInt(dragging_element.style.left) + (mouseX - prevX) + 'px';

    }

})

document.addEventListener("mouseup", (e) => {
    remove_dragging()
    remove_rotating()
})

document.addEventListener("mousedown", (e) => {
    if (e.target.id != "rotation_handle")
        remove_selected()
})