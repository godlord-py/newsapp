import React from "react";
import { Card, CardHeader, CardBody, CardFooter, Divider, Link, Image } from "@nextui-org/react";

export default function JobCard({ title, company, description, logoUrl, applyUrl }) {
  return (
    <Card className="max-w-[400px] transition duration-500 ease-in-out transform hover:scale-105 hover:shadow-lg hover:rotate-1 z-40">
      <CardHeader className="flex gap-3">
        <Image
          alt={`${company} logo`}
          height={40}
          radius="sm"
          src={logoUrl}
          width={40}
          className="transition duration-500 ease-in-out transform hover:scale-110 hover:rotate-3"
        />
        <div className="flex flex-col">
          <p className="text-md font-custom3">{title}</p>
          <p className="text-small text-default-500">{company}</p>
        </div>
      </CardHeader>
      <Divider />
      <CardBody className="tracking-wide font-custom1">
        <p>{description}</p>
      </CardBody>
      <Divider />
      <CardFooter>
        <Link
          isExternal
          showAnchorIcon
          href={applyUrl}
          className="text-primary hover:text-primary-dark"
        >
          Visit website to apply
        </Link>
      </CardFooter>
    </Card>
  );
}