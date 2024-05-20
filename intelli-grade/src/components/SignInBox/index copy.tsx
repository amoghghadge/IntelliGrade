"use client";
import { useState } from "react";
import { stagger, useAnimate } from "framer-motion";
import { useRouter } from "next/navigation";

export default function SignUpBox() {
  const router = useRouter();
  const [scope, animate] = useAnimate();
  const [showErrorMessage, setShowErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    role: "",
  });

  const onButtonClick = () => {
    animate([
      [".letter", { y: -32 }, { duration: 1, delay: stagger(0.2) }],
      ["button", { scale: 0.9 }, { duration: 0.1, at: "<" }],
      ["button", { scale: 1 }, { duration: 0.1 }],
      [".letter", { y: 0 }, { duration: 0.001 }],
    ]);
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "https://ajsuccic54.execute-api.us-east-1.amazonaws.com/prod/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();
      if (data.message) {
        console.log(data.message);
        setShowErrorMessage(data.message);
      } else {
        localStorage.setItem("primaryKey", formData.email);
        localStorage.setItem("role", formData.role);
        router.push("/");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-[30%] mx-auto p-[30px] rounded-3xl shadow-md bg-gray-100">
      <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
        <h2 className="text-center text-2xl font-bold">
          Sign up for IntelliGrade
        </h2>
        <div>
          <label htmlFor="first_name" className="ml-[20px] block">
            First Name
          </label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            className="w-full p-[10px] rounded-3xl border border-gray-300"
            value={formData.first_name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="last_name" className="ml-[20px] block">
            Last Name
          </label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            className="w-full p-[10px] rounded-3xl border border-gray-300"
            value={formData.last_name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="ml-[20px] block">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="w-full p-[10px] rounded-3xl border border-gray-300"
            value={formData.email.toLowerCase()}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="ml-[20px] block">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="w-full p-[10px] rounded-3xl border border-gray-300"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="role" className="ml-[20px] block">
            Role
          </label>
          <select
            id="role"
            name="role"
            className="w-full p-[10px] rounded-3xl border border-gray-300"
            value={formData.role.toLowerCase()}
            onChange={handleChange}
            required
          >
            <option value="">Select your role</option>
            <option value="teacher">Teacher</option>
            <option value="student">Student</option>
          </select>
        </div>
        <div ref={scope} className="flex items-center">
          <button
            onClick={onButtonClick}
            type="submit"
            className="mx-auto w-[40%] p-1 mt-1 rounded-3xl border-none text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 cursor-pointer"
          >
            <span className="block h-[32px] overflow-hidden" aria-hidden>
              {[
                "C",
                "r",
                "e",
                "a",
                "t",
                "e",
                " ",
                "A",
                "c",
                "c",
                "o",
                "u",
                "n",
                "t",
              ].map((letter, index) =>
                letter === " " ? (
                  // Render a span for spaces with a different class
                  <span
                    key={`${letter}-${index}`}
                    className="space inline-block h-[19px] leading-8"
                    style={{ width: "5px" }} // Adjust the width as needed to control spacing
                  >
                    {letter}
                  </span>
                ) : (
                  // Render non-space characters as before
                  <span
                    data-letter={letter}
                    className="letter relative inline-block h-8 leading-8 after:absolute after:left-0 after:top-full after:h-8 after:content-[attr(data-letter)]"
                    key={`${letter}-${index}`}
                  >
                    {letter}
                  </span>
                )
              )}
            </span>
          </button>
        </div>
        {showErrorMessage ? (
          <div className="text-red-500 text-center">{showErrorMessage}</div>
        ) : (
          ""
        )}
      </form>
    </div>
  );
}
