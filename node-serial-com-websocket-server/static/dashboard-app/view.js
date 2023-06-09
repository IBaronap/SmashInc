class View {
    static lineItem = document.querySelector('#myLineChart');
    static barItem = document.querySelector('#myBarChart');  
    static stackedItem = document.querySelector('#myStackedChart');
    static doughnutItem = document.querySelector('#myDoughnutChart');
    static leads = document.getElementById('leads-table');
    static average = document.getElementById('Min-Average');
    static interactionsToday = document.getElementById('Interactions_Today');
    static leadsToday = document.getElementById('Leads_Today');

    constructor() {
        this.LineChart
        this.BarChart;
        this.StackedChart;
        this.doughnutChart;
    }

    //Charts
    getLineChart() {
        const labels = ['00', '', '02', '', '04', '', '06', '', '08', '', '10', '', '12', '', '14', '', '16', '', '18', '', '20', '', '22', ''];
        const data = {
            labels: labels,
            datasets: [{
                label: 'Tráfico por hora (8:00 a 22:00)',
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                fill: false,
                borderColor: '#E10005',
                tension: 0.1
            }]
        };
        const config = {
            type: 'line',
            data: data,
        };
        this.LineChart = new Chart(View.lineItem, config);
    }

    getBarChart() {
        const config = { 
            type: 'bar',
            data: {
                labels: ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'],
                datasets: [{
                    label: 'Leads (Códigos enviados)',
                    data: [0, 0, 0, 0, 0, 0, 0],
                    backgroundColor: ['#0E6AE3'],
                    hoverOffset: 4,
                    borderWidth: 2,
                    borderRadius: 10
                }]
            },
            options: { 
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        }
        this.BarChart = new Chart(View.barItem, config);
    }

    getStackedChart() {
        const config = { 
            type: 'bar',
            data: {
                labels: ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'],
                datasets: [{
                    label: 'Es usuario de Nintendo',
                    data: [0, 0, 0, 0, 0, 0, 0],
                    backgroundColor: '#0E6AE3',
                    borderRadius: 10
                  },
                  {
                    label: 'No es usuario de Nintendo',
                    data: [0, 0, 0, 0, 0, 0, 0],
                    backgroundColor: '#E10005',
                    borderRadius: 10
                  }]
            },
            options: {
                responsive: true,
                scales: {
                  x: {
                    stacked: true,
                  },
                  y: {
                    stacked: true
                  }
                }
              }
        }
        this.StackedChart = new Chart(View.stackedItem, config);
    }

    getmyDoughnutChart() {
        const data = {
            labels: [
                'Leads',
                'No son leads'
            ],
            datasets: [{
                label: 'Usuarios esta semana',
                data: [0, 0],
                backgroundColor: [
                    '#0E6AE3',
                    '#E10005'
                ],
                hoverOffset: 4,
                borderRadius: 10
            }]
        };
        const config = {
            type: 'doughnut',
            data: data,
        };
        this.doughnutChart = new Chart(View.doughnutItem, config);
    }

    //Datos
    updateMinAverage(convertions){
        console.table(convertions);

        let min_average = document.createElement('h1');
        min_average.innerHTML = `${convertions.Min_Average}`;
    
        View.average.appendChild(min_average);
    }

    updateInteractionsToday(convertions){

        let interactions_Today = document.createElement('div');
        interactions_Today.classList.add('SectionSection');
        
        if(convertions.Interactions_Difference == "+NaN%" || convertions.Interactions_Difference == "+Infinity%" ){
            interactions_Today.innerHTML = `
            <h1 class="SectionValue">${convertions.Interactions_Today}</h1>`;
        }else{
            interactions_Today.innerHTML = `
            <h1 class="SectionValue">${convertions.Interactions_Today}</h1>
            <div class="SectionSide">
            <h5 class="SideValue">${convertions.Interactions_Difference}</h5>
            <h6 class="SideValue">Desde ayer</h6>
            </div>`;
        }
    
        View.interactionsToday.appendChild(interactions_Today);
    }

    updateLeadsToday(convertions){

        let leads_Today = document.createElement('div');
        leads_Today.classList.add('SectionSection');

        if(convertions.Leads_Difference == "+NaN%" || convertions.Leads_Difference == "+Infinity%" ){
            leads_Today.innerHTML = `
            <h1 class="SectionValue">${convertions.Leads_Today}</h1>`;
        }else{
            leads_Today.innerHTML = `
            <h1 class="SectionValue">${convertions.Leads_Today}</h1>
            <div class="SectionSide">
            <h5 class="SideValue">${convertions.Leads_Difference}</h5>
            <h6 class="SideValue">Desde ayer</h6>
            </div>`;
        }
    
        View.leadsToday.appendChild(leads_Today);
    }

    //Charts

    updateLineChart(hourTraffic){
        console.table(hourTraffic);

        this.LineChart;

        this.LineChart.data.datasets[0].data =  hourTraffic;

        this.LineChart.update();
    };

    updateBarChart(dayCounts){
        console.table(dayCounts);
        
        this.BarChart;

        this.BarChart.data.datasets[0].data =  dayCounts;

        this.BarChart.update();
    }

    updateStackedChart(nintendoUsersByDay){
        console.table(nintendoUsersByDay);

        this.StackedChart;

        const labels = Object.keys(nintendoUsersByDay);
  
        for (let i = 0; i < labels.length; i++) {
            const dayOfWeek = labels[i];
            const data = nintendoUsersByDay[dayOfWeek];
            
            this.StackedChart.data.datasets[0].data[i] = data.nintendoUsers;
            this.StackedChart.data.datasets[1].data[i] = data.nonNintendoUsers;
        }

        this.StackedChart.update();
    }

    updateDoughnut(LeadsVSNo){
        console.table(LeadsVSNo);

        this.doughnutChart;

        this.doughnutChart.data.datasets[0].data[0] = LeadsVSNo.Leads;
        this.doughnutChart.data.datasets[0].data[1] = LeadsVSNo.NoLeads;

        this.doughnutChart.update();
    };

    //Leads table
    updateTable(newLeads){
        console.table(newLeads);

        let reversedLeads = newLeads.slice().reverse();

        newLeads.forEach((element, index) => {
            let row = document.createElement('tr');
            row.innerHTML = `
                <td class="NameTD">${reversedLeads[index].name}</td>
                <td class="EmailTD">${reversedLeads[index].email}</td>
                <td class="PhoneTD">${reversedLeads[index].phone}</td>
                <td class="DateTD">${reversedLeads[index].date}</td>
                <td class="HourTD">${reversedLeads[index].timeStamp}</td>
                <td class="DurationTD">${Math.floor(reversedLeads[index].interactionTime / 60)}:${reversedLeads[index].interactionTime % 60} min</td>
                <td class="NewTD">${reversedLeads[index].nintendoUser ? 'Sí' : 'No'}</td>
            `;
    
            View.leads.appendChild(row);
        });
    }

    //Render
    render() {
        this.getLineChart();
        this.getBarChart();
        this.getStackedChart();
        this.getmyDoughnutChart();
    }
}