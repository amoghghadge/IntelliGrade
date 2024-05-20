"use client";
import LoggedInNavbar from "@/components/Navbars/LoggedInNavbar";
import AssignmentBox from "@/components/AssignmentBox";
import { useEffect, useState } from "react";
import { Outfit } from "next/font/google";

const outfit = Outfit({
  subsets: ["latin"],
  weight: "400",
});

export default function Course({ params }: { params: { cid: string } }) {
  const [assignments, setAssignments] = useState([
    {
      assignment_id: "",
      assignment_name: "",
      status: "",
      due_date: "",
      assigned_date: "",
    },
  ]);
  const [loading, setLoading] = useState(true);
  const [description, setDescription] = useState("");

  useEffect(() => {
    const retrieve = async () => {
      try {
        const response = await fetch(
          "https://ajsuccic54.execute-api.us-east-1.amazonaws.com/prod/getAssignmentsByCourse",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: localStorage.getItem("primaryKey"),
              course_name: params.cid.replace(/%20/g, " "),
            }),
          }
        );
        const data = await response.json();
        console.log(data);
        if (data.message) {
          console.log(data.message);
        }
        setAssignments(data.assignments);
      } catch (error) {
        console.error(error);
      }
    };
    const retrieveDescription = async () => {
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
        if (data.message) {
          console.log(data.message);
        }
        let index;
        index = data.courses.findIndex(
          (course: any) =>
            params.cid.replace(/%20/g, " ") === course.course_name
        );
        if (index === -1) return null;
        setDescription(data.courses[index].course_description);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    retrieve();
    retrieveDescription();
  }, []);

  if (loading) return null;
  return (
    <main className={outfit.className}>
      <LoggedInNavbar {...outfit} />
      <div className="ml-[15%] mr-[15%] mt-5">
        <a href="/">
          <button
            type="button"
            className="mx-auto w-[10%] mb-5 p-2 rounded-3xl border-none text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 cursor-pointer"
          >
            Back
          </button>
        </a>
        <div className="text-3xl mb-5">{params.cid.replace(/%20/g, " ")}</div>
        <div className="text-xl mb-5">{description ? description : ""}</div>
        <div className="flex justify-center">
          <div className="flex w-[95%] justify-between">
            <div>Assignment Name</div>
            <div>Status</div>
            <div>Due Date</div>
            <div>Assigned Date</div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {assignments?.map((assignment) => (
            <a
              key={assignment.assignment_id}
              href={`/course/${params.cid}/assignment/${assignment.assignment_id}`}
            >
              <AssignmentBox
                key={assignment.assignment_id}
                assignmentName={assignment.assignment_name}
                status={assignment.status}
                dueDate={assignment.due_date}
                assignedDate={assignment.assigned_date}
              />
            </a>
          ))}
          {localStorage.getItem("role") === "teacher" ? (
            <a href={`/course/${params.cid}/createassignment`}>
              <div className="flex w-[100%] h-[75px] rounded-3xl p-5 text-sm bg-[#0B6FFF] justify-between items-center">
                <div className="text-white mx-auto ">Create Assignment</div>
              </div>
            </a>
          ) : (
            ""
          )}
        </div>
      </div>
    </main>
  );
}
