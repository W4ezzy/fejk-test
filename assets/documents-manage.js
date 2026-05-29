(function () {
    var documents = window.DOCUMENT_CATALOG || [];
    var picker = document.querySelector(".document_picker");
    var primary = document.querySelector(".manage_primary");
    var back = document.querySelector(".back_link");
    var shell = document.querySelector(".documents_manage_shell");
    var isCustomize = shell && shell.dataset.mode === "customize";

    back.addEventListener("click", function () {
        sendTo("home");
    });

    renderOptions();
    updatePrimaryState();

    primary.addEventListener("click", function () {
        saveSelection();
        sendTo("home");
    });

    picker.addEventListener("change", updatePrimaryState);

    function renderOptions() {
        var current = getAddedDocuments();
        picker.innerHTML = "";

        documents.forEach(function (doc) {
            var isVisible = doc.locked || current.indexOf(doc.id) !== -1;
            var isAlreadyAdded = !isCustomize && isVisible;
            var label = document.createElement("label");
            label.className = "document_option";
            if (doc.locked || isAlreadyAdded) {
                label.classList.add("is-disabled");
            }

            label.innerHTML = [
                '<input type="checkbox" value="' + doc.id + '">',
                '<span class="document_thumb"></span>',
                '<span class="document_text">',
                    '<span class="document_title"></span>',
                    '<span class="document_subtitle"></span>',
                    '<span class="document_status"></span>',
                '</span>'
            ].join("");

            var input = label.querySelector("input");
            input.checked = isCustomize ? isVisible : isAlreadyAdded;
            input.disabled = !!doc.locked || isAlreadyAdded;
            label.querySelector(".document_thumb").style.background = doc.color;
            label.querySelector(".document_title").textContent = doc.title;
            label.querySelector(".document_subtitle").textContent = doc.subtitle || "";
            label.querySelector(".document_status").textContent = doc.locked || isAlreadyAdded ? "Na telefonie" : "";
            picker.appendChild(label);
        });
    }

    function saveSelection() {
        var selected = Array.from(picker.querySelectorAll("input:checked")).map(function (input) {
            return input.value;
        }).filter(isOptionalDocument);

        if (!isCustomize) {
            selected = mergeUnique(getAddedDocuments().concat(selected));
        }

        localStorage.setItem("addedDocuments", JSON.stringify(selected));
    }

    function updatePrimaryState() {
        if (isCustomize) {
            primary.disabled = false;
            return;
        }

        primary.disabled = picker.querySelectorAll("input:checked:not(:disabled)").length === 0;
    }

    function getAddedDocuments() {
        var values;
        try {
            values = JSON.parse(localStorage.getItem("addedDocuments") || "[]");
        } catch (error) {
            values = [];
        }

        if (!Array.isArray(values)) {
            return [];
        }

        return mergeUnique(values).filter(isOptionalDocument);
    }

    function isOptionalDocument(id) {
        return documents.some(function (doc) {
            return doc.id === id && !doc.locked;
        });
    }

    function mergeUnique(values) {
        return values.filter(function (value, index) {
            return values.indexOf(value) === index;
        });
    }
})();
