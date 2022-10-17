import "../css/Home.css";
import StatusUpdate from "./StatusUpdate";
import Posts from "./Posts";

export default function Home() {
  return (
    <div className="home">
      <StatusUpdate />
      <Posts />
    </div>
  );
}
