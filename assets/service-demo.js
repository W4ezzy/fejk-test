(function () {
    var params = new URLSearchParams(window.location.search);
    var serviceName = params.get("service") || "Usługa";
    var iconSrc = params.get("icon") || "services_files/sign_document.png";
    var profile = getServiceProfile(serviceName);
    var title = document.querySelector(".service_title");
    var icon = document.querySelector(".service_hero_icon");
    var description = document.querySelector(".service_description");
    var requirement = document.querySelector(".service_requirement");
    var serviceTime = document.querySelector(".service_time");
    var points = document.querySelector(".service_points");
    var backButton = document.querySelector(".back_button");
    var favoriteButton = document.querySelector(".favorite_button");
    var primaryButton = document.querySelector(".service_primary");
    var secondaryButton = document.querySelector(".service_secondary");
    var toast = document.querySelector(".demo_toast");
    var flow = document.querySelector(".service_flow");
    var flowIcon = document.querySelector(".flow_icon");
    var flowTitle = document.querySelector(".flow_title");
    var flowMessage = document.querySelector(".flow_message");
    var flowClose = document.querySelector(".flow_close");
    var flowDone = document.querySelector(".flow_done");
    var progress = Array.from(document.querySelectorAll(".flow_progress span"));
    var toastTimer;
    var flowTimers = [];

    title.textContent = serviceName;
    icon.src = iconSrc;
    flowIcon.src = iconSrc;
    icon.alt = "";
    flowIcon.alt = "";
    description.textContent = profile.description;
    requirement.textContent = profile.requirement;
    serviceTime.textContent = profile.time;
    primaryButton.textContent = profile.action;
    document.title = serviceName + " - mObywatel";
    renderPoints(profile.points);

    backButton.addEventListener("click", function () {
        sendTo("services");
    });

    favoriteButton.addEventListener("click", function () {
        showToast("Dodano do ulubionych", "Zmiana została zapisana.");
    });

    primaryButton.addEventListener("click", startServiceFlow);

    secondaryButton.addEventListener("click", function () {
        showToast("Informacja", profile.info);
    });

    flowClose.addEventListener("click", closeFlow);
    flowDone.addEventListener("click", closeFlow);

    flow.addEventListener("click", function (event) {
        if (event.target === flow) {
            closeFlow();
        }
    });

    function renderPoints(items) {
        points.innerHTML = "";
        items.forEach(function (item) {
            var li = document.createElement("li");
            li.textContent = item;
            points.appendChild(li);
        });
    }

    function startServiceFlow() {
        clearFlowTimers();
        flow.classList.add("is-open");
        flow.setAttribute("aria-hidden", "false");
        flowDone.disabled = true;
        setFlowStep(0, "Przygotowanie usługi", "Sprawdzamy wymagane dane i gotowość połączenia.");

        flowTimers.push(setTimeout(function () {
            setFlowStep(1, "Weryfikacja danych", "Łączymy usługę z danymi zapisanymi w aplikacji.");
        }, 850));

        flowTimers.push(setTimeout(function () {
            setFlowStep(2, "Nie udało się zakończyć", "Usługa jest chwilowo niedostępna. Spróbuj ponownie później.");
            flowDone.disabled = false;
        }, 1850));
    }

    function setFlowStep(index, titleText, messageText) {
        flowTitle.textContent = titleText;
        flowMessage.textContent = messageText;
        progress.forEach(function (item, itemIndex) {
            item.classList.toggle("is-active", itemIndex <= index);
        });
    }

    function closeFlow() {
        clearFlowTimers();
        flow.classList.remove("is-open");
        flow.setAttribute("aria-hidden", "true");
        flowDone.disabled = false;
    }

    function clearFlowTimers() {
        flowTimers.forEach(clearTimeout);
        flowTimers = [];
    }

    function showToast(titleText, message) {
        toast.querySelector("strong").textContent = titleText;
        toast.querySelector("span").textContent = message;
        toast.classList.add("is-open");
        toast.setAttribute("aria-hidden", "false");
        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () {
            toast.classList.remove("is-open");
            toast.setAttribute("aria-hidden", "true");
        }, 2400);
    }

    function getServiceProfile(name) {
        var lower = name.toLowerCase();
        var base = {
            description: "Sprawdź informacje i uruchom obsługę sprawy w aplikacji.",
            requirement: "Potwierdzenie tożsamości",
            time: "Kilka minut",
            action: "Uruchom usługę",
            info: "Szczegóły tej usługi są chwilowo niedostępne.",
            points: [
                "Przejrzeć najważniejsze informacje",
                "Potwierdzić dane zapisane w aplikacji",
                "Kontynuować obsługę sprawy"
            ]
        };

        if (lower.indexOf("podpisz") !== -1) {
            return extend(base, {
                description: "Podpisz dokument elektronicznie i sprawdź jego status.",
                requirement: "Plik dokumentu",
                time: "1-2 min",
                action: "Wybierz dokument",
                info: "Usługa służy do rozpoczęcia podpisu dokumentu.",
                points: ["Wybrać dokument z urządzenia", "Sprawdzić podgląd przed podpisem", "Potwierdzić podpis w aplikacji"]
            });
        }

        if (lower.indexOf("pesel") !== -1 || lower.indexOf("dowód") !== -1 || lower.indexOf("dowod") !== -1) {
            return extend(base, {
                description: "Sprawdź status dokumentu lub numeru PESEL.",
                requirement: "Dane do sprawdzenia",
                time: "Około minuty",
                action: "Sprawdź",
                info: "Usługa pokazuje status po podaniu wymaganych danych.",
                points: ["Wpisać dane do weryfikacji", "Sprawdzić poprawność danych", "Zobaczyć wynik sprawdzenia"]
            });
        }

        if (lower.indexOf("recept") !== -1 || lower.indexOf("ikp") !== -1) {
            return extend(base, {
                description: "Przejdź do informacji zdrowotnych powiązanych z kontem.",
                requirement: "Dostęp do danych zdrowotnych",
                time: "Kilka sekund",
                action: "Otwórz",
                info: "Usługa wymaga dostępu do danych zdrowotnych.",
                points: ["Sprawdzić dostępne informacje", "Przejść do szczegółów", "Odświeżyć dane w aplikacji"]
            });
        }

        if (lower.indexOf("mandat") !== -1 || lower.indexOf("punkty") !== -1 || lower.indexOf("kierowcy") !== -1 || lower.indexOf("pojazd") !== -1 || lower.indexOf("autobus") !== -1) {
            return extend(base, {
                description: "Sprawdź informacje związane z kierowcą lub pojazdem.",
                requirement: "Dane pojazdu lub kierowcy",
                time: "1-3 min",
                action: "Sprawdź dane",
                info: "Usługa pokazuje informacje po połączeniu z rejestrem.",
                points: ["Wprowadzić lub wybrać dane", "Połączyć się z rejestrem", "Wyświetlić aktualny wynik"]
            });
        }

        if (lower.indexOf("firma") !== -1 || lower.indexOf("płatności") !== -1 || lower.indexOf("platnosci") !== -1) {
            return extend(base, {
                description: "Obsłuż wybraną sprawę firmową lub płatność.",
                requirement: "Aktywne konto",
                time: "Kilka minut",
                action: "Przejdź dalej",
                info: "Usługa wymaga potwierdzenia danych konta.",
                points: ["Sprawdzić dostępne sprawy", "Wybrać typ czynności", "Potwierdzić dane przed wysłaniem"]
            });
        }

        if (lower.indexOf("alert") !== -1 || lower.indexOf("powietrza") !== -1 || lower.indexOf("środowisk") !== -1 || lower.indexOf("srodowisk") !== -1) {
            return extend(base, {
                description: "Sprawdź aktualne informacje i zgłoszenia środowiskowe.",
                requirement: "Lokalizacja lub dane zgłoszenia",
                time: "Kilka minut",
                action: "Sprawdź",
                info: "Zakres informacji zależy od wybranej lokalizacji.",
                points: ["Wybrać lokalizację", "Sprawdzić aktualny komunikat", "Przejść do szczegółów zgłoszenia"]
            });
        }

        return base;
    }

    function extend(base, custom) {
        var result = {};
        Object.keys(base).forEach(function (key) {
            result[key] = base[key];
        });
        Object.keys(custom).forEach(function (key) {
            result[key] = custom[key];
        });
        return result;
    }
})();
