import "../css/Home.css";
import StatusUpdate from "./StatusUpdate";
import Posts from "./Posts";
import { useState } from "react";

export default function Home() {
  const [localPost, setLocalPost] = useState([]);

  return (
    <div className="home">
      <StatusUpdate addNewLocalPost={setLocalPost} />
      <Posts localPost={localPost} />
    </div>
  );
}
