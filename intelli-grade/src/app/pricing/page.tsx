import Navbar from "@/components/Navbars/UnloggedInNavbar";
import { Outfit } from "next/font/google";

const outfit = Outfit({
  subsets: ["latin"],
  weight: "400",
});

export default function Pricing() {
  return (
    <main className={outfit.className}>
      <Navbar {...outfit} />
      <div className="ml-[15%] mr-[15%] mt-5">
        <h1 className="text-4xl font-bold text-center">Pricing</h1>
        <p className="text-center mt-5 text-lg">
          HooGrades is free for all users. No credit card required.
        </p>
        <div className="flex justify-center mt-10">
          <div className="">
            <a
              href="/signup"
              className="bg-[#0B6FFF] text-white p-5 rounded-3xl w-[50%]"
            >
              Get started for free
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
