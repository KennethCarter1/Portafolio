function quitarHash() {
    history.replaceState(null, '', window.location.pathname);
}

document.querySelectorAll('.nav-superior a').forEach(function(enlace) {
    enlace.addEventListener('click', function() {
        setTimeout(quitarHash, 10);
    });
});

window.addEventListener('load', function() {
    if (window.location.hash) {
        setTimeout(quitarHash, 100);
    }
});

window.addEventListener('hashchange', quitarHash);
