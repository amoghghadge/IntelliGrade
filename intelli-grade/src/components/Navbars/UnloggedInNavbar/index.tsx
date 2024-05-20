export default function UnloggedInNavbar(props: { className: string }) {
  return (
    <div className={`h-[100px] bg-[#0B6FFF] ${props.className} text-white`}>
      <div className="flex ml-[15%] h-[100%] mr-[15%]">
        <div className="text-4xl mt-[25px] font-bold">
          <a href="/">IntelliGrade</a>
        </div>
        <div className="text-xl mt-auto mb-auto ml-auto mr-5">
          <a href="/about">about</a>
        </div>
        <div className="text-xl mt-auto mb-auto mr-5">
          <a href="/pricing">pricing</a>
        </div>
        <div className="text-xl mt-auto mb-auto">
          <a href="/signin">sign in</a>
        </div>
      </div>
    </div>
  );
}
