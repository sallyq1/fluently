import React from "react";
import Image from "next/image";

const languages = [
  { name: "Spanish", image: "/spain-circle.png" },
  { name: "French", image: "/france.png" },
  { name: "German", image: "/germany.png" },
  { name: "Italian", image: "/italy.png" },
  { name: "Japanese", image: "/japan.png" },
  { name: "Chinese", image: "/china.png" },
];

const Courses = () => {
  return (
    <div className="m-5">
      <h1 className="text-3xl font-bold mb-5">Courses</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {languages.map((language) => (
          <div
            key={language.name}
            className="flex p-3 flex-col items-center border shadow-lg shadow-emerald-200 hover:border-2 hover:border-emerald-200 rounded-xl w-80"
          >
            <div className="flex p-3 items-center justify-center w-full">
              <Image
                src={language.image}
                width={80}
                height={80}
                alt={language.name}
                className="rounded-full"
              />
              <h1 className="mt-2 text-4xl font-sans ml-4">{language.name}</h1>
            </div>


            <a href="/pages/course" className="">
              <button className="mt-2 bg-custom-aqua text-white font-bold rounded-full p-2 w-56  hover:shadow-lg">
                Continue
              </button>
            </a>


          </div>
        ))}
      </div>
    </div>
  );
};

export default Courses;
