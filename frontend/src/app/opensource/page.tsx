import React from "react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";

function page() {
  return (
    <div className="flex flex-col overflow-hidden bg-black">
      <ContainerScroll
        titleComponent={
          <h1 className="text-4xl font-semibold text-white">
            DevTrack <br />
            <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">
              Open Source Tracker
            </span>
          </h1>
        }
      >
        <img
          src="/opensource.png"
          alt="opensource"
          className="mx-auto rounded-2xl object-cover h-full object-left-top"
          draggable={false}
        />
      </ContainerScroll>
    </div>
  );
}

export default page;