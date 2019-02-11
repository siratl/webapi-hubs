const express = require('express');

const db = require('./data/db.js');

const server = express(); // creates a new http server

// Middleware
server.use(express.json());

// Routes === Endpoints
server.get('/', (req, res) => {
  res.send('<h2>Hello World</h2>');
});

// write an endpoint that handles GET requests to /now and returns a string with the current date and time
server.get('/now', (req, res) => {
  const time = new Date().toISOString();
  res.send(time);
});

// The C in CRUD

server.post('/hubs', (req, res) => {
  const hub = req.body;
  // axios.post(url, data === body)
  db.hubs
    .add(hub)
    .then(hub => {
      res.status(201).json({ success: true, hub });
    })
    .catch(({ code, message }) => {
      res.status(code).json({ success: false, message });
    });
});

// The R in CRUD
server.get('/hubs', (req, res) => {
  db.hubs
    .find()
    .then(hubs => {
      res.status(200).json({ success: true, hubs }); // sets the Content-Type header
    })
    .catch(err => {
      res.status(err.code).json({ success: false, message: err.message });
    });
});

// The U in CRUD
server.put('/hubs/:id', (req, res) => {
  const { id } = req.params;
  const changes = req.body;

  db.hubs
    .update(id, changes)
    .then(updated => {
      if (updated) {
        res, status(200).json({ success: true, updated });
      } else {
        res.status(404).json({
          success: false,
          message: 'I cannot find the hub you are looking for',
        });
      }
    })
    .catch(({ code, message }) => {
      res.status(code).json({ success: false, message });
    });
});

// The D in CRUD
server.delete('/hubs/:id', (req, res) => {
  const hubId = req.params.id;
  // for a route defined as /hubs/:id/messages/:messageId
  // making a request to /hubs/123/messages/234
  // will make req.params be: { id: 123 , messageId: 234}
  db.hubs
    .remove(hubId)
    .then(deleted => {
      res.status(204).end();
    })
    .catch(({ code, message }) => {
      res.status(code).json({ success: false, message });
    });
});

server.listen(4000, () => {
  console.log('\n*** Running on Port 4000 ***\n');
});
