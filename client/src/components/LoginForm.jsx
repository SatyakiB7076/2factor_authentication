import React, { useState } from "react";
import { Link } from "react-router-dom";
import { register,loginUser } from "../service/authApi";


function LoginForm() {
  const [form, setForm] = useState({ username: "", password: "" });
  // const [error, setError] = useState("");
  const [isRegistered, setisRegistered] = useState(false);
const [error, setError] = useState("");
const [message, setMessage] = useState("");
  
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const {data}=await loginUser(form.username,form.password);
      
      setMessage(data.message);
      setForm({ username: "", password: "" });
      setError("");
    } catch (error) {
      setError(error.message)
    }
  };
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const {data}=await register(form.username,form.password);
      setisRegistered(false);
      setMessage(data.message);
      setForm({ username: "", password: "" });
      setError("");
    } catch (error) {
      setError(error.message)
    }
  };
  // console.log("Form data :", form);

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {isRegistered ? "Login" : "Register"}
      </h2>

      <form
        onSubmit={isRegistered ? handleLogin : handleRegister}
        className="space-y-4"
      >
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-semibold text-gray-700"
          >
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            value={form.username}
            onChange={(e) => {
              setForm({ ...form, [e.target.name]: e.target.value });
            }}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
            placeholder="Enter the username"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-semibold text-gray-700"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={(e) => {
              setForm({ ...form, [e.target.name]: e.target.value });
            }}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
            placeholder="Enter the password"
          />
        </div>
<div>
{error&&<p className="text-red-500 text-sm mb-3">{error}</p>}
{message&&<p className="text-green-600 text-sm mb-3">{message}</p>}
</div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {isRegistered ? "Login" : "Register"}
        </button>
        <div className="text-small font-light mb-6 text-center">
          <p>
            {isRegistered ? "Don't have account?" : "Already has an account"}{" "}
            <Link
              to=""
              className="font-semibold"
              onClick={() => setisRegistered(!isRegistered)}
            >
              {isRegistered ? "Create account" : "Login"}
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export default LoginForm;
