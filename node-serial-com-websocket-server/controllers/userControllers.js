import { fs } from "../dependencies.js";
import { io } from '../index.js';

export const postUserData = (req, res) => {
  try {
    // read existing data from users.json file
    const UserData = fs.readFileSync('./localCollection/users.json');
    const InteractionsData = fs.readFileSync('./localCollection/interactions.json');

    const jsonUserData = JSON.parse(UserData);
    const jsonInteractionsData = JSON.parse(InteractionsData);

    //create new interaction
    const newInteraction = {
      id: jsonInteractionsData.interactions.length + 1,   // generate new user ID
      date: req.body.date,
      timeStamp: req.body.timeStamp
    };

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

      jsonUserData.users.push(newUser);
    }


    // add new user to existing data
    jsonInteractionsData.interactions.push(newInteraction);

    // write updated data back to users.json file
    fs.writeFileSync('./localCollection/users.json', JSON.stringify(jsonUserData, null, 2));
    fs.writeFileSync('./localCollection/interactions.json', JSON.stringify(jsonInteractionsData, null, 2));

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