import Register from "./components/Register";
import Home from "./components/Home";
import Login from "./components/Login";
import ProtectedRoutes from "./components/ProtectedRoutes";
import NotFound from "./components/NotFound";
import Comments from "./components/Comments";
import Navbar from "./components/Navbar";
import Profile from "./components/Profile";
import CheckIfLoggedIn from "./components/CheckIfLoggedIn";
import { Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import useAuth from "./hooks/useAuth";
import "./App.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const { isAuth } = useAuth();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        {isAuth ? <Navbar /> : ""}
        <Routes>
          <Route element={<CheckIfLoggedIn />}>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </Route>
          <Route element={<ProtectedRoutes />}>
            <Route path="/" element={<Home />} />
            <Route path="/comments/:id" element={<Comments />} />
            <Route path="/profile/:username" element={<Profile />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </QueryClientProvider>
  );
}

export default App;
