import { fs } from "../dependencies.js";
import { io } from '../index.js';
import fireStoreDB from '../firebase-config.js';

export const postUserData = async (req, res) => {
  try {
    // Lee archivo Json
    const UserData = fs.readFileSync('./localCollection/users.json');
    const jsonUserData = JSON.parse(UserData);//String a código

    // Crea nuevo usuario
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

      // Añade a firebase
      fireStoreDB.addNewDocumentTo(newUser, 'Leads');
      console.log('Added to firebase');
      // Añade a Json
      jsonUserData.users.push(newUser);
      fs.writeFileSync('./localCollection/users.json', JSON.stringify(jsonUserData, null, 2));

    //Mensaje para hacer update
    io.emit('data-update', { state: true });

        // Respuesta que indica creación de usuario
    res.status(201).send({ msn: `User ${newUser.id} created` });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error adding user');
  }
}

export const postInteractionData = async (req, res) => {
  try {

    // Lee archivo Json
    const InteractionsData = fs.readFileSync('./localCollection/interactions.json');
    const jsonInteractionsData = JSON.parse(InteractionsData);

    //Crea nueva interacción
    const newInteraction = {
      id: jsonInteractionsData.interactions.length + 1,
      date: req.body.date,
      timeStamp: req.body.timeStamp
    };

    // Añade a firebase
    fireStoreDB.addNewDocumentTo(newInteraction, 'Interactions');
    // Añade a Json
    jsonInteractionsData.interactions.push(newInteraction);
    fs.writeFileSync('./localCollection/interactions.json', JSON.stringify(jsonInteractionsData, null, 2));

    //Mensaje para hacer update
    io.emit('data-update', { state: true });

    // Respuesta que indica creación de interacción
    res.status(201).send({ msn: `Interaction ${newUser.id} created` });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error adding user');
  }
}

export const getUsers = (req, res) => {
  res.send({ mns: 'Its a me' });
}