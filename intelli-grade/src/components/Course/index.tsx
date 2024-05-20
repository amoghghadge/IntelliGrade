export default function CoursePage(props: any) {
  return (
    <div className="w-[345px] h-[200px] border-[3px] rounded-3xl p-5 border-[#0B6FFF]">
      <div className="text-2xl">{props.courseName}</div>
    </div>
  );
}
