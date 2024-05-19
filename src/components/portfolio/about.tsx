import React from "react";
import image from "../../../public/images/rauchg-3d4cecf.gray.jpg";
import Image from "next/image";

const About = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-5">About</h1>
      <div className="flex gap-5">
        <div className="flex flex-col gap-5 text-gray-300">
          <p>
            I’m a software engineer and CEO of Vercel. I’m originally from
            Lanús, Buenos Aires, Argentina. I owe much of my career to the Web
            and Open Source.
          </p>
          <p>
            I spent my early teens advocating for and teaching people how to use
            Linux and later developed a passion for JavaScript and Web
            development.
          </p>
        </div>

        <Image
          src={image}
          alt="Guillermo Rauch"
          width={160}
          height={160}
          className="rounded-full"
        />
      </div>
    </div>
  );
};

export default About;
