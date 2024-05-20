export default function SignInNavbar(props: { className: string }) {
  return (
    <div className={`h-[100px] bg-[#0B6FFF] ${props.className} text-white`}>
      <div className="flex ml-[15%] h-[100%]">
        <div className="text-4xl mt-[25px] font-bold">
          <a href="/">IntelliGrade</a>
        </div>
      </div>
    </div>
  );
}
