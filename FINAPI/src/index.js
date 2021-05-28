const express = require("express");
const { v4: uuidv4 } = require("uuid");
const app = express();

app.use(express.json());

const customers = [];

app.post("/account", (req, res) => {
  const { cpf, name } = req.body;

  if (isThereACostumer(cpf)) {
    return res.status(400).json({ error: "Customer already exists!" });
  }

  saveCustomer(cpf, name);

  return res.status(201).send();
});

app.get("/statement", (req, res) => {
  const { cpf } = req.headers;
  const customer = findCustomer(cpf);

  if (!customer) {
    res.status(404).json({ error: "Customer not found!" });
  }

  res.status(200).json(customer.statement);
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

  if (customerAlreadyExists) {
    return true;
  }

  return false;
};

app.listen(5000, () => {
  console.log("Magic shit going on!");
});
