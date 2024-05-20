import svg from "../../../public/illustration-abb1.svg";
import Image from "next/image";

export default function Hero() {
  return (
    <div className="flex items-center justify-center h-[100vh] bg-[#F0F0F0]">
      <div className="ml-[15%] mr-[15%] mt-[-10%]">
        <div className="flex flex-col items-center">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-[#0B6FFF] text-5xl font-bold">
                Welcome to IntelliGrade
              </h1>
              <p className="text-[#0B6FFF] text-xl">
                The best place grade your assignments
              </p>
              <a href="/signin">
                <div className="mt-2 flex justify-center items-center w-[50%] p-2 rounded-3xl border-none text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 cursor-pointer">
                  Join now
                </div>
              </a>
            </div>
            <Image src={svg} alt="illustration" width={400} height={400} />
          </div>
        </div>
      </div>
    </div>
  );
}
