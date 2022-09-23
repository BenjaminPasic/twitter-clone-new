import Button from "@mui/material/Button";
import { TextField } from "@mui/material";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import { useMutation } from "react-query";
import "../css/Login.css";
import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";

const loginUser = (formData) => {
  return axios.post("/user/login", formData);
};

export default function Login() {
  const { mutate, isLoading, error } = useMutation(loginUser);
  const { setIsAuth, isAuth } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [formError, setFormError] = useState({
    username: "",
    password: "",
  });

  useEffect(() => {
    if (error) {
      const { data: errorMessage } = error.response;
      if (errorMessage === "Invalid username") {
        setFormError((prevData) => ({
          ...prevData,
          username: errorMessage,
        }));
      }

      if (errorMessage === "Passwords do not match") {
        setFormError((prevData) => ({
          ...prevData,
          password: errorMessage,
        }));
      }
    }
  }, [error]);

  const handleChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setFormError({
      username: "",
      password: "",
    });

    let error = false;

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
      mutate(formData, {
        onSuccess: () => {
          setIsAuth(true);
        },
      });
    }
  };

  if (isAuth) return <Navigate to="/" replace={true} />;

  return (
    <div className="login">
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        <TextField
          margin="normal"
          fullWidth
          label="Username"
          name="username"
          onChange={(e) => handleChange(e)}
          error={formError.username ? true : false}
          helperText={formError.username ? formError.username : ""}
        />
        <TextField
          margin="normal"
          fullWidth
          label="Password"
          name="password"
          onChange={(e) => handleChange(e)}
          error={formError.password ? true : false}
          helperText={formError.password ? formError.password : ""}
        />
        {isLoading ? (
          <Button fullWidth variant="contained" sx={{ mt: 2 }} disabled>
            Loading...
          </Button>
        ) : (
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
            Login
          </Button>
        )}
        <p>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
}
