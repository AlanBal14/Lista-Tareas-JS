// ============================================
// LISTA DE TAREAS
// ============================================


// ============================================
// ELEMENTOS DEL HTML
// ============================================

const formulario =
    document.getElementById('form-tarea');

const inputTarea =
    document.getElementById('input-tarea');

const inputFecha =
    document.getElementById('input-fecha');

const inputCategoria =
    document.getElementById('input-categoria');

const listaTareas =
    document.getElementById('lista-tareas');

const contadorPendientes =
    document.getElementById('contador-pendientes');

const botonesFiltro =
    document.querySelectorAll('.filtro');

const filtroCategoria =
    document.getElementById('filtro-categoria');

const btnTema =
    document.getElementById('btn-tema');


// ============================================
// VARIABLES
// ============================================

let tareas = [];

let filtroActual = 'todas';

let categoriaActual = 'todas';


// ============================================
// CARGAR TAREAS
// ============================================

function cargarTareas() {

    const tareasGuardadas =
        localStorage.getItem('tareas');


    if (tareasGuardadas) {

        try {

            tareas =
                JSON.parse(tareasGuardadas);


            // Compatibilidad con tareas antiguas
            tareas = tareas.map(tarea => {

                return {

                    ...tarea,

                    fechaLimite:
                        tarea.fechaLimite || '',

                    categoria:
                        tarea.categoria || 'Otro'
                };
            });

        } catch (error) {

            tareas = [];

            console.error(
                'Error al cargar tareas:',
                error
            );
        }
    }


    renderizarTareas();
}


// ============================================
// GUARDAR TAREAS
// ============================================

function guardarTareas() {

    localStorage.setItem(
        'tareas',
        JSON.stringify(tareas)
    );
}


// ============================================
// AGREGAR TAREA
// ============================================

function agregarTarea(
    texto,
    fechaLimite,
    categoria
) {

    const nuevaTarea = {

        id: Date.now(),

        texto: texto,

        completada: false,

        fechaLimite: fechaLimite,

        categoria: categoria
    };


    tareas.unshift(
        nuevaTarea
    );


    guardarTareas();

    renderizarTareas();
}


// ============================================
// COMPLETAR TAREA
// ============================================

function cambiarEstadoTarea(id) {

    tareas = tareas.map(tarea => {

        if (tarea.id === id) {

            return {

                ...tarea,

                completada:
                    !tarea.completada
            };
        }


        return tarea;
    });


    guardarTareas();

    renderizarTareas();
}


// ============================================
// EDITAR TAREA
// ============================================

function editarTarea(id) {

    const tarea =
        tareas.find(
            tarea => tarea.id === id
        );


    if (!tarea) {

        return;
    }


    const nuevoTexto =
        prompt(
            'Editar tarea:',
            tarea.texto
        );


    // Si presiona cancelar
    if (nuevoTexto === null) {

        return;
    }


    const textoLimpio =
        nuevoTexto.trim();


    if (textoLimpio === '') {

        alert(
            'La tarea no puede quedar vacía.'
        );

        return;
    }


    tarea.texto =
        textoLimpio;


    guardarTareas();

    renderizarTareas();
}


// ============================================
// ELIMINAR CON ANIMACIÓN
// ============================================

function eliminarTarea(id, elemento) {

    // Agregar animación
    elemento.classList.add(
        'eliminando'
    );


    // Esperar a que termine la animación
    setTimeout(() => {

        tareas =
            tareas.filter(
                tarea => tarea.id !== id
            );


        guardarTareas();

        renderizarTareas();

    }, 500);
}


// ============================================
// FILTRAR TAREAS
// ============================================

function obtenerTareasFiltradas() {

    let resultado =
        [...tareas];


    // Filtro por estado
    if (
        filtroActual ===
        'pendientes'
    ) {

        resultado =
            resultado.filter(
                tarea =>
                    !tarea.completada
            );
    }


    if (
        filtroActual ===
        'completadas'
    ) {

        resultado =
            resultado.filter(
                tarea =>
                    tarea.completada
            );
    }


    // Filtro por categoría
    if (
        categoriaActual !==
        'todas'
    ) {

        resultado =
            resultado.filter(
                tarea =>
                    tarea.categoria ===
                    categoriaActual
            );
    }


    return resultado;
}


// ============================================
// CONVERTIR FECHA
// ============================================

function convertirFecha(fecha) {

    if (!fecha) {

        return null;
    }


    const partes =
        fecha.split('-');


    const anio =
        Number(partes[0]);

    const mes =
        Number(partes[1]) - 1;

    const dia =
        Number(partes[2]);


    return new Date(
        anio,
        mes,
        dia
    );
}


