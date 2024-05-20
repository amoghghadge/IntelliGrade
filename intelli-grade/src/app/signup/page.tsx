import Navbar from "@/components/Navbars/UnloggedInNavbar";
import { Outfit } from "next/font/google";
import SignUpBox from "@/components/SignUpBox";

const outfit = Outfit({
  subsets: ["latin"],
  weight: "400",
});

export default function SignUp() {
  return (
    <>
      <div className={outfit.className}>
        <Navbar {...outfit} />
      </div>
      <div className="mb-[35px]" />
      <SignUpBox />
    </>
  );
}
