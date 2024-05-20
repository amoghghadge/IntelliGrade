import Navbar from "@/components/Navbars/UnloggedInNavbar";
import { Outfit } from "next/font/google";

const outfit = Outfit({
  subsets: ["latin"],
  weight: "400",
});

export default function Contact() {
  return (
    <main className={outfit.className}>
      <Navbar {...outfit} />
      about
    </main>
  );
}
