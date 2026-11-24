document.addEventListener("DOMContentLoaded", async () => {
    let greeting = "";
    let srcImage = "";
    const date = new Date();
    const hour = date.getHours();
    const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
    agregarBotonFlotante(userInfo);
    loadCensus(sessionStorage.getItem("sessionId"));
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
        if (typeof goToAddCensus === "function") {
            goToAddCensus();
        }
    });

    document.body.appendChild(btn);
}

async function loadCensus(sessionId) {
    try {
        const result = await fetch("https://api.proyectosprototipos.online/api/activitybeach/getactitiesbeach", {
            method: "GET",
            "headers": {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessionId}`
            }
        })
        const data = await result.text();
        if (!result.ok)
            throw new Error("No se pudieron cargar los censos. Error " + result.status);
        const info = JSON.parse(data);
        renderizarCensos(info);
    }
    catch (e) {
        alert(e);
    }
}

function limpiarTexto(valor) {
    return String(valor ?? "").replace(/\s+/g, " ").replace(/\s+,/g, ",").trim();
}

function crearFilaDato(etiqueta, valor) {
    const fila = document.createElement("div");
    fila.className = "censo-dato";

    const labelEl = document.createElement("span");
    labelEl.className = "censo-etiqueta";
    labelEl.textContent = etiqueta;

    const valorEl = document.createElement("span");
    valorEl.className = "censo-valor";
    valorEl.textContent = limpiarTexto(valor);

    fila.appendChild(labelEl);
    fila.appendChild(valorEl);
    return fila;
}

function appendCensoItem(contenedor, item) {
    const card = document.createElement("article");
    card.className = "censo-card";
    card.dataset.id = item.id;

    const header = document.createElement("div");
    header.className = "censo-card-header";

    const titulo = document.createElement("h3");
    titulo.textContent = `Registro #${item.id} · ${limpiarTexto(item.especie)}`;

    const badge = document.createElement("span");
    badge.className = "censo-badge";
    badge.textContent = limpiarTexto(item.actividad_avistamiento);

    header.appendChild(titulo);
    header.appendChild(badge);
    card.appendChild(header);

    const campos = [
        ["Fecha", item.fecha],
        ["Hora", item.hora],
        ["Líder", item.lider],
        ["Actividad final", item.actividad_final],
        ["Comentarios", item.comentarios],
    ];

    campos.forEach(([etiqueta, valor]) => {
        card.appendChild(crearFilaDato(etiqueta, valor));
    });

    contenedor.appendChild(card);
}

function renderizarCensos(registros) {
    const contenedor = document.getElementById("census");
    contenedor.replaceChildren();

    const fragment = document.createDocumentFragment();
    const lista = Array.isArray(registros) ? registros : [registros];

    lista.forEach((item) => {
        const tempWrapper = document.createElement("div");
        appendCensoItem(tempWrapper, item);
        fragment.appendChild(tempWrapper.firstElementChild);
    });

    contenedor.appendChild(fragment);
}

function goToAddCensus() {
    window.location.href = "add_census/add_census.html"
}