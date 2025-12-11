"use client";

import { useState } from "react";
import { redirect } from "next/navigation";
import { useUser } from "../context/getUser";

function page() {
  const { user } = useUser();
  if (user) {
    redirect("/");
  }
  const [forms, setForms] = useState({
    email: "",
    password: "",
  });
  const handleInput = (e) => {
    setForms({
      ...forms,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(forms),
    });
    const data = await res.json();
    console.log(data);
  };
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <form className="w-[500px] p-6 border border-gray-300 rounded-lg flex flex-col gap-4">
        <input
          type="email"
          name="email"
          value={forms.email}
          onChange={handleInput}
          placeholder="Email"
          className="border border-gray-300 rounded-lg p-2"
        />
        <input
          type="password"
          name="password"
          value={forms.password}
          onChange={handleInput}
          placeholder="Password"
          className="border border-gray-300 rounded-lg p-2"
        />
        <button
          type="submit"
          onClick={handleSubmit}
          className="bg-blue-500 text-white p-2 rounded-lg cursor-pointer"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}

export default page;
