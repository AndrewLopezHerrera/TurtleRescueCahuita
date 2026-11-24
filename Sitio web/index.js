async function login() {
    try{
        const user_name = document.getElementById("nombre_usuario").value;
        const password = document.getElementById("contrasena").value;
        const result = await fetch("https://api.proyectosprototipos.online/api/session/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({user_name, password})
        });
        const id = await result.text();
        if(!result.ok){
            const error = JSON.parse(id);
            document.getElementById("login_error").textContent = error.error;
            return;
        }
        sessionStorage.setItem("sessionId", id);
        window.location.replace("main_menu/main_menu.html");
    }
    catch(e){
        document.getElementById("login_error").textContent = `Error de red o CORS`;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    let greeting = "";
    let srcImage = "";
    const date = new Date();
    const hour = date.getHours();
    if(hour >= 5 && hour < 12){
        greeting = "Buenos días";
        srcImage = "sun_greeting.png";
    }
    else if(hour >= 12 && hour < 18){
        greeting = "Buenas tardes";
        srcImage = "sunrise_greeting.png"
    }
    else{
        greeting = "Buenas noches";
        srcImage = "night_greeting.png";
    }
    document.getElementById("greeting").textContent = greeting;
    document.getElementById("image_greeting").src = srcImage;
})