document.addEventListener("DOMContentLoaded", async () => {
    let greeting = "";
    let srcImage = "";
    const date = new Date();
    const hour = date.getHours();
    const sessionId = sessionStorage.getItem("sessionId");
    const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
    getGeneralStatusNest(sessionId);
    getNestStatusByVivarium(sessionId);
    getAmountNestBySpecie(sessionId);
    getAverageEggsBySpecie(sessionId);
    getAmountEggsBySpecie(sessionId);
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

//Obtener estado general de los nidos
async function getGeneralStatusNest(sessionId) {
    try {
        const result = await fetch("https://api.proyectosprototipos.online/api/reports/getstatusnestbyvivarium", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessionStorage.getItem("sessionId")}`
            }
        })
        const data = await result.text();
        if (!result.ok)
            throw new Error("No se pudo cargar el gráfico del estado general. Error " + result.status);
        const rawData = JSON.parse(data);
        const labels = [...new Set(rawData.map((d) => d.vivero))];
        const estados = [...new Set(rawData.map((d) => d.estado))];
        const paleta = {
            Eclosionado: "#2E7D32",
            Incubando: "#0D2B43",
            Saqueado: "#D12028",
        };
        const datasets = estados.map((estado, idx) => ({
            label: estado,
            data: labels.map((vivero) => {
                const match = rawData.find((d) => d.vivero === vivero && d.estado === estado);
                return match ? match.cantidad : 0;
            }),
            backgroundColor: paleta[estado] ?? `hsl(${idx * 65}, 60%, 45%)`,
            borderRadius: 6,
        }));
        const ctx = document.getElementById("generalStatusNest");
        new Chart(ctx, {
            type: "bar",
            data: {
                labels,
                datasets,
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: "top",
                    },
                    tooltip: {
                        mode: "index",
                        intersect: false,
                    },
                },
                scales: {
                    x: {
                        stacked: true,
                    },
                    y: {
                        stacked: true,
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1,
                        },
                    },
                },
            },
        });
    }
    catch (e) {
        alert(e);
    }
}

//Obtener estado de los nidos por vivero
async function getNestStatusByVivarium(sessionId) {
    try {
        const result = await fetch("https://api.proyectosprototipos.online/api/reports/getgeneralstatusnest", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessionStorage.getItem("sessionId")}`
            }
        })
        const data = await result.text();
        if (!result.ok)
            throw new Error("No se pudo cargar el gráfico del estado de los nidos por vivero. Error " + result.status);
        const rawData = JSON.parse(data);

        const labels = rawData.map((d) => d.estado);
        const valores = rawData.map((d) => d.cantidad);

        const paleta = {
            Eclosionado: "#2E7D32",
            Incubando: "#0D2B43",
            Saqueado: "#D12028",
        };

        const colores = labels.map((estado, idx) => paleta[estado] ?? `hsl(${idx * 65}, 60%, 45%)`);
        const ctx = document.getElementById("nestStatusByVivarium");
        new Chart(ctx, {
            type: "doughnut",
            data: {
                labels,
                datasets: [
                    {
                        label: "Cantidad",
                        data: valores,
                        backgroundColor: colores,
                        borderWidth: 2,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: "bottom",
                    },
                    tooltip: {
                        callbacks: {
                            label(context) {
                                const total = context.dataset.data.reduce((acc, n) => acc + n, 0);
                                const value = context.parsed;
                                const pct = total ? ((value / total) * 100).toFixed(1) : 0;
                                return ` ${context.label}: ${value} (${pct}%)`;
                            },
                        },
                    },
                },
            },
        });
    }
    catch (e) {
        alert(e);
    }
}

