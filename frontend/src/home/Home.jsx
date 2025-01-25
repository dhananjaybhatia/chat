import MessageContainer from "../home/components/MessageContainer";
import SideBar from "../home/components/SideBar";

export default function Home() {

  return (
    <div className="flex justify-center items-center w-full h-full p-4">
      <div className="flex justify-between w-full h-full max-w-[90%] max-h-[90%] rounded-xl shadow-lg bg-clip-padding bg-purple-500 backdrop-filter backdrop-blur-lg bg-opacity-0 text-purple-950 overflow-hidden">
        {" "}
        <div className="flex-shrink-0 w-[25%] min-w-[300px] border-r border-purple-100">
          <SideBar />
        </div>
        <div className="flex-1 min-w-0">
          <MessageContainer />
        </div>
      </div>
    </div>
  );
}
