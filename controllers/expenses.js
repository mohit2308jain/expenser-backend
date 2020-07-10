const addExpense = (req, res, db, bcrypt) => {
    const { name, category, amount, expense_date, user_id } = req.body;

    if(!category || !name || !amount || !expense_date || !user_id){
        return res.status(400).json('Incorrect form submission.')
    }

    db('expenses')
    .insert({
        name: name,
        category: category,
        amount: amount,
        expense_date: expense_date,
        user_id: user_id
    })
    .returning(['id','name','category','amount','expense_date','user_id'])
    .then((expense) => {
        return res.json(expense);
    })
    .catch((err) => console.log(err));
}

const getExpenses = (req, res, db) => {
    const { id } = req.params;

    db.select('*').from('expenses').where({
        user_id: id
    })
    .orderBy('expense_date', 'desc')
    .then((expenses) => {
        if(expenses.length){
            res.json(expenses);
        }
        else{
            console.log('kk')
            res.status(404).json('No expenses found')
        }
    })
    .catch((Err) => res.status(404).json('No expenses found'));
}

const getExpense = (req, res, db) => {
    const { id } = req.params;

    db.select('*').from('expenses').where({
        id: id
    })
    .then((expense) => {
        if(expense.length){
            res.json(expense[0]);
        }
        else{
            res.status(404).json('No expense found')
        }
    })
    .catch((Err) => res.status(404).json('No expense found'));
}

const updateExpense = (req, res, db) => {
    const { id } = req.params;
    const { name, category, amount, expense_date, user_id } = req.body;

    db('expenses')
        .where('id', '=', id)
        .update({
            name: name,
            category: category,
            amount: amount,
            expense_date: expense_date,
            user_id: user_id
        })
        .returning(['id','name','category','amount','expense_date','user_id'])
        .then((expense) => {
            return res.json(expense);
        })
        .catch((err) => res.status(400).json('Unable to get entries'));
}

const deleteExpense = (req, res, db) => {
    const { id } = req.params;

    db('expenses')
    .where({ id: id })
    .del()
    .then((ress) => res.json(ress))
    .catch(err => res.status(400).json('Error in deleting'));
}

module.exports = {
    addExpense: addExpense,
    getExpenses: getExpenses,
    getExpense: getExpense,
    updateExpense: updateExpense,
    deleteExpense: deleteExpense
}