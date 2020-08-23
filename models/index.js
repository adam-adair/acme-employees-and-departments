const Sequelize = require('sequelize');
var faker = require('faker');
const { STRING, INTEGER } = Sequelize;

const db = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost:5432/acme_emp', {
    logging: false
})

const Employee = db.define("employee", {
    id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: STRING,
});

const Department = db.define("department", {
  id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true
  },
  name: STRING,
});

Employee.belongsTo(Department)
Department.hasMany(Employee)

const syncAndSeed = async () => {
    try{
        await db.sync({force:true});
        console.log('It synced!')
        let fakeDepts = ['No Department']
        for(let i = 0; i < 5; i++) fakeDepts.push(faker.commerce.department());
        let fakeEmployees  = []
        for(let i = 0; i < 50; i++) fakeEmployees.push(faker.name.findName());
        await Promise.all(fakeDepts.map(dept => Department.create({name: dept})));
        await Promise.all(fakeEmployees.map(emp => {
          const randomIx = Math.ceil(Math.random()*6)
          //this is clearly cheating
          Employee.create({name: emp, departmentId: randomIx})
        }));

        console.log('It seeded!')
    } catch(er) {
      console.log(er)
    }
  }

module.exports = { Employee, Department, syncAndSeed }
