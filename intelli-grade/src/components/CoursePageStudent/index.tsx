"use client";
import Course from "../Course";
import ModalStudent from "../ModalStudent";
import { useEffect, useState } from "react";

export default function CoursePageStudent() {
  const [courses, setCourses] = useState([{ course_name: "" }]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const retrieve = async () => {
      try {
        const response = await fetch(
          "https://ajsuccic54.execute-api.us-east-1.amazonaws.com/prod/getUserCourses",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: localStorage.getItem("primaryKey"),
            }),
          }
        );
        const data = await response.json();
        console.log(data.courses);
        if (data.message) {
          console.log(data.message);
        }
        setCourses(data.courses);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    retrieve();
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  if (loading) return null;
  return (
    <div>
      <div className="ml-[15%] mr-[15%] mt-5">
        <div className="text-3xl mb-10">Your Courses</div>
        <div className="grid grid-cols-3 gap-4">
          {courses.map((course) => (
            <a key={course.course_name} href={`/course/${course.course_name}`}>
              <Course
                key={course.course_name}
                courseName={course.course_name}
              />
            </a>
          ))}
          <button
            onClick={openModal}
            className="w-[345px] h-[200px] rounded-3xl bg-[#0B6FFF] flex items-center justify-center text-white text-center cursor-pointer"
          >
            Add Course
          </button>
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-5 rounded-lg shadow-lg w-[90%] max-w-xl">
            <div className="text-right">
              <button onClick={closeModal} className="text-xl font-bold">
                &times;
              </button>
            </div>
            <div className="mt-2">
              <ModalStudent />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
