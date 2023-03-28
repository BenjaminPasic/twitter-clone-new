import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Chat from "./components/Chat";
import CheckIfLoggedIn from "./components/CheckIfLoggedIn";
import Comments from "./components/Comments";
import Home from "./components/Home";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import NotFound from "./components/NotFound";
import Profile from "./components/Profile";
import ProtectedRoutes from "./components/ProtectedRoutes";
import Register from "./components/Register";
import SearchResult from "./components/SearchResult";
import useAuth from "./hooks/useAuth";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const { isAuth } = useAuth();

  useEffect(() => {
    document.title = "Chatter";
  }, []);

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
            <Route path="/chat" element={<Chat />} />
            <Route path="/search/:search" element={<SearchResult />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </QueryClientProvider>
  );
}

export default App;
