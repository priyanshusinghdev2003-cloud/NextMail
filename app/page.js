"use client";
import { useUser } from "./context/getUser";

function Home() {
  const { user } = useUser();

  const handleLogout = async () => {
    fetch("/api/users/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
  };

  return (
    <div>{user ? <h1 onClick={handleLogout}>Logout</h1> : <h1>Login</h1>}</div>
  );
}

export default Home;
