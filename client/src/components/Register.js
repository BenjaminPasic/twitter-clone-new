import { TextField } from "@mui/material";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import { useMutation } from "react-query";
import axios from "axios";
import "./Register.css";

const registerUser = (formData) => {
  return axios.post("http://localhost:3001/user/register", formData);
};

const Register = () => {
  const { isFetching, mutate, error } = useMutation(registerUser);

  useEffect(() => {
    const errorMessage = error.response?.data;
    if (errorMessage === "username must be unique") {
      setFormError({ ...formError, username: "Username is already taken" });
    }
  }, [error]);

  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    username: "",
    email: "",
    password: "",
  });

  const [formError, setFormError] = useState({
    name: "",
    surname: "",
    username: "",
    email: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    let error = false;

    setFormError({
      name: false,
      surname: false,
      username: false,
      email: false,
      password: false,
    });

    for (const property in formData) {
      if (formData[property] === "") {
        setFormError((prevData) => ({
          ...prevData,
          [property]: "This field is required",
        }));
        error = true;
      }
    }

    if (!error) {
      mutate(formData);
    }
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
            error={formError.name ? true : false}
            helperText={formError.name ? formError.name : ""}
          />
          <TextField
            variant="outlined"
            label="Surname"
            name="surname"
            type="text"
            onChange={handleInput}
            error={formError.surname ? true : false}
            helperText={formError.surname ? formError.surname : ""}
          />
        </div>
        <TextField
          margin="normal"
          fullWidth
          label="Username"
          name="username"
          type="text"
          onChange={handleInput}
          error={formError.username ? true : false}
          helperText={formError.username ? formError.username : ""}
        />
        <TextField
          margin="normal"
          fullWidth
          label="Email"
          type="email"
          name="email"
          onChange={handleInput}
          error={formError.email ? true : false}
          helperText={formError.email ? formError.email : ""}
        />
        <TextField
          margin="normal"
          fullWidth
          label="Password"
          type="password"
          name="password"
          onChange={handleInput}
          error={formError.password ? true : false}
          helperText={formError.password ? formError.password : ""}
        />
        {isFetching ? (
          <Button fullWidth variant="contained" sx={{ mt: 2 }} disabled>
            Loading...
          </Button>
        ) : (
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
            Register
          </Button>
        )}
        <p className="login-link">
          Already have an account? <a href="#">Log in</a>
        </p>
      </form>
    </div>
  );
};

export default Register;
