import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [employees, setEmployees] = useState([]);
  const [employeeData, setEmployeeData] = useState({
    name: "",
    age: "",
    email: "",
  });
  const [editEmployee, setEditEmployee] = useState(null); 

  const API_URL = "http://127.0.0.1:8000/api/employees/";

  
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(API_URL);
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData({
      ...employeeData,
      [name]: value,
    });
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editEmployee) {
        
        await axios.put(`${API_URL}${editEmployee.id}/`, employeeData);
        setEditEmployee(null);
      } else {
        
        await axios.post(API_URL, employeeData);
      }
      fetchEmployees(); 
      setEmployeeData({ name: "", age: "", email: "" }); 
    } catch (error) {
      console.error("Error submitting employee data:", error);
    }
  };

  
  const handleEdit = (employee) => {
    setEditEmployee(employee);
    setEmployeeData({
      name: employee.name,
      age: employee.age,
      email: employee.email,
    });
  };

  
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}${id}/`);
      fetchEmployees(); 
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Employee Management</h1>

      <h2>{editEmployee ? "Update Employee" : "Add Employee"}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={employeeData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Age:</label>
          <input
            type="number"
            name="age"
            value={employeeData.age}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={employeeData.email}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">{editEmployee ? "Update Employee" : "Add Employee"}</button>
        {editEmployee && (
          <button type="button" onClick={() => setEditEmployee(null)}>
            Cancel
          </button>
        )}
      </form>

      <h2>Employee List</h2>
      {employees.length > 0 ? (
        <ul>
          {employees.map((employee) => (
            <li key={employee.id}>
              {employee.name} - {employee.email} (Age: {employee.age})
              <button onClick={() => handleEdit(employee)}>Edit</button>
              <button onClick={() => handleDelete(employee.id)}>Delete</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No employees found.</p>
      )}
    </div>
  );
}

export default App;
