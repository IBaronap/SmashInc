//Convertions (promedio de duración de interacción, conteo de interacciones y de leads del día)

export function convertions(users, interactions){
    //Promedio de duración de interacción
    const sum = users.reduce((accumulator, user) => accumulator + user.interactionTime, 0);
    const average = sum / users.length;
    const averageSeconds = Math.round(average);

    const minutes = Math.floor(averageSeconds / 60);
    const seconds = Math.floor(averageSeconds % 60);

    const formattedAverage = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    //Fechas
    const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };

        //Hoy
        const currentDate = new Date().toLocaleDateString('es-ES', options).replace(/,/g, '');

        //Ayer
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayDate = yesterday.toLocaleDateString('es-ES', options).replace(/,/g, '');

    //Conteo de interacciones
        //Interactions hoy
        let todayInteractionsCount = 0;

        for (const interaction of interactions) {
            if (interaction.date === currentDate) {// Checkea si la fecha coincide
            todayInteractionsCount++;
            }
        }

        //Interactions ayer (para comparar)
        let yesterdayInteractionsCount = 0;

        for (const interaction of interactions) {
            if (interaction.date === yesterdayDate) {// Checkea si la fecha coincide
                yesterdayInteractionsCount++;
            }
        }

        //Comparación en porcentaje
        const interactions_difference = todayInteractionsCount - yesterdayInteractionsCount;
        const interactions_percentageDifference = ((interactions_difference / yesterdayInteractionsCount) * 100).toFixed(2);
        const interactions_sign = interactions_difference >= 0 ? '+' : '-';
        const interactions_formattedDifference = `${interactions_sign}${Math.abs(interactions_percentageDifference)}%`;

    //Conteo de leads
        //Leads hoy
        let todayLeadsCount = 0;
 
        for (const user of users) {
         if (user.date === currentDate) {// Checkea si la fecha coincide
            todayLeadsCount++;
         }
        }
 
        //Interactions yersterday (for comparision)
         let yesterdayLeadsCount = 0;
 
         for (const user of users) {
             if (user.date === yesterdayDate) {// Checkea si la fecha coincide
                yesterdayLeadsCount++;
             }
         }
 
         //Comparación en porcentaje
         const leads_difference = todayLeadsCount - yesterdayLeadsCount;
         const leads_percentageDifference = ((leads_difference / yesterdayLeadsCount) * 100).toFixed(2);
         const leads_sign = leads_difference >= 0 ? '+' : '-';
         const leads_formattedDifference = `${leads_sign}${Math.abs(leads_percentageDifference)}%`;

    //Datos
    let convertions = {Min_Average: `${formattedAverage}`, Interactions_Today: `${todayInteractionsCount}`, Interactions_Difference: `${interactions_formattedDifference}`, Leads_Today: `${todayLeadsCount}`, Leads_Difference: `${leads_formattedDifference}`}

    console.table(convertions);
    return convertions;
}


//Horas
export function getHourTraffic(interactions){
    let hours = {'00': 0, '01': 1, '02': 2, '03': 3, '04': 4, '05': 5, '06': 6, '07': 7, '08': 8, '09': 9, '10': 10, '11': 11, '12': 12, '13': 13, '14': 14, '15': 15, '16': 16, '17': 17, '18': 18, '19': 19, '20': 20, '21': 21, '22': 22, '23': 23,};
        
    const hourTraffic = Array.from({ length: 24 }, () => 0);

    interactions.forEach(visit => {
        const hour = visit.timeStamp.split(':')[0];
        hourTraffic[hours[hour]]++;
    });

    console.table(hourTraffic);
    return hourTraffic;
}


//Días
export function getInteractionsByDay(users){
        const weekdays = {
            'lun': 0,
            'mar': 1,
            'mié': 2,
            'jue': 3,
            'vie': 4,
            'sáb': 5,
            'dom': 6
        };
        const  dayCounts = Array.from({ length: 7 }, () => 0);
    
        users.forEach(visit => {
            const day = visit.date.split(' ')[0];
             dayCounts[weekdays[day]]++;
        });
        console.table(dayCounts);
        return  dayCounts;
}


//Users vs no users (por day)
export function nintendoUsers(users){
    const nintendoUsersByDay = {
        "lun": { nintendoUsers: 0, nonNintendoUsers: 0 },
        "mar": { nintendoUsers: 0, nonNintendoUsers: 0 },
        "mié": { nintendoUsers: 0, nonNintendoUsers: 0 },
        "jue": { nintendoUsers: 0, nonNintendoUsers: 0 },
        "vie": { nintendoUsers: 0, nonNintendoUsers: 0 },
        "sáb": { nintendoUsers: 0, nonNintendoUsers: 0 },
        "dom": { nintendoUsers: 0, nonNintendoUsers: 0 }
      };

      // Checkea el día
      for (const user of users) {
        const dayOfWeek = user.date.split(' ')[0].toLowerCase();
    
        // Checkea si es o no usuario de Nintendo y lo cuenta
        if (user.nintendoUser) {
          nintendoUsersByDay[dayOfWeek].nintendoUsers++;
        } else {
          nintendoUsersByDay[dayOfWeek].nonNintendoUsers++;
        }
      }

      console.table(nintendoUsersByDay);
      return nintendoUsersByDay;
}


//Leads vs no Leads

export function amountLeads(users, interactions){
    const amountLeads = users.length;
    const amountNoLeads = interactions.length - users.length;
    const totalAmount = interactions.length;
    
    let amount = {Total: `${totalAmount}`, Leads: `${amountLeads}`, NoLeads: `${amountNoLeads}`}

    console.table(amount);
    return amount;
}


//Ultimos leads (table)
export function getLastLeads(users){
    return users.slice(users.length - 10);
}
