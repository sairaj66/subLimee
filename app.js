const express = require('express');
const bodyParser = require('body-parser');
const customers = require('./customers.json');

const app = express();
app.use(bodyParser.json());

app.get('/customers', (req, res) => {
  const { first_name, last_name, city, page, limit } = req.query;
  let results = customers;

  if (first_name) {
    results = results.filter(customer =>
      customer.first_name.toLowerCase().includes(first_name.toLowerCase())
    );
  }

  if (last_name) {
    results = results.filter(customer =>
      customer.last_name.toLowerCase().includes(last_name.toLowerCase())
    );
  }

  if (city) {
    results = results.filter(customer =>
      customer.city.toLowerCase().includes(city.toLowerCase())
    );
  }

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedResults = results.slice(startIndex, endIndex);

  res.json(paginatedResults);
});

app.get('/customers/:id', (req, res) => {
  const { id } = req.params;
  const customer = customers.find(cust => cust.id === parseInt(id));

  if (!customer) {
    res.status(404).json({ message: 'Customer not found' });
  } else {
    res.json(customer);
  }
});

app.get('/cities', (req, res) => {
  const cityCounts = {};

  customers.forEach(customer => {
    const city = customer.city;
    cityCounts[city] = (cityCounts[city] || 0) + 1;
  });

  res.json(cityCounts);
});

app.post('/customers', (req, res) => {
  const { id, first_name, last_name, city, company } = req.body;

  if (!id || !first_name || !last_name || !city || !company) {
    res.status(400).json({ message: 'All fields are required' });
    return;
  }

  const existingCustomer = customers.find(cust => cust.id === id);
  if (existingCustomer) {
    res.status(400).json({ message: 'Customer with the same ID already exists' });
    return;
  }

  const existingCity = customers.find(cust => cust.city === city);
  if (!existingCity) {
    res.status(400).json({ message: 'City does not exist' });
    return;
  }

  const existingCompany = customers.find(cust => cust.company === company);
  if (!existingCompany) {
    res.status(400).json({ message: 'Company does not exist' });
    return;
  }

  const newCustomer = {
    id: parseInt(id),
    first_name,
    last_name,
    city,
    company
  };

  customers.push(newCustomer);
  res.json({ message: 'Customer added successfully', customer: newCustomer });
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
