const { Pool, Client } = require('pg');
const express = require('express');
const app = express();

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'boomtownTest',
  password: 'password',
  port: 5432
});

pool.connect(() => {
  console.log('Connected');
});

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

app.get('/users', (req, res) => {
  return pool.query('SELECT * FROM users').then(response => {
    res.send(response.rows);
  });
});

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

//Get User owned items
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
//GET user borrowed items
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

app.post('/items', (req, res) => {
  return pool.query('INSERT INTO items');
});

app.listen(3000, () => {
  console.log('Live on 3000');
});
