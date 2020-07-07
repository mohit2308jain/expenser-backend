const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const expense = require('./controllers/expenses');
const profile = require('./controllers/profile');

const db = knex({
    client: 'pg',
    connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: true
    }
});

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Working');
})

app.post('/signin', (req, res) => {
    signin.handleSignin(req, res, db, bcrypt);
})

app.post('/register', (req, res) => {
    register.handleRegister(req, res, db, bcrypt);
});

app.put('/budget', (req, res) => {
    signin.updateBudget(req, res, db);
})

app.get('/expense/:id', (req, res) => {
    expense.getExpense(req, res, db);
})

app.put('/expense/:id', (req, res) => {
    expense.updateExpense(req, res, db);
})

app.delete('/expense/:id', (req, res) => {
    expense.deleteExpense(req, res, db);
})

app.post('/expense', (req, res) => {
    expense.addExpense(req, res, db);
})

app.get('/expenses/:id', (req,res) => {
    expense.getExpenses(req, res, db);
})

app.get('/profile/:id', (req, res) => {
    profile.getProfile(req, res, db);
})


app.listen(process.env.PORT || 3000, () => {
    console.log(`App running on port ${process.env.PORT}`);
})