//Obtener cantidad de nidos encontrado por especie
async function getAmountNestBySpecie(sessionId) {
    try {
        const result = await fetch("https://api.proyectosprototipos.online/api/reports/getreportamountEncountersbyspecies", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessionStorage.getItem("sessionId")}`
            }
        })
        const data = await result.text();
        console.log(data);
        if (!result.ok)
            throw new Error("No se pudo cargar reporte de la cantidad de nidos encontrados. Error " + result.status);
        const rawData = JSON.parse(data);

        const labels = rawData.map((d) => d.especie);
        const valores = rawData.map((d) => d.total);

        const paleta = {
            Verde: "#2E7D32",
            Baula: "#0D2B43",
            Carey: "#eaff00",
        };

        const colores = labels.map((especie, idx) => paleta[especie] ?? `hsl(${idx * 65}, 60%, 45%)`);
        const ctx = document.getElementById("amountNestBySpecie");
        new Chart(ctx, {
            type: "bar",
            data: {
                labels,
                datasets: [
                    {
                        label: "Total",
                        data: valores,
                        backgroundColor: colores,
                        borderRadius: 6,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false,
                    },
                    tooltip: {
                        callbacks: {
                            label(context) {
                                return ` Total: ${context.parsed.y}`;
                            },
                        },
                    },
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1,
                        },
                    },
                },
            },
        });
    }
    catch (e) {
        alert(e);
    }
}

//Obtener cantidad promedio de huevos encontrados por especie
async function getAverageEggsBySpecie(sessionId) {
    try {
        const result = await fetch("https://api.proyectosprototipos.online/api/reports/getreportaverageencountersbyspecies", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessionStorage.getItem("sessionId")}`
            }
        })
        const data = await result.text();
        console.log(data);
        if (!result.ok)
            throw new Error("No se pudo cargar reporte del promedio de nidos encontrados. Error " + result.status);
        const rawData = JSON.parse(data);

        const labels = rawData.map((d) => d.especie);

        const datasets = [
            {
                label: "Huevos normales",
                data: rawData.map((d) => d.huevos_normales),
                backgroundColor: "#0D2B43",
                borderRadius: 6,
            },
            {
                label: "Huevos vanos",
                data: rawData.map((d) => d.huevos_vanos),
                backgroundColor: "#D12028",
                borderRadius: 6,
            },
        ];
        const ctx = document.getElementById("averageEggsBySpecie");
        new Chart(ctx, {
            type: "bar",
            data: {
                labels,
                datasets,
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: "top",
                    },
                    tooltip: {
                        mode: "index",
                        intersect: false,
                        callbacks: {
                            afterBody(items) {
                                const index = items[0].dataIndex;
                                const totalBackend = rawData[index]?.total;
                                const totalCalculado = items.reduce((sum, item) => sum + item.parsed.y, 0);
                                const totalFinal = totalBackend ?? totalCalculado;
                                return [`Total de la especie: ${totalFinal}`];
                            },
                        },
                    },
                },
                scales: {
                    x: {
                        stacked: true,
                    },
                    y: {
                        stacked: true,
                        beginAtZero: true,
                    },
                },
            },
        });
    }
    catch (e) {
        alert(e);
    }
}

//Obtener cantidad de huevos encontrados por especie
async function getAmountEggsBySpecie(params) {
    try {
        const result = await fetch("https://api.proyectosprototipos.online/api/reports/getreporttotalencountersbyspecies", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessionStorage.getItem("sessionId")}`
            }
        })
        const data = await result.text();
        console.log(data);
        if (!result.ok)
            throw new Error("No se pudo cargar reporte de la cantidad de huevos encontrados. Error " + result.status);
        const rawData = JSON.parse(data);

        const labels = rawData.map((d) => d.especie);

        const datasets = [
            {
                label: "Huevos normales",
                data: rawData.map((d) => d.huevos_normales),
                backgroundColor: "#0D2B43",
                borderRadius: 6,
            },
            {
                label: "Huevos vanos",
                data: rawData.map((d) => d.huevos_vanos),
                backgroundColor: "#D12028",
                borderRadius: 6,
            },
        ];
        const ctx = document.getElementById("amountEggsBySpecie");
        new Chart(ctx, {
            type: "bar",
            data: {
                labels,
                datasets,
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: "top",
                    },
                    tooltip: {
                        mode: "index",
                        intersect: false,
                        callbacks: {
                            afterBody(items) {
                                const index = items[0].dataIndex;
                                const totalBackend = rawData[index]?.total;
                                const totalCalculado = items.reduce((sum, item) => sum + item.parsed.y, 0);
                                const totalFinal = totalBackend ?? totalCalculado;
                                return [`Total de la especie: ${totalFinal}`];
                            },
                        },
                    },
                },
                scales: {
                    x: {
                        stacked: true,
                    },
                    y: {
                        stacked: true,
                        beginAtZero: true,
                    },
                },
            },
        });
    }
    catch (e) {
        alert(e);
    }
}