// ============================================
// FORMATEAR FECHA
// ============================================

function formatearFecha(fecha) {

    if (!fecha) {

        return 'Sin fecha';
    }


    const partes =
        fecha.split('-');


    return (
        partes[2] +
        '/' +
        partes[1] +
        '/' +
        partes[0]
    );
}


// ============================================
// CALCULAR DÍAS RESTANTES
// ============================================

function calcularDiasRestantes(
    fechaLimite
) {

    const fecha =
        convertirFecha(
            fechaLimite
        );


    if (!fecha) {

        return null;
    }


    const hoy =
        new Date();


    hoy.setHours(
        0,
        0,
        0,
        0
    );


    fecha.setHours(
        0,
        0,
        0,
        0
    );


    const diferencia =
        fecha - hoy;


    return Math.round(
        diferencia /
        (1000 * 60 * 60 * 24)
    );
}


// ============================================
// MENSAJE DE FECHA
// ============================================

function obtenerMensajeFecha(
    tarea
) {

    if (!tarea.fechaLimite) {

        return '📅 Sin fecha';
    }


    const fecha =
        formatearFecha(
            tarea.fechaLimite
        );


    const dias =
        calcularDiasRestantes(
            tarea.fechaLimite
        );


    if (tarea.completada) {

        return `📅 ${fecha}`;
    }


    if (dias < 0) {

        return (
            `⛔ Vencida - ${fecha}`
        );
    }


    if (dias === 0) {

        return (
            `⚠️ Vence hoy - ${fecha}`
        );
    }


    if (dias === 1) {

        return (
            `⚠️ Vence mañana - ${fecha}`
        );
    }


    if (dias <= 2) {

        return (
            `⚠️ Por vencer - ${fecha}`
        );
    }


    return `📅 ${fecha}`;
}


// ============================================
// CLASE DE CATEGORÍA
// ============================================

function obtenerClaseCategoria(
    categoria
) {

    return (
        'categoria-' +
        categoria
            .toLowerCase()
            .replaceAll(' ', '-')
    );
}


// ============================================
// RENDERIZAR TAREAS
// ============================================

function renderizarTareas() {

    listaTareas.innerHTML =
        '';


    const tareasFiltradas =
        obtenerTareasFiltradas();


    // ========================================
    // SIN TAREAS
    // ========================================

    if (
        tareasFiltradas.length === 0
    ) {

        const mensaje =
            document.createElement(
                'li'
            );


        mensaje.classList.add(
            'sin-tareas'
        );


        mensaje.textContent =
            'No hay tareas para mostrar.';


        listaTareas.appendChild(
            mensaje
        );


        actualizarContador();

        return;
    }


    // ========================================
    // CREAR TAREAS
    // ========================================

    tareasFiltradas.forEach(
        tarea => {

            const li =
                document.createElement(
                    'li'
                );


            li.classList.add(
                'tarea'
            );


            li.dataset.id =
                tarea.id;


            // Completada
            if (
                tarea.completada
            ) {

                li.classList.add(
                    'completada'
                );
            }


            // =================================
            // REVISAR FECHA
            // =================================

            const dias =
                calcularDiasRestantes(
                    tarea.fechaLimite
                );


            if (
                !tarea.completada &&
                dias !== null
            ) {

                if (dias < 0) {

                    li.classList.add(
                        'vencida'
                    );

                } else if (
                    dias <= 2
                ) {

                    li.classList.add(
                        'por-vencer'
                    );
                }
            }


            // =================================
            // CHECKBOX
            // =================================

            const checkbox =
                document.createElement(
                    'input'
                );


            checkbox.type =
                'checkbox';


            checkbox.checked =
                tarea.completada;


            checkbox.setAttribute(
                'aria-label',
                'Cambiar estado de tarea'
            );


            // =================================
            // CONTENIDO
            // =================================

            const contenido =
                document.createElement(
                    'div'
                );


            contenido.classList.add(
                'contenido-tarea'
            );


            // Texto
            const texto =
                document.createElement(
                    'span'
                );


            texto.classList.add(
                'tarea-texto'
            );


            texto.textContent =
                tarea.texto;


            // Categoría
            const categoria =
                document.createElement(
                    'span'
                );


            categoria.classList.add(
                'categoria'
            );


            categoria.classList.add(
                obtenerClaseCategoria(
                    tarea.categoria
                )
            );


            categoria.textContent =
                tarea.categoria;


            // Fecha
            const fecha =
                document.createElement(
                    'small'
                );


            fecha.classList.add(
                'tarea-fecha'
            );


            fecha.textContent =
                obtenerMensajeFecha(
                    tarea
                );


            contenido.appendChild(
                texto
            );


            contenido.appendChild(
                categoria
            );


            contenido.appendChild(
                fecha
            );


            // =================================
            // EDITAR
            // =================================

            const botonEditar =
                document.createElement(
                    'button'
                );


            botonEditar.classList.add(
                'btn-editar'
            );


            botonEditar.textContent =
                '✏️';


            botonEditar.setAttribute(
                'aria-label',
                'Editar tarea'
            );


            // =================================
            // ELIMINAR
            // =================================

            const botonEliminar =
                document.createElement(
                    'button'
                );


            botonEliminar.classList.add(
                'btn-eliminar'
            );


            botonEliminar.textContent =
                '🗑️';


            botonEliminar.setAttribute(
                'aria-label',
                'Eliminar tarea'
            );


            // =================================
            // EVENTOS
            // =================================

            checkbox.addEventListener(
                'change',
                () => {

                    cambiarEstadoTarea(
                        tarea.id
                    );
                }
            );


            botonEditar.addEventListener(
                'click',
                () => {

                    editarTarea(
                        tarea.id
                    );
                }
            );


            botonEliminar.addEventListener(
                'click',
                () => {

                    eliminarTarea(
                        tarea.id,
                        li
                    );
                }
            );


            // =================================
            // MOSTRAR
            // =================================

            li.appendChild(
                checkbox
            );


            li.appendChild(
                contenido
            );


            li.appendChild(
                botonEditar
            );


            li.appendChild(
                botonEliminar
            );


            listaTareas.appendChild(
                li
            );
        }
    );


    actualizarContador();
}


