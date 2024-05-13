import React from "react";
import {Card, CardHeader, CardBody, CardFooter, Divider, Link, Image} from "@nextui-org/react";

export default function App() {
  return (
    <Card className="max-w-[400px]">
      <CardHeader className="flex gap-3">
        <Image
          alt="nextui logo"
          height={40}
          radius="sm"
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ75Q9EvClA_AXpsxkvrXrLRQS6iLAI-Y_MV9FKjZDSEw&s"
          width={40}
        />
        <div className="flex flex-col">
          <p className="text-md">React Js Intern Needed</p>
          <p className="text-small text-default-500">jobwebsite.org</p>
        </div>
      </CardHeader>
      <Divider/>
      <CardBody>
        <p>Need React js Intern with good knowledge of DOM Manipulation, react-router-dom, React State, React Components, React Redux, etc.</p>
      </CardBody>
      <Divider/>
      <CardFooter>
        <Link
          isExternal
          showAnchorIcon
          href="https://www.google.com"
        >
          Visit website to apply
        </Link>
      </CardFooter>
    </Card>
  );
}
