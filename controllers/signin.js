const auth = require("./auth");

const JWT_SECRET = "mohit";

const handleSignin = (req, res, db, bcrypt, jwt) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json("Incorrect form submission.");
  }

  db.select("email", "hash")
    .from("login")
    .where("email", "=", email)
    .then((data) => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
      if (isValid) {
        return db
          .select("*")
          .from("users")
          .where("email", "=", email)
          .then((user) => {
            const token = jwt.sign({ id: user[0].id }, JWT_SECRET, {
              expiresIn: 3600,
            });
            if (!token) {
              throw Error("Couldnt sign the token");
            }
            console.log(token);
            res.json({ token, user: user[0] });
          })
          .catch((err) => res.status(400).json("Unable to get user"));
      } else {
        res.status(400).json("Wrong credentials");
      }
    })
    .catch((err) => res.status(400).json("Wrong credentials"));
};

const getBudget = (req, res, db) => {
  const { id } = req.params;

  db.select("budget")
    .from("users")
    .where("id", "=", id)
    .then((budget) => {
      res.json(budget[0]);
    })
    .catch((err) => res.status(400).json("Not available"));
};

const updateBudget = (req, res, db) => {
  const { id, budget } = req.body;
  console.log(id, budget)
  db("users")
    .where("id", "=", id)
    .update({
      budget: budget,
    })
    .returning("budget")
    .then((budget) => {
      if (budget.length) {
        res.json(budget[0]);
      } else {
        res.status(404).json("User Not Found");
      }
    })
    .catch((err) => res.status(400).json("Unable to get entries"));
};

module.exports = {
  handleSignin: handleSignin,
  updateBudget: updateBudget,
  getBudget: getBudget,
};
