document.addEventListener("DOMContentLoaded", async () => {
    let greeting = "";
    let srcImage = "";
    const date = new Date();
    const hour = date.getHours();
    const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
    agregarBotonFlotante(userInfo);
    if (hour >= 5 && hour < 12) {
        greeting = `Buenos días, ${userInfo['first_name']}`;
        srcImage = "../sun_greeting.png";
    }
    else if (hour >= 12 && hour < 18) {
        greeting = `Buenas tardes, ${userInfo['first_name']}`;
        srcImage = "../sunrise_greeting.png"
    }
    else {
        greeting = `Buenas noches, ${userInfo['first_name']}`;
        srcImage = "../night_greeting.png";
    }
    document.getElementById("greeting").textContent = greeting;
    document.getElementById("image_greeting").src = srcImage;
})

function agregarBotonFlotante(userInfo) {
    if (userInfo.role_user !== "Admin") return;
    if (document.querySelector(".btn-add-float")) return;

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn-add-float";
    btn.title = "Agregar nuevo registro";
    btn.setAttribute("aria-label", "Agregar nuevo registro");

    const img = document.createElement("img");
    img.src = "add.png";
    img.alt = "Agregar";

    btn.appendChild(img);
    btn.addEventListener("click", () => {
        if (typeof goToAddNests === "function") {
            goToAddNests();
        }
    });

    document.body.appendChild(btn);
}

function goToAddNests(){
    window.location.href = "add_nests/add_nests.html";
    console.log("Yendo")
}

const URL_ACTIVIDADES_PLAYA = "https://api.proyectosprototipos.online/api/activitybeach/getactitiesbeach";
const URL_NIDOS = "https://api.proyectosprototipos.online/api/neststurtle/getturtlenest";

function limpiarTexto(valor) {
    return String(valor ?? "").replace(/\s+/g, " ").replace(/\s+,/g, ",").trim();
}

function getAuthHeaders() {
    const token = sessionStorage.getItem("sessionId");
    if (!token) {
        throw new Error("No se encontró el token de sesión en sessionStorage ('sessionid').");
    }
    return {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
    };
}

function crearFiltroActividades(actividades, alCambiar) {
    const barraFiltro = document.createElement("div");
    barraFiltro.className = "nests-filter-bar";

    const label = document.createElement("label");
    label.htmlFor = "select-actividad-playa";
    label.textContent = "Actividad de playa (ID): ";

    const select = document.createElement("select");
    select.id = "select-actividad-playa";

    const opcionTodas = document.createElement("option");
    opcionTodas.value = "";
    opcionTodas.textContent = "Todas las actividades";
    select.appendChild(opcionTodas);

    const fragment = document.createDocumentFragment();
    actividades.forEach((act) => {
        const option = document.createElement("option");
        option.value = String(act.id);
        const fechaLimpia = limpiarTexto(act.fecha);
        option.textContent = `#${act.id} · ${limpiarTexto(act.especie)} (${limpiarTexto(act.actividad_avistamiento)}) - ${fechaLimpia} ${limpiarTexto(act.hora)}`;
        fragment.appendChild(option);
    });

    select.appendChild(fragment);
    select.addEventListener("change", () => alCambiar(select.value));

    barraFiltro.append(label, select);
    return { barraFiltro, select };
}

function crearDatoNido(etiqueta, valor) {
    const item = document.createElement("div");
    item.className = "nest-dato";

    const spanLabel = document.createElement("span");
    spanLabel.className = "nest-etiqueta";
    spanLabel.textContent = etiqueta;

    const spanValor = document.createElement("span");
    spanValor.className = "nest-valor";
    spanValor.textContent = limpiarTexto(valor);

    item.append(spanLabel, spanValor);
    return item;
}

