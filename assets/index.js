var selector = document.querySelector(".selector_box");
selector.addEventListener('click', () => {
    if (selector.classList.contains("selector_open")){
        selector.classList.remove("selector_open")
    }else{
        selector.classList.add("selector_open")
    }
})

document.querySelectorAll(".date_input").forEach((element) => {
    element.addEventListener('click', () => {
        document.querySelector(".date").classList.remove("error_shown")
    })
})

var sex = "m"

document.querySelectorAll(".selector_option").forEach((option) => {
    option.addEventListener('click', () => {
        sex = option.id;
        document.querySelector(".selected_text").innerHTML = option.innerHTML;
    })
})

var upload = document.querySelector(".upload");

var imageInput = document.createElement("input");
imageInput.type = "file";
imageInput.accept = ".jpeg,.jpg,.png,.gif";

document.querySelectorAll(".input_holder").forEach((element) => {
    var input = element.querySelector(".input");
    input.addEventListener('click', () => {
        element.classList.remove("error_shown");
    })
});

upload.addEventListener('click', () => {
    imageInput.click();
    upload.classList.remove("error_shown")
});

imageInput.addEventListener('change', () => {
    upload.classList.remove("upload_loaded");
    upload.classList.add("upload_loading");
    upload.removeAttribute("selected");

    var file = imageInput.files[0];
    if (!file) return;

    var reader = new FileReader();
    reader.onload = function(e) {
        var base64 = e.target.result;
        sessionStorage.setItem("photo", base64);
        upload.classList.remove("error_shown");
        upload.setAttribute("selected", "ok");
        upload.classList.add("upload_loaded");
        upload.classList.remove("upload_loading");
        upload.querySelector(".upload_uploaded").src = base64;
    };
    reader.readAsDataURL(file);
});

document.querySelector(".go").addEventListener('click', () => {

    var empty = [];
    var params = new URLSearchParams();

    params.set("sex", sex);

    if (!upload.hasAttribute("selected")){
        empty.push(upload);
        upload.classList.add("error_shown");
    }

    var birthday = "";
    var dateEmpty = false;
    document.querySelectorAll(".date_input").forEach((element) => {
        birthday = birthday + "." + element.value;
        if (isEmpty(element.value)) dateEmpty = true;
    });
    birthday = birthday.substring(1);

    if (dateEmpty){
        var dateElement = document.querySelector(".date");
        dateElement.classList.add("error_shown");
        empty.push(dateElement);
    }else{
        params.set("birthday", birthday);
    }

    document.querySelectorAll(".input_holder").forEach((element) => {
        var input = element.querySelector(".input");
        if (isEmpty(input.value)){
            empty.push(element);
            element.classList.add("error_shown");
        }else{
            params.set(input.id, input.value);
        }
    });

    if (empty.length != 0){
        empty[0].scrollIntoView();
    }else{
        location.href = "id.html?" + params;
    }
});

function isEmpty(value){
    return /^\s*$/.test(value);
}

var guide = document.querySelector(".guide_holder");
if (guide) {
    guide.addEventListener('click', () => {
        guide.classList.toggle("unfolded");
    });
}
