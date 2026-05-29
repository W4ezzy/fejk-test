(function () {
    var documentCatalog = (window.DOCUMENT_CATALOG || []).filter(function (doc) {
        return !doc.locked;
    });
    var cards = document.querySelector(".documents_cards");
    var customizeButton = document.querySelector('[data-action="customize"]');
    var addButton = document.querySelector('[data-action="add"]');

    document.querySelector(".mdowod_card").addEventListener("click", function () {
        sendTo("card");
    });

    customizeButton.addEventListener("click", function () {
        sendTo("documents-customize");
    });

    addButton.addEventListener("click", function () {
        sendTo("documents-add");
    });

    renderAddedDocuments();

    function renderAddedDocuments() {
        getAddedDocuments().forEach(function (id) {
            var item = documentCatalog.find(function (doc) {
                return doc.id === id;
            });
            if (!item) {
                return;
            }

            var card = document.createElement("button");
            card.type = "button";
            card.className = "added_document";
            card.innerHTML = [
                '<span class="added_document_icon"></span>',
                '<span class="added_document_text">',
                    '<span class="added_document_title"></span>',
                    '<span class="added_document_subtitle"></span>',
                '</span>'
            ].join("");
            card.querySelector(".added_document_icon").style.background = item.color;
            card.querySelector(".added_document_title").textContent = item.title;
            card.querySelector(".added_document_subtitle").textContent = item.subtitle || item.description || "";
            card.addEventListener("click", function () {
                sendTo("documents-customize");
            });
            cards.appendChild(card);
        });
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

        return values.filter(function (value, index) {
            return values.indexOf(value) === index && documentCatalog.some(function (doc) {
                return doc.id === value;
            });
        });
    }
})();
