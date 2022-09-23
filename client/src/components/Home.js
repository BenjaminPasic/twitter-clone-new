import "../css/Home.css";
import useAuth from "../hooks/useAuth";

export default function Home() {
  const { isAuth } = useAuth();
  console.log(isAuth);
  return <div>Home</div>;
}
