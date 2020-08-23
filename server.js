const express = require('express')
const morgan = require('morgan')
const path = require('path')
const { Employee, Department, syncAndSeed } = require('./models')

const app = express()

app.use(morgan('dev'));

app.use('/dist', express.static(path.join(__dirname, 'dist')));

app.get('/', (req, res, next)=> res.sendFile(path.join(__dirname, 'index.html')));

app.get('/api/employees', async (req, res) => {
  const employees = await Employee.findAll();
  res.json(employees)
})

app.get('/api/departments', async (req, res) => {
  const departments = await Department.findAll();
  res.json(departments)
})

app.put('/api/employees/:id', async (req, res) => {
  await Employee.update({
    departmentId: 1
  }, {
    where: {id: req.params.id}
  })
  res.status(200).json('success')
})

app.delete('/api/employees/:id', async (req, res) => {
  await Employee.destroy({
    where: {id: req.params.id}
  })
  res.status(200).json('success')
})

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  console.error(err);
  res.send( `Something went wrong. ${err.message}`
  );
});

syncAndSeed();
const port = process.env.PORT || 3000
app.listen(port,() => console.log(`Listening on ${port}`))
