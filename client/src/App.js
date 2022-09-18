import Register from "./components/Register";
import Home from "./components/Home";
import Login from "./components/Login";
import LoginCheck from "./components/LoginCheck";
import NotFound from "./components/NotFound";
import { Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <Routes>
          <Route element={<LoginCheck />}>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </Route>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </QueryClientProvider>
  );
}

export default App;
