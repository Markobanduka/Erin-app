import { Link } from "react-router-dom";
import { useState } from "react";

import { MdOutlineMail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmedPassword: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isError = false;

  return (
    <div className="max-w-screen-xl mx-auto flex h-screen px-10">
      <div className="flex-1 flex flex-col justify-center items-center">
        <form
          className="lg:w-2/3  mx-auto md:mx-20 flex gap-4 flex-col"
          onSubmit={handleSubmit}
        >
          <h1 className="text-4xl font-extrabold text-white">Join today.</h1>
          <label className="input input-bordered rounded flex items-center gap-2">
            <FaUser />
            <input
              type="text"
              className="grow"
              placeholder="Full Name"
              name="fullName"
              onChange={handleInputChange}
              value={formData.fullName}
            />
          </label>
          <div className="flex gap-4 flex-wrap">
            <label className="input input-bordered rounded flex items-center gap-2 flex-1">
              <MdOutlineMail />
              <input
                type="email"
                className="grow"
                placeholder="Email"
                name="email"
                onChange={handleInputChange}
                value={formData.email}
              />
            </label>
            <label className="input input-bordered rounded flex items-center gap-2 flex-1">
              <MdPassword />
              <input
                type="password"
                className="grow"
                placeholder="Password"
                name="password"
                onChange={handleInputChange}
                value={formData.password}
              />
            </label>
          </div>
          <label className="input input-bordered rounded flex items-center gap-2">
            <MdPassword />
            <input
              type="password"
              className="grow"
              placeholder="Confirm Password"
              name="confirmedPassword"
              onChange={handleInputChange}
              value={formData.confirmedPassword}
            />
          </label>
          <button className="btn rounded-full btn-primary text-white">
            Sign up
          </button>
          {isError && <p className="text-red-500">Something went wrong</p>}
        </form>
        <div className="flex flex-col lg:w-2/3 gap-2 mt-4">
          <p className="text-white text-lg">Already have an account?</p>
          <Link to="/login">
            <button className="btn rounded-full btn-primary text-white btn-outline w-full">
              Sign in
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default SignUpPage;
