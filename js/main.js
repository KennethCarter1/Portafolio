document.querySelectorAll('.nav-superior a').forEach(function(enlace) {
    enlace.addEventListener('click', function() {
        setTimeout(function() {
            history.replaceState(null, '', window.location.pathname);
        }, 0);
    });
});
