const express = require('express');
const bodyParser = require('body-parser');
const db = require('./database');
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  db.all('SELECT * FROM breakdowns', (err, rows) => {
    res.render('index', { breakdowns: rows });
  });
});

app.get('/report', (req, res) => {
  res.render('report');
});

app.post('/report', (req, res) => {
  const { machine_no, issue, start_time } = req.body;
  db.run(`INSERT INTO breakdowns (machine_no, issue, start_time) VALUES (?, ?, ?)`,
    [machine_no, issue, start_time], () => {
      res.redirect('/');
    });
});

app.post('/close/:id', (req, res) => {
  const { end_time, corrective_action } = req.body;
  db.run(`UPDATE breakdowns SET end_time = ?, corrective_action = ? WHERE id = ?`,
    [end_time, corrective_action, req.params.id], () => {
      res.redirect('/');
    });
});

app.listen(3000, () => console.log('Server running on port 3000'));
