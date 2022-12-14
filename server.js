const express = require('express');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');


const PORT = process.env.PORT || 3001;

const app = express();

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));


//Get request for note taking homepage
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

//Get request for viewing JSON file of all notes
app.get('/api/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/db/db.json'))
);


//Post request for adding a new note to JSON file
app.post('/api/notes', (req, res) => {
  const { title, text} = req.body;
  const newNote = {
    title,
    text,
    id: uuidv4(),
  }

  fs.readFile('./db/db.json', function (err, data) {
    var json = JSON.parse(data)
    json.push(newNote);
    fs.writeFile('./db/db.json', JSON.stringify(json), (err) => {
          if (err) {
            console.log(err);
          }
    })
  });
  res.json(newNote);
});


//Delete request for deleting notes and removing from JSON file
app.delete('/api/notes/:id', (req, res) => {
  const id = req.params.id;
  console.log(id);
  fs.readFile ('./db/db.json', function (err, data) {
    var json = JSON.parse(data);
    const results = json.filter((note) => {
      return note.id != id;
    })
    fs.writeFile ('./db/db.json', JSON.stringify(results), (err) => {
      if (err) {
        console.log(err);
      }
    })
    res.json(results);
  });
});


//Get request for directing to homepage
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);



app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);