var params = new URLSearchParams(window.location.search);
var expectedPin = (params.get("pin") || "123456").replace(/\D/g, "").slice(0, 6);
if (expectedPin.length !== 6) {
    expectedPin = "123456";
}

var input = document.querySelector(".password_input");
var eye = document.querySelector(".eye");
var statusText = document.querySelector(".pin_status");
var loginButton = document.querySelector(".login");
var biometricButton = document.querySelector(".biometric_login");
var passwordBox = document.querySelector(".password_box");
var biometricSheet = document.querySelector(".biometric_sheet");
var biometricCard = document.querySelector(".biometric_card");
var biometricTitle = document.querySelector(".biometric_title");
var biometricHint = document.querySelector(".biometric_hint");
var biometricCancel = document.querySelector(".biometric_cancel");
var biometricMode = getBiometricMode();

setupBiometricCopy();

loginButton.addEventListener("click", verifyPin);
biometricButton.addEventListener("click", loginWithBiometricDemo);
biometricCancel.addEventListener("click", closeBiometricSheet);

input.addEventListener("input", function () {
    input.value = input.value.replace(/\D/g, "").slice(0, 6);
    statusText.textContent = "";
});

input.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        verifyPin();
    }
});

eye.addEventListener("click", function () {
    if (input.type === "password") {
        input.type = "text";
        eye.classList.add("eye_close");
        eye.setAttribute("aria-label", "Ukryj hasło");
    } else {
        input.type = "password";
        eye.classList.remove("eye_close");
        eye.setAttribute("aria-label", "Pokaż hasło");
    }
});

function verifyPin(){
    var pin = input.value.replace(/\D/g, "");
    if (pin.length !== 6) {
        setStatus("Wpisz 6 cyfr hasła.", "error");
        input.focus();
        return;
    }

    setChecking(true);

    delay(650).then(function () {
        if (pin !== expectedPin) {
            setChecking(false);
            setStatus("Nieprawidłowe hasło.", "error");
            input.value = "";
            input.focus();
            return;
        }

        setStatus("Hasło poprawne.", "success");
        delay(300).then(toHome);
    });
}

function loginWithBiometricDemo(){
    biometricSheet.classList.add("is-open");
    biometricSheet.setAttribute("aria-hidden", "false");
    biometricCard.classList.remove("is-done");
    biometricButton.disabled = true;
    biometricCancel.disabled = false;
    setBiometricCheckingCopy();

    delay(1050).then(function () {
        if (!biometricSheet.classList.contains("is-open")) {
            return;
        }

        biometricCard.classList.add("is-done");
        biometricTitle.textContent = "Potwierdzono";
        biometricHint.textContent = "Logowanie zakończone powodzeniem.";
        delay(450).then(toHome);
    });
}

function closeBiometricSheet(){
    biometricSheet.classList.remove("is-open");
    biometricSheet.setAttribute("aria-hidden", "true");
    biometricButton.disabled = false;
}

function setupBiometricCopy(){
    biometricSheet.dataset.mode = biometricMode;
    if (biometricMode === "face") {
        biometricButton.textContent = "Logowanie Face ID";
        return;
    }

    if (biometricMode === "fingerprint") {
        biometricButton.textContent = "Logowanie odciskiem palca";
        return;
    }

    biometricButton.textContent = "Logowanie biometrią";
}

function setBiometricCheckingCopy(){
    if (biometricMode === "face") {
        biometricTitle.textContent = "Spójrz na ekran";
        biometricHint.textContent = "Face ID dla aplikacji mObywatel.";
        return;
    }

    if (biometricMode === "fingerprint") {
        biometricTitle.textContent = "Przyłóż palec";
        biometricHint.textContent = "Odcisk palca dla aplikacji mObywatel.";
        return;
    }

    biometricTitle.textContent = "Potwierdź biometrię";
    biometricHint.textContent = "Biometria dla aplikacji mObywatel.";
}

function getBiometricMode(){
    var userAgent = navigator.userAgent || navigator.vendor || "";
    if (/iPad|iPhone|iPod/.test(userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)) {
        return "face";
    }

    if (/android/i.test(userAgent)) {
        return "fingerprint";
    }

    return "fingerprint";
}

function setChecking(isChecking){
    passwordBox.classList.toggle("is-checking", isChecking);
    loginButton.disabled = isChecking;
    input.disabled = isChecking;
}

function setStatus(message, type){
    statusText.textContent = message;
    statusText.style.color = type === "success" ? "#6be28d" : "#ff8585";
}

function toHome(){
    markLoggedIn();
    var nextPage = getNextPage();
    var qs = params.toString();
    location.href = nextPage + (qs ? "?" + qs : "");
}

function markLoggedIn(){
    try {
        sessionStorage.setItem("mobyLoggedIn", "1");
        sessionStorage.removeItem("mobyNeedsLogin");
    } catch (error) {}
}

function getNextPage(){
    var next = (params.get("next") || "home").toLowerCase();
    var allowed = {
        home: "home.html",
        card: "card.html",
        services: "services.html",
        qr: "qr.html",
        more: "more.html",
        moreid: "moreid.html",
        pesel: "pesel.html",
        scanqr: "scanqr.html",
        showqr: "showqr.html",
        shortcuts: "shortcuts.html",
        "service-demo": "service-demo.html",
        "documents-add": "documents-add.html",
        "documents-customize": "documents-customize.html"
    };

    return allowed[next] || "home.html";
}

function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time);
    });
}
