const { Pool, Client } = require('pg');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

//Connection setup, the PORT here is the port we used to connec to pgAdmin
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'boomtownTest',
  password: 'password',
  port: 5432
});

//Callback to let us know we are connected
pool.connect(() => {
  console.log('Connected');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//GET ALL Items
app.get('/items', (req, res) => {
  return pool
    .query('SELECT * FROM items')
    .then(response => {
      res.send(response.rows);
    })
    .catch(err => {
      res.send('error', err);
    });
});

//GET Items by their ID
app.get('/items/:id', (req, res) => {
  const itemid = req.params.id;
  const query = {
    text: 'SELECT * FROM items WHERE itemid = $1',
    values: [itemid]
  };
  return pool
    .query(query)
    .then(response => {
      if (!response) {
        return res.status(404).send('Item not found');
      }
      return res.send(response.rows[0]);
    })
    .catch(err => {
      res.status(400).send(err);
    });
});

//GET ALL users
app.get('/users', (req, res) => {
  return pool.query('SELECT * FROM users').then(response => {
    res.send(response.rows);
  });
});

//GET a user by their ID
app.get('/users/:id', (req, res) => {
  return pool
    .query('SELECT * FROM users WHERE userid = $1', [req.params.id])
    .then(response => {
      res.send(response.rows[0]);
    })
    .catch(err => {
      res.status(400).send(err);
    });
});

//GET all items owned by a User
app.get('/users-items/:id', (req, res) => {
  const query = {
    text: 'SELECT * FROM items WHERE ownerid = $1',
    values: [req.params.id]
  };
  return pool
    .query(query)
    .then(response => {
      res.send(response.rows);
    })
    .catch(err => {
      res.status(400).send(err);
    });
});
//GET All items borrowed by a user
app.get('/users-borrowed/:id', (req, res) => {
  const query = {
    text: 'SELECT * FROM items where borrowerid = $1',
    values: [req.params.id]
  };
  return pool
    .query(query)
    .then(response => {
      res.send(response.rows);
    })
    .catch(err => {
      res.status(400).send(err);
    });
});

//Create a new item and insert
app.post('/items', (req, res) => {
  const { title, imageurl, description, ownerid, borrowerid } = req.body;
  console.log('Body', req.body);
  const query = {
    text:
      'INSERT INTO items (title, imageurl, description, ownerid, borrowerid) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    values: [title, imageurl, description, ownerid, borrowerid]
  };
  return pool
    .query(query)
    .then(response => {
      res.send(response.rows[0]);
    })
    .catch(err => {
      res.status(400).send(err);
    });
});

//REQUEST to borrow and item
app.patch('/items', (req, res) => {
  const { borrowerid, itemid } = req.body;
  const query = {
    text: 'UPDATE items SET borrowerid=$1 WHERE itemid=$2 RETURNING *',
    values: [borrowerid, itemid]
  };
  return pool
    .query(query)
    .then(response => {
      res.send(response.rows[0]);
    })
    .catch(err => {
      res.status(400).send(err);
    });
});

//Setting up our Express server connection, this port is different since this is our server not PG database
app.listen(3000, () => {
  console.log('Live on 3000');
});
