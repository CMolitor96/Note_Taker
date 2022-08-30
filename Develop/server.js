const express = require('express');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');



const PORT = 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));


app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('/api/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/db/db.json'))
);


app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

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

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);