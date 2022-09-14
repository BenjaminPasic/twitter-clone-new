import Register from "./components/Register";
import { QueryClient, QueryClientProvider } from "react-query";
import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <Register />
      </div>
    </QueryClientProvider>
  );
}

export default App;
