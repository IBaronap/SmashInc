import { fs } from "../dependencies.js";
import { io } from '../index.js';
import fireStoreDB from '../firebase-config.js';

export const postUserData = (req, res) => {
  try {
    // read existing data from users.json file
    const UserData = fs.readFileSync('./localCollection/users.json');
    const jsonUserData = JSON.parse(UserData);

    // read existing data from interactions.json file
    const InteractionsData = fs.readFileSync('./localCollection/interactions.json');
    const jsonInteractionsData = JSON.parse(InteractionsData);

    // create new user (only if it has user info)
    if (req.body.name) {
      const newUser = {
        id: jsonUserData.users.length + 1,
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        privacyAgreement: req.body.privacyAgreement,
        nintendoUser: req.body.nintendoUser,
        interactionTime: req.body.interactionTime,
        lead: req.body.lead,
        date: req.body.date,
        timeStamp: req.body.timeStamp
      };

      // add new user to existing data (json)
      jsonUserData.users.push(newUser);
      fs.writeFileSync('./localCollection/users.json', JSON.stringify(jsonUserData, null, 2));
      // add new user to existing data (firebase)
      fireStoreDB.addNewDocumentTo(jsonUser, 'Leads');
    }

    //create new interaction
    const newInteraction = {
      id: jsonInteractionsData.interactions.length + 1,
      date: req.body.date,
      timeStamp: req.body.timeStamp
    };

    // add new interaction to existing data (json)
    jsonInteractionsData.interactions.push(newInteraction);
    fs.writeFileSync('./localCollection/interactions.json', JSON.stringify(jsonInteractionsData, null, 2));
    // add new interaction to existing data (firebase)
    fireStoreDB.addNewDocumentTo(jsonUser, 'Interactions');

    //Message to update
    io.emit('data-update', { state: true });

    // send response indicating successful creation of new user
    res.status(201).send({ msn: `User ${newUser.id} created` });
  } catch (error) {
    // handle any errors that occur
    console.error(error);
    res.status(500).send('Error adding user');
  }
}

export const getUsers = (req, res) => {
  res.send({ mns: 'Its a me' });
}