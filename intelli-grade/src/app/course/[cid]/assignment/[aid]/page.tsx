"use client";
import { Outfit } from "next/font/google";
import LoggedInNavbar from "@/components/Navbars/LoggedInNavbar";
import { useEffect, useState } from "react";

const outfit = Outfit({
  subsets: ["latin"],
  weight: "400",
});

export default function Assignment({
  params,
}: {
  params: { aid: string; cid: string };
}) {
  const [questions, setQuestions] = useState([
    {
      question_number: "",
      Points: "",
      rubric: "",
      content: "",
    },
  ]);

  const [loading, setLoading] = useState(true);
  const [assignmentName, setAssignmentName] = useState("");
  const [status, setStatus] = useState("");
  const [feedback, setFeedback] = useState("");
  const [submission, setSubmission] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    const retrieve = async () => {
      try {
        setRole(localStorage.getItem("role") || "");
        const response = await fetch(
          "https://ajsuccic54.execute-api.us-east-1.amazonaws.com/prod/getQuestionsFromAssignment",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              assignment_id: params.aid.replace(/%20/g, " "),
            }),
          }
        );
        const data = await response.json();
        if (data.message) {
          console.log(data.message);
        }
        setQuestions(data.questions);
        setAssignmentName(data.assignment_name);
        setStatus(data.status);
        setFeedback(data.feedback);
        setSubmission(data.submission);
        deleteSubmission();
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    retrieve();
  }, []);

  const [file, setFile] = useState({ name: "", type: "" });

  // Function to handle file selection
  const handleFileChange = (event: any) => {
    setFile(event.target.files[0]);
  };

  const deleteSubmission = () => {
    setFile({ name: "", type: "" });
  };

  // Function to upload the file
  const uploadFile = async () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    try {
      // Step 1: Request a presigned URL from your server
      const url = `https://hoogrades.s3.amazonaws.com/${Date.now()}-${
        file.name
      }`;

      try {
        const response = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          // @ts-expect-error
          body: file,
        });
        if (response.ok) {
          console.log("Upload successful");
          const publicUrl = url; // The URL to access the uploaded file
          console.log("Access your file here:", publicUrl);
          // You can set state here to display the image or the URL
        } else {
          console.error("Upload failed", response);
        }
      } catch (error) {
        console.error("Error uploading file:", error);
      }

      console.log(params.aid.replace(/%20/g, " "));
      const response2 = await fetch(
        "https://ajsuccic54.execute-api.us-east-1.amazonaws.com/prod/submitAssignment",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            assignment_id: params.aid.replace(/%20/g, " "),
            submission: url,
          }),
        }
      );
      const data = await response2.json();
      data.success
        ? alert("Assignment submitted!")
        : alert("Error submitting assignment");
    } catch (error) {
      console.error("Error getting presigned URL:", error);
    }
  };

  const gradeAssignment = async () => {
    console.log(params.cid.replace(/%20/g, " "));
    console.log(assignmentName);
    const response = await fetch(
      "https://ajsuccic54.execute-api.us-east-1.amazonaws.com/prod/gradeAssignment",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          course_name: params.cid.replace(/%20/g, " "),
          assignment_name: assignmentName,
        }),
      }
    );
    const data = await response.json();
    if (data.message) {
      console.log(data.message);
    } else {
      console.log("success");
    }
  };
  return (
    <main className={outfit.className}>
      <LoggedInNavbar {...outfit} />
      <div className="ml-[15%] mr-[15%] mt-5">
        <a href={`/course/${params.cid}`}>
          <button
            type="button"
            className="mx-auto w-[10%] p-2 rounded-3xl border-none text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 cursor-pointer"
          >
            Back
          </button>
        </a>
        <div className="flex">
          <div className="mt-5 text-3xl">{assignmentName}</div>
          {status && <div className="mt-5 ml-auto text-2xl">{status}</div>}
        </div>
        <div className="mt-10">
          {questions?.map((question) => (
            <div key={question.question_number}>
              <div className="flex">
                <div className="text-xl">
                  Question {question.question_number}
                </div>
                <div className="ml-auto text-xl">{question.Points} Points</div>
              </div>
              <div className="text-xl">{question.content}</div>
              <div className="mb-10">
                <div className="text-xl">Rubric</div>
                {question.rubric}
              </div>
            </div>
          ))}
          {feedback && <div>Feedback: {feedback}</div>}
        </div>
        {role === "teacher" ? (
          <div></div>
        ) : (
          <div className="flex justify-center w-[70%] mx-auto">
            <label
              htmlFor="file-upload"
              className="flex justify-center mx-auto w-[40%] p-2 rounded-3xl border-none text-blue-600 bg-transparent hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 cursor-pointer"
            >
              Upload Submission
              <input
                id="file-upload"
                type="file"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            <button
              onClick={uploadFile}
              className="mx-auto w-[40%] p-2 rounded-3xl border-none text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 cursor-pointer"
            >
              {submission ? "Resubmit" : "Submit"}
            </button>
          </div>
        )}
        {role === "teacher" ? (
          <div className="flex justify-center w-[70%] mx-auto">
            <button
              onClick={gradeAssignment}
              className="mx-auto w-[40%] p-2 rounded-3xl border-none text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 cursor-pointer"
            >
              Grade
            </button>
          </div>
        ) : (
          submission && (
            <div className="">
              <div className="flex justify-center text-3xl mt-10">
                Submission
              </div>
              <img className="w-[60%] mx-auto mb-10" src={submission} />
            </div>
          )
        )}
      </div>
    </main>
  );
}
