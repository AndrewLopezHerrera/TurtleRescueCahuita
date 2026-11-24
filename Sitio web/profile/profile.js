document.addEventListener("DOMContentLoaded", async () => {
    let greeting = "";
    let srcImage = "";
    const date = new Date();
    const hour = date.getHours();
    const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
    loadInformationUser(userInfo);
    if(hour >= 5 && hour < 12){
        greeting = `Buenos días, ${userInfo['first_name']}`;
        srcImage = "../sun_greeting.png";
    }
    else if(hour >= 12 && hour < 18){
        greeting = `Buenas tardes, ${userInfo['first_name']}`;
        srcImage = "../sunrise_greeting.png"
    }
    else{
        greeting = `Buenas noches, ${userInfo['first_name']}`;
        srcImage = "../night_greeting.png";
    }
    document.getElementById("greeting").textContent = greeting;
    document.getElementById("image_greeting").src = srcImage;
})

function loadInformationUser(userInfo){
    document.getElementById("id_user").textContent = userInfo.id;
    document.getElementById("user_name").textContent = userInfo.user_name;
    document.getElementById("rol_user").textContent = userInfo.role_user;
    document.getElementById("first_name").textContent = userInfo.first_name;
    document.getElementById("second_name").textContent = userInfo.second_name || "";
    document.getElementById("first_last_name").textContent = userInfo.first_last_name;
    document.getElementById("second_last_name").textContent = userInfo.second_last_name || "";
}