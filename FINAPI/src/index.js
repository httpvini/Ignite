const express = require("express");
const { v4: uuidv4 } = require("uuid");
const app = express();

app.use(express.json());

const customers = [];

function verifyIfExistsAccountCPF(req, res, next) {
  const { cpf } = req.headers;
  const customer = findCustomer(cpf);

  if (!customer) {
    res.status(404).json({ error: "Customer not found!" });
  }

  req.customer = customer;

  return next();
}

app.post("/account", (req, res) => {
  const { cpf, name } = req.body;

  if (isThereACostumer(cpf)) {
    return res.status(400).json({ error: "Customer already exists!" });
  }

  saveCustomer(cpf, name);

  return res.status(201).send();
});

app.get("/statement", verifyIfExistsAccountCPF, (req, res) => {
  const { customer } = req;
  res.status(200).json(customer.statement);
});

app.post("/deposit", verifyIfExistsAccountCPF, (req, res) => {
  const { description, amount } = req.body;
  const { customer } = req;

  createStatementOperation(customer, description, amount, 'credit');

  return res.status(201).send();
});

app.post("/withdraw", verifyIfExistsAccountCPF, (req, res) => {
  const { amount } = req.body;
  const { description } = req.body;
  const { customer } = req;

  const balance = getBalance(customer.statement);

  if(isWithdrawBiggerThenBalance(amount, balance)){
    return res.status(400).json({error: 'Insufficient funds!'});
  }

  createStatementOperation(customer, description, amount, 'debit');
  return res.status(201).send();
});

const saveCustomer = (cpf, name) => {
  customers.push({
    cpf,
    name,
    id: uuidv4(),
    statement: [],
  });
};

const findCustomer = (cpf) => {
  return customers.find((customer) => customer.cpf === cpf);
};

const isThereACostumer = (cpf) => {
  const customerAlreadyExists = customers.some(
    (customer) => customer.cpf === cpf
  );

  return customerAlreadyExists ? true : false;
};

const createStatementOperation = (customer, description, amount, type) => {
  type === "credit" ? "credit" : "debit";

  const statementOperation = {
    description,
    amount,
    created_at: new Date(),
    type,
  };
  customer.statement.push(statementOperation);
};

const getBalance = (statement) => {
  const balance = statement.reduce((acc, operation) => {
    if (operation.type === "credit") {
      return acc + operation.amount;
    } else {
      return acc - operation.amount;
    }
  }, 0);

  return balance;
};

const isWithdrawBiggerThenBalance = (amount, balance) =>{
  return balance < amount ? true : false;
}

app.listen(5000, () => {
  console.log("Magic shit going on!");
});
