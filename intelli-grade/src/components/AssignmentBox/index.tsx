import { useEffect, useState } from "react";

export default function AssignmentBox(props: any) {
  return (
    <div className="flex w-[100%] h-[75px] border-[3px] rounded-3xl p-5 text-sm border-[#0B6FFF] justify-between items-center">
      <div className="w-[17%]">{props.assignmentName}</div>
      <div className="">{props.status}</div>
      <div className="">{props.dueDate}</div>
      <div className="">{props.assignedDate}</div>
    </div>
  );
}
