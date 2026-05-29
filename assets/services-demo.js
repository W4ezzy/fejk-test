(function () {
    var services = document.querySelectorAll(".service");

    services.forEach(function (service) {
        var nameElement = service.querySelector(".service_name");
        var iconElement = service.querySelector(".service_icon");
        if (!nameElement || !iconElement) {
            return;
        }

        service.setAttribute("role", "button");
        service.setAttribute("tabindex", "0");
        service.setAttribute("aria-label", "Otwórz usługę " + nameElement.textContent.trim());

        service.addEventListener("click", function () {
            openService(service);
        });

        service.addEventListener("keydown", function (event) {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openService(service);
            }
        });
    });

    function openService(service) {
        var name = service.querySelector(".service_name").textContent.trim();
        var icon = service.querySelector(".service_icon").getAttribute("src");
        var qs = new URLSearchParams(window.location.search);
        qs.set("service", name);
        qs.set("icon", icon);
        try {
            sessionStorage.setItem("mobyInternalNavigation", "1");
        } catch (error) {}
        window.location.href = "service-demo.html?" + qs.toString();
    }
})();
