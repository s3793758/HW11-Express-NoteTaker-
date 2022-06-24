const path = require('path');
const router = require('express').Router();
const store = require('../db/db.json');
const { v4: uuidv4 } = require('uuid');

const {
  readFromFile,
  readAndAppend,
  writeToFile,
} = require('../helper/fsUtils.js');

router.get('/notes', (req, res) => {
  readFromFile(path.join(__dirname, '..', 'db', 'db.json'))
    .then((data) => res.send(JSON.parse(data)))
    .catch((err) => res.status(500).send(err));
}); //

router.post('/notes', async (req, res) => {
  try {
    const { title, text } = req.body;
    if (title && text) {
      const NewNote = {
        title,
        text,
        id: uuidv4(),
      };
      readAndAppend(NewNote, path.join(__dirname, '..', 'db', 'db.json'));
      res.status(201).send();
    }
  } catch (error) {
    console.log(error);
    res.status(400).send();
  }
});
router.delete('/notes/:id', (req, res) => {
  // log the delete request in the console
  // console.log(`\n••• ${moment().format('Do MMMM YYYY, h:mm:ss a')}\nReceived ${req.method} request to delete a note.`);

  const noteId = req.params.id; // grab the id out of the request body
  console.log(noteId);
  readFromFile('./db/db.json')
    .then((data) => JSON.parse(data))
    .then((json) => {
      const updatedNotes = json.filter(
        (selectedNote) => selectedNote.id !== noteId
      );
      writeToFile('./db/db.json', updatedNotes);
      res.json(`Note ID ${noteId} successfully deleted`);
    });
});

module.exports = router;
