const express = require("express");
const logger = require("./utils/logger");
const { v4: uuidv4 } = require("uuid");
const app = express();

app.use(express.json());

const customers = [];

function validateExistingAccountByCPF(req, res, next) {
  const { cpf } = req.headers;
  const customer = findCustomer(cpf);

  if (!customer) {
    logger.error('Customer not found!')
    res.status(404).json({ error: "Customer not found!" });
  }

  req.customer = customer;
  return next();
}

app.post("/account", (req, res) => {
  const { cpf, name } = req.body;

  if (isThereACostumer(cpf)) {
    logger.error(`Customer ${cpf} already exists!`);
    return res.status(400).json({ error: "Customer already exists!" });
  }

  createCustomer(cpf, name);
  logger.info("Account created successfully!");
  return res.status(201).send();
});

app.get("/statement", validateExistingAccountByCPF, (req, res) => {
  const { customer } = req;
  res.status(200).json(customer.statement);
});

app.post("/deposit", validateExistingAccountByCPF, (req, res) => {
  const { description, amount } = req.body;
  const { customer } = req;

  createStatementOperation(customer, description, amount, "credit");
  return res.status(201).send();
});

app.post("/withdraw", validateExistingAccountByCPF, (req, res) => {
  const { amount } = req.body;
  const { description } = req.body;
  const { customer } = req;

  logger.info(`Retrieving balance for client ${customer.cpf}`);
  const balance = getBalance(customer.statement);

  if (isWithdrawBiggerThenBalance(amount, balance)) {
    logger.error(`Withdraw value [${amount}] is bigger then the balance ${balance}`);
    return res.status(400).json({ error: "Insufficient funds!" });
  }

  createStatementOperation(customer, description, amount, "debit");
  return res.status(201).send();
});

app.get("/statement/date", validateExistingAccountByCPF, (req, res) => {
  const { customer } = req;
  const { date } = req.query;

  const dateFormat = new Date(date+" 00:00").toDateString();

  const statement = customer.statement.filter(
    (statement) =>
    statement.created_at.toDateString() ==
    new Date(dateFormat).toDateString()
  );

  console.log(statement);
  res.status(200).json(statement);
});

const createCustomer = (cpf, name) => {
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
  logger.info(`Operation from type ${type} realized successfully!`)
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

const isWithdrawBiggerThenBalance = (amount, balance) => {
  return balance < amount ? true : false;
};

app.listen(5000, () => {
  console.log("Magic shit going on!");
});