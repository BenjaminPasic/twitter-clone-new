import { TextField } from "@mui/material";
import Button from "@mui/material/Button";
import { useState } from "react";
import "./Register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    username: "",
    email: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  const handleInput = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="register">
      <form onSubmit={handleSubmit}>
        <h2>Sign up</h2>
        <div className="first-row">
          <TextField
            variant="outlined"
            label="Name"
            name="name"
            type="text"
            onChange={handleInput}
          />
          <TextField
            variant="outlined"
            label="Surname"
            name="surname"
            type="text"
            onChange={handleInput}
          />
        </div>
        <TextField
          margin="normal"
          fullWidth
          label="Username"
          name="username"
          type="text"
          onChange={handleInput}
        />
        <TextField
          margin="normal"
          fullWidth
          label="Email"
          type="email"
          name="email"
          onChange={handleInput}
        />
        <TextField
          margin="normal"
          fullWidth
          label="Password"
          type="password"
          name="password"
          onChange={handleInput}
        />
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
          Register
        </Button>
        <p className="login-link">
          Already have an account? <a href="#">Log in</a>
        </p>
      </form>
    </div>
  );
};

export default Register;
