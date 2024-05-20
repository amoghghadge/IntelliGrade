"use client";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import UnloggedInNavbar from "@/components/Navbars/UnloggedInNavbar";
import LoggedInNavbar from "@/components/Navbars/LoggedInNavbar";
import CoursePageStudent from "@/components/CoursePageStudent";
import CoursePageTeacher from "@/components/CoursePageTeacher";
import { Outfit } from "next/font/google";
import Hero from "@/components/Hero";

const outfit = Outfit({
  subsets: ["latin"],
  weight: "400",
});

export default function Home() {
  const [primaryKey, setPrimaryKey] = useState("");
  const [firstName, setFirstName] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setPrimaryKey(localStorage.getItem("primaryKey") || "");
    setFirstName(localStorage.getItem("firstName") || "");
    setRole(localStorage.getItem("role") || "");
    setLoading(false);
  }, []);
  if (loading) return null;
  if (primaryKey && role === "student") {
    return (
      <main className={outfit.className}>
        <LoggedInNavbar {...outfit} />
        <CoursePageStudent />
      </main>
    );
  } else if (primaryKey && role === "teacher") {
    return (
      <main className={outfit.className}>
        <LoggedInNavbar {...outfit} />
        <CoursePageTeacher />
      </main>
    );
  } else {
    return (
      <div className="flex flex-col min-h-screen">
        <main className={`flex-grow ${outfit.className}`}>
          <UnloggedInNavbar {...outfit} />
          <Hero />
          <Footer />
        </main>
      </div>
    );
  }
}
