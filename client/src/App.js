import Register from "./components/Register";
import Home from "./components/Home";
import Login from "./components/Login";
import LoginCheck from "./components/LoginCheck";
import ProtectedRoutes from "./components/ProtectedRoutes";
import NotFound from "./components/NotFound";
import Navbar from "./components/Navbar";
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
  const { isAuth, setIsAuth } = useAuth();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        {isAuth ? <Navbar /> : ""}
        <Routes>
          <Route element={<LoginCheck />}>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </Route>
          <Route element={<ProtectedRoutes />}>
            <Route path="/" element={<Home />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </QueryClientProvider>
  );
}

export default App;
