const URL = `${window.location.hostname}:${window.location.port}`;
const socket = io(URL, { path: '/real-time' });
let leads = document.getElementById('leads-table');
let average = document.getElementById('Min-Average');
let interactionsToday = document.getElementById('Interactions_Today');
let leadsToday = document.getElementById('Leads_Today');

//Graphics
function controller(view) {

    let dashboardLocalData;

   ( async function detDashboard () {
        const request = await fetch ('http://localhost:5050/dashboard');
        const data = await request.json();
        dashboardLocalData = data;

        const {convertions, hourTraffic, dayCounts, nintendoUsersByDay, LeadsVSNo, lastLeads} = dashboardLocalData;

        view.updateMinAverage(convertions);
        view.updateInteractionsToday(convertions);
        view.updateLeadsToday(convertions);

        view.updateLineChart(hourTraffic);
        view.updateBarChart(dayCounts);
        view.updateStackedChart(nintendoUsersByDay);
        view.updateDoughnut(LeadsVSNo);
        
        view.updateTable(lastLeads);

    }) (); // funcion autodeclarada , es más segura, a penas se termina de escribir se autodeclara

    socket.on('data-update', (data) => {
        console.log(data);
        updateRealTime();
    });

    const updateRealTime = async () => {
        const request = await fetch ('http://localhost:5050/dashboard');
        const data = await request.json();
        dashboardLocalData = data;

        const {convertions, hourTraffic, dayCounts, LeadsVSNo, lastLeads} = dashboardLocalData;

        leads.innerHTML = ` `;
        average.innerHTML = ` `;
        interactionsToday.innerHTML = ` `;
        leadsToday.innerHTML = ` `;

        view.updateMinAverage(convertions);
        view.updateInteractionsToday(convertions);
        view.updateLeadsToday(convertions);

        view.updateLineChart(hourTraffic);
        view.updateBarChart(dayCounts);
        view.updateStackedChart( dayCounts);
        view.updateDoughnut(LeadsVSNo);

        view.updateTable(lastLeads);

        console.log('Data updated');
    }

    view.render();
}

let view = new View();
controller(view, socket);

//Change screen
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