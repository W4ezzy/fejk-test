let webManifest = {
    "name": "mObywatel Demo",
    "short_name": "mObywatel",
    "theme_color": "#111218",
    "background_color": "#111218",
    "display": "standalone",
    "icons": [
        { "src": "assets/demo-icon-192.png", "sizes": "192x192", "type": "image/png" },
        { "src": "assets/demo-icon-512.png", "sizes": "512x512", "type": "image/png" }
    ]
};

let manifestElem = document.createElement('link');
manifestElem.setAttribute('rel', 'manifest');
manifestElem.setAttribute('href', 'data:application/manifest+json;base64,' + btoa(JSON.stringify(webManifest)));
document.head.prepend(manifestElem);
