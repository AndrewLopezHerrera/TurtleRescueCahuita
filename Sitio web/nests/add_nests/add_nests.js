document.addEventListener("DOMContentLoaded", async () => {
    let greeting = "";
    let srcImage = "";
    const date = new Date();
    const hour = date.getHours();
    const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
    if (hour >= 5 && hour < 12) {
        greeting = `Buenos días, ${userInfo['first_name']}`;
        srcImage = "../../sun_greeting.png";
    }
    else if (hour >= 12 && hour < 18) {
        greeting = `Buenas tardes, ${userInfo['first_name']}`;
        srcImage = "../../sunrise_greeting.png"
    }
    else {
        greeting = `Buenas noches, ${userInfo['first_name']}`;
        srcImage = "../../night_greeting.png";
    }
    document.getElementById("greeting").textContent = greeting;
    document.getElementById("image_greeting").src = srcImage;
})

const URL_ACTIVIDADES_PLAYA = "https://api.proyectosprototipos.online/api/activitybeach/getactitiesbeach";
const URL_CREAR_NIDO = "https://api.proyectosprototipos.online/api/neststurtle/addturtlenest";

const formNido = document.getElementById("form-agregar-nido");
const selectActividad = document.getElementById("in_id_beach_activity");
const inputHoraLlegada = document.getElementById("in_hatchery_arrival_time");
const btnGuardarNido = document.getElementById("btn-guardar-nido");
const mensajeNido = document.getElementById("mensaje-nido");

function limpiarTexto(valor) {
    return String(valor ?? "").replace(/\s+/g, " ").replace(/\s+,/g, ",").trim();
}

function mostrarFeedback(texto, tipo) {
    mensajeNido.textContent = texto;
    mensajeNido.className = `nest-feedback is-visible ${tipo === "error" ? "is-error" : "is-success"}`;
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

/**
 * Combina una fecha base (YYYY-MM-DD) con la hora elegida en <input type="time">
 * en formato ISO local sin 'Z' (YYYY-MM-DDTHH:mm:ss) para que el DateTime de .NET
 * conserve la hora exacta sin desplazamientos de zona horaria.
 */
function construirArrivalDateTimeParaDotNet(horaInputValue, fechaBaseIso = "2000-01-01") {
    if (!horaInputValue) {
        throw new Error("Debe indicar la hora de llegada.");
    }
    const horaNormalizada = horaInputValue.length === 5 ? `${horaInputValue}:00` : horaInputValue;
    return `${fechaBaseIso}T${horaNormalizada}`;
}

function setHoraInicial() {
    const ahora = new Date();
    const hh = String(ahora.getHours()).padStart(2, "0");
    const mm = String(ahora.getMinutes()).padStart(2, "0");
    const ss = String(ahora.getSeconds()).padStart(2, "0");
    inputHoraLlegada.value = `${hh}:${mm}:${ss}`;
}

async function cargarActividadesPlaya() {
    try {
        const response = await fetch(URL_ACTIVIDADES_PLAYA, {
            method: "GET",
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            const textoError = await response.text();
            throw new Error(textoError || `Error al cargar actividades (HTTP ${response.status})`);
        }

        const actividades = await response.json();
        selectActividad.replaceChildren();

        const opcionDefault = document.createElement("option");
        opcionDefault.value = "";
        opcionDefault.textContent = "Seleccione una actividad de playa...";
        selectActividad.appendChild(opcionDefault);

        const fragment = document.createDocumentFragment();
        actividades.forEach((act) => {
            const option = document.createElement("option");
            option.value = String(act.id);
            option.textContent = `#${act.id} · ${limpiarTexto(act.especie)} (${limpiarTexto(act.actividad_avistamiento)}) - ${limpiarTexto(act.fecha)}`;
            fragment.appendChild(option);
        });

        selectActividad.appendChild(fragment);
    } catch (error) {
        selectActividad.replaceChildren();
        const opcionError = document.createElement("option");
        opcionError.value = "";
        opcionError.textContent = "No se pudieron cargar las actividades";
        selectActividad.appendChild(opcionError);
        mostrarFeedback(error.message, "error");
    }
}

formNido.addEventListener("submit", async (event) => {
    event.preventDefault();

    try {
        const payload = {
            in_id_beach_activity: Number(selectActividad.value),
            in_vivarium_nest: Number(document.getElementById("in_vivarium_nest").value),
            in_hatchery_arrival_time: construirArrivalDateTimeParaDotNet(inputHoraLlegada.value),
            in_nest_code: document.getElementById("in_nest_code").value.trim(),
            in_normal_eggs: Number(document.getElementById("in_normal_eggs").value),
            in_yolkless_eggs: Number(document.getElementById("in_yolkless_eggs").value),
            in_id_state_nest: Number(document.getElementById("in_id_state_nest").value),
        };

        btnGuardarNido.disabled = true;
        btnGuardarNido.textContent = "Guardando...";

        const response = await fetch(URL_CREAR_NIDO, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const textoError = await response.text();
            throw new Error(textoError || `Error HTTP ${response.status}`);
        }

        mostrarFeedback("Nido registrado correctamente.", "success");
        formNido.reset();
        setHoraInicial();
    } catch (error) {
        mostrarFeedback(`No se pudo guardar el nido: ${error.message}`, "error");
    } finally {
        btnGuardarNido.disabled = false;
        btnGuardarNido.textContent = "Guardar nido";
    }
});

setHoraInicial();
cargarActividadesPlaya();