function crearTarjetaNido(nido) {
    const card = document.createElement("article");
    card.className = "nest-card";
    card.dataset.id = nido.id;
    card.dataset.actividadPlaya = nido.id_actividad_playa;

    const header = document.createElement("div");
    header.className = "nest-card-header";

    const codigo = document.createElement("h3");
    codigo.textContent = limpiarTexto(nido.codigo_nido);

    const estado = document.createElement("span");
    estado.className = "nest-estado";
    estado.textContent = limpiarTexto(nido.estado_nido);

    header.append(codigo, estado);

    const totalHuevos = Number(nido.huevos_normales ?? 0) + Number(nido.huevos_vanos ?? 0);

    const detalles = [
        ["ID Actividad Playa", nido.id_actividad_playa],
        ["Vivero", nido.vivero],
        ["Hora de llegada", nido.hora_llegada],
        ["Huevos normales", nido.huevos_normales],
        ["Huevos vanos", nido.huevos_vanos],
        ["Total huevos", totalHuevos],
    ];

    const body = document.createElement("div");
    body.className = "nest-card-body";

    const fragment = document.createDocumentFragment();
    detalles.forEach(([etiqueta, valor]) => {
        fragment.appendChild(crearDatoNido(etiqueta, valor));
    });
    body.appendChild(fragment);

    card.append(header, body);
    return card;
}

function renderizarNidos(listaContenedor, nidos) {
    listaContenedor.replaceChildren();

    if (!Array.isArray(nidos) || nidos.length === 0) {
        const vacio = document.createElement("p");
        vacio.className = "nest-empty";
        vacio.textContent = "No hay nidos registrados para la selección actual.";
        listaContenedor.appendChild(vacio);
        return;
    }

    const fragment = document.createDocumentFragment();
    nidos.forEach((nido) => {
        fragment.appendChild(crearTarjetaNido(nido));
    });
    listaContenedor.appendChild(fragment);
}

async function obtenerActividadesPlaya() {
    const response = await fetch(URL_ACTIVIDADES_PLAYA, {
        method: "GET",
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        const textoError = await response.text();
        throw new Error(textoError || `Error al cargar actividades (HTTP ${response.status})`);
    }

    return response.json();
}

async function obtenerNidos(idActividadPlaya = "") {
    const url = idActividadPlaya
        ? `${URL_NIDOS}?idActividadPlaya=${encodeURIComponent(idActividadPlaya)}`
        : URL_NIDOS;

    const response = await fetch(url, {
        method: "GET",
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        const textoError = await response.text();
        throw new Error(textoError || `Error al cargar nidos (HTTP ${response.status})`);
    }

    return response.json();
}

async function inicializarInventarioNidos() {
    const contenedorPrincipal = document.getElementById("nests-inventory");
    if (!contenedorPrincipal) return;

    contenedorPrincipal.replaceChildren();

    const estadoCarga = document.createElement("p");
    estadoCarga.className = "nest-loading";
    estadoCarga.textContent = "Cargando inventario de nidos...";
    contenedorPrincipal.appendChild(estadoCarga);

    try {
        const [actividades, nidosIniciales] = await Promise.all([
            obtenerActividadesPlaya(),
            obtenerNidos(),
        ]);

        contenedorPrincipal.replaceChildren();

        const listaNidos = document.createElement("div");
        listaNidos.className = "nests-grid";

        const { barraFiltro } = crearFiltroActividades(actividades, async (idSeleccionado) => {
            listaNidos.replaceChildren();
            const cargandoFiltro = document.createElement("p");
            cargandoFiltro.className = "nest-loading";
            cargandoFiltro.textContent = "Filtrando nidos...";
            listaNidos.appendChild(cargandoFiltro);

            try {
                const filtrados = await obtenerNidos(idSeleccionado);
                // Respaldo en cliente si el backend ignora el query param y devuelve todos
                const nidosFinales = idSeleccionado
                    ? filtrados.filter((item) => String(item.id_actividad_playa) === String(idSeleccionado))
                    : filtrados;
                renderizarNidos(listaNidos, nidosFinales);
            } catch (err) {
                renderizarError(listaNidos, err.message);
            }
        });

        contenedorPrincipal.append(barraFiltro, listaNidos);
        renderizarNidos(listaNidos, nidosIniciales);
    } catch (error) {
        contenedorPrincipal.replaceChildren();
        renderizarError(contenedorPrincipal, error.message);
    }
}

function renderizarError(destino, mensaje) {
    destino.replaceChildren();
    const alerta = document.createElement("div");
    alerta.className = "nest-error";
    alerta.role = "alert";
    alerta.textContent = mensaje;
    destino.appendChild(alerta);
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inicializarInventarioNidos);
} else {
    inicializarInventarioNidos();
}