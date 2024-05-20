"use client";
import React, { useState } from "react";
import { stagger, useAnimate } from "framer-motion";

export default function ModalTeacher() {
  const [showErrorMessage, setShowErrorMessage] = useState("");
  const [scope, animate] = useAnimate();
  const [formData, setFormData] = useState({
    course_name: "",
    description: "",
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
    const response = await fetch(
      "https://ajsuccic54.execute-api.us-east-1.amazonaws.com/prod/addCourse",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: localStorage.getItem("primaryKey"),
          course_name: formData.course_name,
          description: formData.description,
        }),
      }
    );
    const data = await response.json();
    if (data.message) {
      setShowErrorMessage(data.message);
    } else {
      console.log("success");
      location.reload();
    }
  };

  return (
    <div className="max-w-[70%] mx-auto p-10 rounded-3xl">
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <h2 className="text-center text-2xl font-bold">Create Course</h2>
        <div>
          <label htmlFor="code" className="ml-[20px] block">
            Course Code
          </label>
          <input
            type="code"
            id="course_name"
            name="course_name"
            className="w-full p-[10px] rounded-3xl border border-gray-300"
            value={formData.course_name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="ml-[20px] block">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            className="w-full h-[150px] p-[10px] rounded-3xl border border-gray-300"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div ref={scope} className="flex items-center">
          <button
            onClick={onButtonClick}
            type="submit"
            className="mx-auto w-[30%] p-2 rounded-3xl border-none text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 cursor-pointer"
          >
            <span className="block h-[32px] overflow-hidden" aria-hidden>
              {["C", "o", "n", "f", "i", "r", "m"].map((letter, index) =>
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
      </form>

      {showErrorMessage ? (
        <div className="text-red-500 text-center mt-5">{showErrorMessage}</div>
      ) : (
        ""
      )}
    </div>
  );
}
