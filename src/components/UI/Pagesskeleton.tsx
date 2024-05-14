import React from "react";
import { Card, Skeleton } from "@nextui-org/react";

const PagesSkeleton = ({ numPublications = 4 }) => {
  return (
    <div className="grid mt-36 ml-20 mr-20 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
      {Array.from({ length: numPublications }).map((_, index) => (
        <Card
          key={index}
          className="w-[320px] h-[500px] space-y-1 p-2"
          radius="lg"
        >
          <Skeleton className="rounded-lg h-[580px]">
            <div className="h-24 rounded-lg bg-default-300"></div>
          </Skeleton>
        </Card>
      ))}
    </div>
  );
};

export default PagesSkeleton;