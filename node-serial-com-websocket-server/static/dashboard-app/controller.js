//General
const URL = `${window.location.hostname}:${window.location.port}`;
const socket = io(URL, { path: '/real-time' });

//Espacios donde se pinta información
let leads = document.getElementById('leads-table');
let average = document.getElementById('Min-Average');
let interactionsToday = document.getElementById('Interactions_Today');
let leadsToday = document.getElementById('Leads_Today');

//Gráficos
function controller(view) {

    let dashboardLocalData;

   ( async function detDashboard () {
        const request = await fetch ('http://localhost:5050/dashboard');
        const data = await request.json();
        dashboardLocalData = data;

        const {convertions, hourTraffic, dayCounts, nintendoUsersByDay, LeadsVSNo, lastLeads} = dashboardLocalData;

        view.updateMinAverage(convertions); //Datos que no están en gráficos
        view.updateInteractionsToday(convertions);
        view.updateLeadsToday(convertions);

        view.updateLineChart(hourTraffic);//Gráficos
        view.updateBarChart(dayCounts);
        view.updateStackedChart(nintendoUsersByDay);
        view.updateDoughnut(LeadsVSNo);
        
        view.updateTable(lastLeads);//Tabla

    }) (); // funcion autodeclarada 

    socket.on('data-update', (data) => {//Recibe mensaje de update
        console.log(data);
        updateRealTime();
    });

    const updateRealTime = async () => {//Actualiza los datos
        const request = await fetch ('http://localhost:5050/dashboard');
        const data = await request.json();
        dashboardLocalData = data;

        const {convertions, hourTraffic, dayCounts, LeadsVSNo, lastLeads} = dashboardLocalData;

        leads.innerHTML = ` `; //Borra los datos anteriores para pintar los nuevos (en los datos que no están en gráficos)
        average.innerHTML = ` `;
        interactionsToday.innerHTML = ` `;
        leadsToday.innerHTML = ` `;

        view.updateMinAverage(convertions); //Datos que no están en gráficos
        view.updateInteractionsToday(convertions);
        view.updateLeadsToday(convertions);

        view.updateLineChart(hourTraffic); //Gráficos
        view.updateBarChart(dayCounts);
        view.updateStackedChart( dayCounts);
        view.updateDoughnut(LeadsVSNo);

        view.updateTable(lastLeads); //Tabla

        console.log('Data updated');
    }

    view.render();
}

let view = new View();
controller(view, socket);

//Cambios de sección
let NavResumen = document.getElementById('NavResumen');
let NavLeads = document.getElementById('NavLeads');

let ResumenPage = document.getElementById('ResumenPage');
let LeadsPage = document.getElementById('LeadsPage');

function GoToResumen (){
    NavResumen.classList.remove('Unselected');
    NavResumen.classList.add('Selected');

    NavLeads.classList.remove('Selected');
    NavLeads.classList.add('Unselected');

    ResumenPage.style.display = 'block';
    LeadsPage.style.display = 'none';
}

function GoToLeads (){
    NavResumen.classList.remove('Selected');
    NavResumen.classList.add('Unselected');

    NavLeads.classList.remove('Unselected');
    NavLeads.classList.add('Selected');

    ResumenPage.style.display = 'none';
    LeadsPage.style.display = 'block';
}