import { fs } from "../dependencies.js";
import * as KPI from "./kpicalculations.js";

export const getData = (req, res) => {
    try {
        //Jsons
        const usersJSONData = fs.readFileSync ('./localCollection/users.json')
        const interactionsJSONData = fs.readFileSync ('./localCollection/interactions.json')

        const {users} =JSON.parse(usersJSONData);
        const {interactions} =JSON.parse(interactionsJSONData)

        //Send data
        const convertions = KPI.convertions(users, interactions);
        const hourTraffic = KPI.getHourTraffic(interactions);
        const dayCounts = KPI.getInteractionsByDay(users);
        const nintendoUsersByDay = KPI.nintendoUsers(users);
        const LeadsVSNo = KPI.amountLeads(users, interactions);
        const lastLeads = KPI.getLastLeads(users);

        let dashboarddata = {users, interactions, convertions, hourTraffic, dayCounts, nintendoUsersByDay, LeadsVSNo, lastLeads};

        res.status(201).send(dashboarddata);
    }  catch (error) {
        console.error(error);
        res.status(500).send('Error adding user');
    }
}