// ============================================
// CONTADOR
// ============================================

function actualizarContador() {

    const pendientes =
        tareas.filter(
            tarea =>
                !tarea.completada
        ).length;


    contadorPendientes.textContent =
        pendientes;
}


// ============================================
// FORMULARIO
// ============================================

formulario.addEventListener(
    'submit',
    function(evento) {

        evento.preventDefault();


        const texto =
            inputTarea
                .value
                .trim();


        const fechaLimite =
            inputFecha.value;


        const categoria =
            inputCategoria.value;


        // Validar texto
        if (texto === '') {

            alert(
                'Escribe una tarea.'
            );

            return;
        }


        // Validar fecha
        if (fechaLimite === '') {

            alert(
                'Selecciona una fecha límite.'
            );

            return;
        }


        // Validar categoría
        if (categoria === '') {

            alert(
                'Selecciona una categoría.'
            );

            return;
        }


        agregarTarea(
            texto,
            fechaLimite,
            categoria
        );


        // Limpiar
        inputTarea.value =
            '';

        inputFecha.value =
            '';

        inputCategoria.value =
            '';


        inputTarea.focus();
    }
);


// ============================================
// FILTROS POR ESTADO
// ============================================

botonesFiltro.forEach(
    boton => {

        boton.addEventListener(
            'click',
            () => {

                botonesFiltro.forEach(
                    otroBoton => {

                        otroBoton
                            .classList
                            .remove(
                                'activo'
                            );
                    }
                );


                boton
                    .classList
                    .add(
                        'activo'
                    );


                filtroActual =
                    boton.dataset.filtro;


                renderizarTareas();
            }
        );
    }
);


// ============================================
// FILTRO CATEGORÍA
// ============================================

filtroCategoria.addEventListener(
    'change',
    () => {

        categoriaActual =
            filtroCategoria.value;


        renderizarTareas();
    }
);


// ============================================
// MODO CLARO / OSCURO
// ============================================

function cargarTema() {

    const temaGuardado =
        localStorage.getItem(
            'tema'
        );


    if (
        temaGuardado ===
        'oscuro'
    ) {

        document.body
            .classList
            .add(
                'modo-oscuro'
            );


        btnTema.textContent =
            '☀️';

    } else {

        btnTema.textContent =
            '🌙';
    }
}


btnTema.addEventListener(
    'click',
    () => {

        document.body
            .classList
            .toggle(
                'modo-oscuro'
            );


        const oscuro =
            document.body
                .classList
                .contains(
                    'modo-oscuro'
                );


        if (oscuro) {

            btnTema.textContent =
                '☀️';


            localStorage.setItem(
                'tema',
                'oscuro'
            );

        } else {

            btnTema.textContent =
                '🌙';


            localStorage.setItem(
                'tema',
                'claro'
            );
        }
    }
);


// ============================================
// INICIAR APP
// ============================================

cargarTema();

cargarTareas();

console.log(
    'Aplicación iniciada correctamente'
);