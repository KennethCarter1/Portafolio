document.documentElement.classList.add('js');

(function () {
    'use strict';

    const cabecera = document.querySelector('.cabecera');
    const botonMenu = document.querySelector('.boton-menu');
    const listaNavegacion = document.querySelector('.lista-navegacion');
    const enlacesNavegacion = Array.from(document.querySelectorAll('.enlace-navegacion'));
    const secciones = Array.from(document.querySelectorAll('main section[id]'));
    const elementosAparecer = Array.from(document.querySelectorAll('[data-aparecer]'));
    const botonSubir = document.querySelector('.boton-subir');
    const anioActual = document.querySelector('#anio-actual');
    const consultaEscritorio = window.matchMedia('(min-width: 48.01rem)');

    function establecerMenu(abierto) {
        if (!botonMenu || !listaNavegacion) return;

        botonMenu.setAttribute('aria-expanded', String(abierto));
        botonMenu.setAttribute('aria-label', abierto ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
        listaNavegacion.classList.toggle('abierta', abierto);
        cabecera?.classList.toggle('menu-visible', abierto);
        document.body.classList.toggle('menu-abierto', abierto);
    }

    botonMenu?.addEventListener('click', function () {
        establecerMenu(botonMenu.getAttribute('aria-expanded') !== 'true');
    });

    enlacesNavegacion.forEach(function (enlace) {
        enlace.addEventListener('click', function () {
            establecerMenu(false);
        });
    });

    document.addEventListener('keydown', function (evento) {
        if (evento.key === 'Escape' && botonMenu?.getAttribute('aria-expanded') === 'true') {
            establecerMenu(false);
            botonMenu.focus();
        }
    });

    consultaEscritorio.addEventListener('change', function (evento) {
        if (evento.matches) establecerMenu(false);
    });

    function actualizarElementosFijos() {
        const hayDesplazamiento = window.scrollY > 24;
        cabecera?.classList.toggle('desplazada', hayDesplazamiento);
        botonSubir?.classList.toggle('visible', window.scrollY > 650);
    }

    actualizarElementosFijos();
    window.addEventListener('scroll', actualizarElementosFijos, { passive: true });

    botonSubir?.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    function activarEnlace(idSeccion) {
        enlacesNavegacion.forEach(function (enlace) {
            const activo = enlace.getAttribute('href') === `#${idSeccion}`;
            enlace.classList.toggle('activo', activo);

            if (activo) {
                enlace.setAttribute('aria-current', 'page');
            } else {
                enlace.removeAttribute('aria-current');
            }
        });
    }

    if ('IntersectionObserver' in window) {
        const observadorSecciones = new IntersectionObserver(function (entradas) {
            const visibles = entradas
                .filter(function (entrada) { return entrada.isIntersecting; })
                .sort(function (a, b) { return b.intersectionRatio - a.intersectionRatio; });

            if (visibles[0]) activarEnlace(visibles[0].target.id);
        }, {
            rootMargin: '-30% 0px -55% 0px',
            threshold: [0, 0.1, 0.25]
        });

        secciones.forEach(function (seccion) {
            observadorSecciones.observe(seccion);
        });

        const observadorAparicion = new IntersectionObserver(function (entradas, observador) {
            entradas.forEach(function (entrada) {
                if (!entrada.isIntersecting) return;

                entrada.target.classList.add('visible');
                observador.unobserve(entrada.target);
            });
        }, {
            rootMargin: '0px 0px -8% 0px',
            threshold: 0.08
        });

        elementosAparecer.forEach(function (elemento, indice) {
            elemento.style.transitionDelay = `${Math.min(indice % 3, 2) * 70}ms`;
            observadorAparicion.observe(elemento);
        });
    } else {
        elementosAparecer.forEach(function (elemento) {
            elemento.classList.add('visible');
        });
    }

    if (anioActual) {
        anioActual.textContent = String(new Date().getFullYear());
    }
})();
