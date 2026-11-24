document.addEventListener("DOMContentLoaded", async () => {
    await loadUserInformation();
    let greeting = "";
    let srcImage = "";
    const date = new Date();
    const hour = date.getHours();
    const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
    insertarBotonesDespuesDelPrimerHijo("main-menu", userInfo);
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

async function loadUserInformation() {
    try {
        const result = await fetch("https://api.proyectosprototipos.online/api/session/getUserInformation", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessionStorage.getItem("sessionId")}`
            }
        });
        const data = await result.text();
        if (!result.ok)
            throw new Error("No se pudo cargar el usuario");
        sessionStorage.setItem("userInfo", data);
    }
    catch (e) {
        console.log(e);
    }
}

function crearBotonNavegacion({ texto, srcImg, altImg, onClick }) {
    const btn = document.createElement("button");
    btn.type = "button";

    const img = document.createElement("img");
    img.src = srcImg;
    img.alt = altImg ?? texto;

    const span = document.createElement("span");
    span.textContent = texto;

    btn.append(img, span);

    if (typeof onClick === "function") {
        btn.addEventListener("click", onClick);
    }

    return btn;
}

function insertarBotonesDespuesDelPrimerHijo(selectorContenedor, userInfo) {
    if(userInfo.role_user !== "Admin" && userInfo.role_user !== "Researcher") return;
    const contenedor = document.getElementById(selectorContenedor);
    if (!contenedor) return;

    const primerHijo = contenedor.firstElementChild;
    if (!primerHijo) return;

    const btnCenso = crearBotonNavegacion({
        texto: "Censos",
        srcImg: "censo.png",
        altImg: "Censos",
        onClick: () => {
            if (typeof goToCensus === "function") {
                goToCensus();
            }
        },
    });

    const btnInventario = crearBotonNavegacion({
        texto: "Inventario de nidos",
        srcImg: "inventario.png",
        altImg: "Inventario de nidos",
        onClick: () => {
            if (typeof goToNests === "function")
                goToNests();
        }
    });

    // Se insertan en orden inverso con "afterend" para que queden:
    // [primerHijo] -> [btnCenso] -> [btnInventario] -> [resto de hijos...]
    primerHijo.insertAdjacentElement("afterend", btnInventario);
    primerHijo.insertAdjacentElement("afterend", btnCenso);
}

function goToCensus() {
    window.location.href = "../census/census.html";
}
function goToNests(){
    window.location.href = "../nests/nests.html";
}

function goToReports() {
    window.location.href = "../reports/report.html";
}

function goToProfile() {
    window.location.href = "../profile/profile.html";
}