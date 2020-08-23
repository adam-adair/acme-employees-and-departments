import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

class Main extends React.Component {
  constructor() {
    super();
    this.state = {
      departments: [], // [{id: 1, name: 'Rehab', rating:5}, {id: 2, name: 'Adam', rating:1}]
      employees: [],
    };
    this.destroy = this.destroy.bind(this)
    this.move = this.move.bind(this)
  }

  render() {
    //const friends = this.state.friends
    return this.state.departments.map(department => {
      const deptEmployees = this.state.employees.filter(employee => employee.departmentId === department.id)
      return (
        <Department
          department={department}
          key={department.id}
          deptEmployees={deptEmployees}
          destroy={this.destroy}
          move={this.move}
        />
      );
    });
  }

  async componentDidMount() {
    try {
      const depts = await axios.get('/api/departments');
      const emps = await axios.get('/api/employees');
      this.setState({ departments: depts.data , employees: emps.data});
    } catch (err) {
      console.log('ERROR');
    }
  }

  async destroy(employee) {
    let employees = this.state.employees
    try {
      await axios.delete(`/api/employees/${employee.id}`);
      employees = employees.filter(emp => emp.id !== employee.id)
      this.setState({ employees })
    } catch (err) {
      console.log('ERROR');
    }
  }

  async move(employee) {
    let employees = this.state.employees
    try {
      await axios.put(`/api/employees/${employee.id}`);
      employee.departmentId = 1
      this.setState({ employees })
    } catch (err) {
      console.log('ERROR');
    }
  }
}

const Department = ({ department, deptEmployees, destroy, move }) =>{
  return (
    <div className='department'>
      <h2>{department.name}</h2>
      {deptEmployees.map(employee=>(<Employee employee={employee} key={employee.id} destroy={destroy} move={move}/>))}
    </div>
  )
}

const Employee = ({employee, destroy, move}) => {
  return (
    <div className='employee'>
      <h4>{employee.name}</h4>
      {employee.departmentId === 1 ? '' : <button type='submit' className='move' onClick={()=>move(employee)}>O</button>}
      <button type='submit' className='destroy' onClick={()=>destroy(employee)}>X</button>
    </div>
  )
}

ReactDOM.render(<Main />, document.getElementById('root'));
