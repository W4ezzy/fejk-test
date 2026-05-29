var params = new URLSearchParams(window.location.search);
var ROUTES = {
    home: 'home.html',
    services: 'services.html',
    qr: 'qr.html',
    more: 'more.html',
    moreid: 'moreid.html',
    id: 'id.html',
    shortcuts: 'shortcuts.html',
    pesel: 'pesel.html',
    scanqr: 'scanqr.html',
    showqr: 'showqr.html',
    'service-demo': 'service-demo.html',
    'documents-add': 'documents-add.html',
    'documents-customize': 'documents-customize.html',
    gen: 'gen.html',
    card: 'card.html',
};
var INTERNAL_NAVIGATION_KEY = "mobyInternalNavigation";

guardSession();

function guardSession(){
    var page = (location.pathname.split('/').pop() || '').toLowerCase();
    var publicPages = ["", "id.html", "index.html", "app.html"];
    if (publicPages.indexOf(page) !== -1) {
        return;
    }

    try {
        if (sessionStorage.getItem("mobyLoggedIn") !== "1") {
            sendToLogin();
            return;
        }

        sessionStorage.removeItem("mobyNeedsLogin");
        sessionStorage.removeItem(INTERNAL_NAVIGATION_KEY);

        document.addEventListener("visibilitychange", function () {
            if (document.visibilityState === "hidden") {
                if (sessionStorage.getItem(INTERNAL_NAVIGATION_KEY) === "1") {
                    return;
                }
                sessionStorage.removeItem("mobyLoggedIn");
                sessionStorage.setItem("mobyNeedsLogin", "1");
                return;
            }

            if (document.visibilityState === "visible" && sessionStorage.getItem("mobyNeedsLogin") === "1") {
                sendToLogin();
            }
        });
    } catch (error) {}
}

function sendToLogin(){
    var page = (location.pathname.split('/').pop() || "home.html").replace(/\.html$/i, "");
    if (page && page !== "id") {
        params.set("next", page);
    }
    var qs = params.toString();
    location.replace("id.html" + (qs ? "?" + qs : ""));
}

function sendTo(key){
    var qs = params.toString();
    var file = ROUTES[String(key)] || (String(key).endsWith('.html') ? String(key) : String(key) + '.html');
    var href = file + (qs ? `?${qs}` : '');
    markInternalNavigation();
    location.href = href;
}

function markInternalNavigation(){
    try {
        sessionStorage.setItem(INTERNAL_NAVIGATION_KEY, "1");
    } catch (error) {}
}

document.querySelectorAll(".bottom_element_grid").forEach((element) => {
    element.addEventListener('click', () => {
        sendTo(element.getAttribute("send"))
    })
})

function getMobileOperatingSystem() {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;
  
    if (/windows phone/i.test(userAgent)) {
        return 1;
    }
  
    if (/android/i.test(userAgent)) {
        return 2;
    }
  
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return 3;
    }
  
    return 4;
  }
  
  if (getMobileOperatingSystem() == 2){
      var bottomBar = document.querySelector(".bottom_bar");
      if (bottomBar) {
          bottomBar.style.height = "70px";
      }
}
