"use client";
import Navbar from "@/components/Navbars/LoggedInNavbar";
import { Outfit } from "next/font/google";
import { useState } from "react";

const outfit = Outfit({
  subsets: ["latin"],
  weight: "400",
});

export default function CreateAssignment({
  params,
}: {
  params: { cid: string };
}) {
  const [questions, setQuestions] = useState([""]);
  const [formData, setFormData] = useState({
    assignment_name: "",
    course_name: params.cid.replace(/%20/g, " "),
    due_date: "",
    questions: [{ question_number: "", content: "", rubric: "", points: 0 }],
  });
  const [showErrorMessage, setShowErrorMessage] = useState("");
  const [index, setIndex] = useState(0);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const addQuestion = () => {
    setQuestions([...questions, ""]);
    setFormData({
      ...formData,
      questions: [
        ...formData.questions,
        {
          question_number: "",
          content: "",
          rubric: "",
          points: 0,
        },
      ],
    });
  };

  const removeQuestion = () => {
    setQuestions(questions.slice(0, -1));
    const newQuestions = formData.questions.slice(0, -1);
    setFormData({
      ...formData,
      questions: newQuestions,
    });
  };

  const handleQuestionChange = (
    index: number,
    field: string,
    value: string | number
  ) => {
    const newQuestions = [...formData.questions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    setFormData({
      ...formData,
      questions: newQuestions,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    console.log(formData);
    try {
      const response = await fetch(
        "https://ajsuccic54.execute-api.us-east-1.amazonaws.com/prod/addAssignment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();
      window.location.href = `/course/${params.cid}`;
      if (data.message) {
        console.log(data.message);
        setShowErrorMessage(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className={outfit.className}>
      <Navbar {...outfit} />
      <div className="ml-[15%] mr-[15%] mt-5">
        <a href={`/course/${params.cid}`}>
          <button
            type="button"
            className="mx-auto w-[10%] p-2 rounded-3xl border-none text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 cursor-pointer"
          >
            Cancel
          </button>
        </a>
        <form className="container mx-auto mt-5" onSubmit={handleSubmit}>
          <div className="flex flex-col bg-gray-100 shadow-md rounded-3xl pt-6 pb-8 mb-4">
            <div className="mb-4 px-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2 px-4"
                htmlFor="assignmentName"
              >
                Assignment Name
              </label>
              <input
                className="shadow appearance-none border rounded-3xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="assignmentName"
                name="assignment_name"
                type="text"
                value={formData.assignment_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-4 px-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2 px-4"
                htmlFor="dueDate"
              >
                Due Date
              </label>
              <input
                className="shadow appearance-none border rounded-3xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="due_date"
                type="date"
                name="due_date"
                value={formData.due_date}
                onChange={handleChange}
                required
              />
            </div>
            {questions.map((question, index) => (
              <div key={index} className="mb-4 px-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2 px-4"
                  htmlFor={`question${index}`}
                >
                  {`Question ID`}
                </label>
                <input
                  className=" shadow appearance-none border rounded-3xl w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                  type="text"
                  id={`question_name${index}`}
                  name={`question_name${index}`}
                  // @ts-expect-error
                  value={question.name}
                  onChange={(e) => {
                    handleQuestionChange(
                      index,
                      "question_number",
                      e.target.value
                    );
                  }}
                ></input>

                <label
                  className="block text-gray-700 text-sm font-bold mb-2 px-4"
                  htmlFor={`question${index}`}
                >
                  {`Question ${index + 1}`}
                </label>
                <textarea
                  className="h-[100px] shadow appearance-none border rounded-3xl w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                  id={`question${index}`}
                  // @ts-expect-error
                  value={question.content}
                  onChange={(e) => {
                    handleQuestionChange(index, "content", e.target.value);
                  }}
                  required
                />
                <label
                  className="block text-gray-700 text-sm font-bold mb-2 px-4"
                  htmlFor={`question${index}`}
                >
                  {`Question ${index + 1} Rubric`}
                </label>
                <textarea
                  className="h-[100px] shadow appearance-none border rounded-3xl w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                  id={`question${index}`}
                  // @ts-expect-error
                  value={question.rubric}
                  onChange={(e) => {
                    handleQuestionChange(index, "rubric", e.target.value);
                  }}
                  required
                />
                <label
                  className="block text-gray-700 text-sm font-bold mb-2 px-4"
                  htmlFor={`question${index}`}
                >
                  {`Question ${index + 1} Points`}
                </label>
                <input
                  type="number"
                  min="0"
                  className="h-[50px] shadow appearance-none border rounded-3xl w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                  id={`question${index}`}
                  // @ts-expect-error
                  value={question.points}
                  onChange={(e) =>
                    handleQuestionChange(index, "points", e.target.value)
                  }
                  required
                />
              </div>
            ))}
            <div className="flex items-center justify-between px-4 w-[70%] mx-auto">
              <button
                onClick={addQuestion}
                className="w-[20%] p-2 rounded-3xl border-none text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50 cursor-pointer"
                type="button"
              >
                Add Question
              </button>
              <button
                onClick={removeQuestion}
                className="w-[24%] p-2 rounded-3xl border-none text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-opacity-50 cursor-pointer"
                type="button"
              >
                Remove Question
              </button>
              <button
                className="w-[14%] p-2 rounded-3xl border-none text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 cursor-pointer"
                type="submit"
              >
                Assign
              </button>
            </div>
          </div>
        </form>
        {showErrorMessage ? (
          <div className="text-red-500 text-center mt-5">
            {showErrorMessage}
          </div>
        ) : (
          ""
        )}
      </div>
    </main>
  );
}
