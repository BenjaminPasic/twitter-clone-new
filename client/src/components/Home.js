import "../css/Home.css";
import StatusUpdate from "./StatusUpdate";
import useAuth from "../hooks/useAuth";

export default function Home() {
  return (
    <div className="home">
      <StatusUpdate />
    </div>
  );
}
