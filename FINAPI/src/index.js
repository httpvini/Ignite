const express = require('express');
const { v4: uuidv4 } = require('uuid');
const app = express();

app.use(express.json());

const customers = [];

app.post('/account', (req, res)=> {
    const { cpf, name } = req.body;

    if(isThereACostumer(cpf)){
        return res.status(400).json(
            {error: 'Customer already exists!'}
        );
    }

    saveCustomer(cpf, name);

    return res.status(201).send();
});

const saveCustomer = (cpf, name) => {
    customers.push({
        cpf,
        name,
        id:uuidv4(),
        statement: []
    });
}

const isThereACostumer = (cpf) => {
    const customerAlreadyExists = customers.some(
        (customer) => customer.cpf === cpf
    );

    if(customerAlreadyExists) {
        return true;
    }

    return false
}

app.listen(5000, ()=>{
    console.log('Magic shit going on!');
});