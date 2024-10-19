import Image from "next/image";
import React from "react";

const Course = () => {
  return (
    <div className="flex justify-center">
      <div className="">
        <div className="flex w-screen justify-center items-center">
          <Image src="/spain-circle.png" width={80} height={50} alt="" />
          <h1 className="mt-2 text-4xl font-sans">Spanish</h1>
        </div>
        <div className="flex justify-center">
          <div className="grid grid-cols-2 w-1/2 space-x-10 mt-10 ">
            <div className="border shadow-lg rounded-lg flex flex-col justify-center items-center p-2">
              <Image src="/classroom.svg" width={150} height={200} alt="" />
              <button className="mt-2 bg-custom-aqua text-white font-bold rounded-full p-2 w-1/2 hover:shadow-lg">
                Continue
              </button>
            </div>
            <div className="border shadow-lg rounded-lg flex flex-col justify-center items-center p-2">
              <Image src="/coffee-shop.svg" width={150} height={200} alt="" />
              <button className="mt-2 bg-custom-aqua text-white font-bold rounded-full p-2 w-1/2 hover:shadow-lg">
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Course;
