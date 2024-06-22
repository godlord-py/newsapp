import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody, CardFooter, Divider, Link, Image} from '@nextui-org/react';
import { FaMapMarkerAlt } from 'react-icons/fa';

interface JobListing {
  id: number;
  title: string;
  company_name: string;
  location: string;
  description: string;
  employment_type: string;
}

const JobList: React.FC = () => {
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const API_TOKEN = "eyJhbGciOiJFZERTQSIsImtpZCI6ImJhZjFmZjU4LTc4YzQtMjM2ZS01NjBmLWRkNDQ4MmU5ZDViMiJ9.eyJhdWQiOiJnaHJjZS5yYWlzb25pLm5ldCIsImV4cCI6MTc1MDUzNzYxMiwiaWF0IjoxNzE4OTgwNjYwLCJpc3MiOiJodHRwczovL29wcy5jb3Jlc2lnbmFsLmNvbTo4MzAwL3YxL2lkZW50aXR5L29pZGMiLCJuYW1lc3BhY2UiOiJyb290IiwicHJlZmVycmVkX3VzZXJuYW1lIjoiZ2hyY2UucmFpc29uaS5uZXQiLCJzdWIiOiJmYTBjNGM5Yy1jMjFjLWZmZGYtYzBiOS00OGFlZDVhZjljMTYiLCJ1c2VyaW5mbyI6eyJzY29wZXMiOiJjZGFwaSJ9fQ.347CspqIdhRG4TjYK-CIBjDFD3JWyEVcp7kDy2iPDo8lU4VkpSGZ5UwChhfUppfXTlpvqLGuygSDzQbQ-q2PCg";

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      // Step 1: Get job IDs (this part seems to be working now)
      const searchUrl = '/api/cdapi/v1/linkedin/job/search/filter';
      const searchData = { "country": "India", "application_active": true };
      const searchResponse = await fetch(searchUrl, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${API_TOKEN}`
        },
        body: JSON.stringify(searchData)
      });
  
      if (!searchResponse.ok) {
        throw new Error(`HTTP error! status: ${searchResponse.status}`);
      }
  
      const searchResult = await searchResponse.json();
      console.log("Search result:", searchResult);
  
      // Step 2: Fetch job details for each ID (limit to 10 for testing)
      const jobIds = searchResult.slice(0, 10);
      const jobDetails = [];
  
      for (const id of jobIds) {
        try {
          const response = await fetch(`/api/cdapi/v1/linkedin/job/collect/${id}`, {
            method: 'GET',
            headers: {
              "Authorization": `Bearer ${API_TOKEN}`
            }
          });
  
          if (!response.ok) {
            const errorText = await response.text();
            console.error(`Error fetching job ${id}:`, errorText);
            continue;  // Skip this job and continue with the next one
          }
  
          const jobData = await response.json();
          jobDetails.push(jobData);
  
          // Add a small delay between requests (500ms)
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
          console.error(`Error fetching job ${id}:`, error);
        }
      }
  
      setJobs(jobDetails);
    } catch (err) {
      setError(`Failed to fetch jobs: ${err.message}`);
      console.error("Full error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  return (
    <div className="p-5">
      <h1 className="text-3xl font-bold mb-5">Job Listings</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <Card key={job.id} className="max-w-[400px] transition duration-500 ease-in-out transform hover:scale-105 hover:shadow-lg hover:rotate-1 z-40">
            <CardHeader className="flex gap-3">
              <Image
                alt="company logo"
                height={40}
                radius="sm"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ75Q9EvClA_AXpsxkvrXrLRQS6iLAI-Y_MV9FKjZDSEw&s"
                width={40}
                className="transition duration-500 ease-in-out transform hover:scale-110 hover:rotate-3"
              />
              <div className="flex flex-col">
                <p className="text-md font-custom3">{job.title}</p>
                <p className="text-small text-default-500">{job.company_name}</p>
              </div>
            </CardHeader>
            <Divider />
            <CardBody className="tracking-wide font-custom1">
              <p>{job.description.slice(0, 200)}...</p>
              <div className="flex items-center mt-3">
                <FaMapMarkerAlt className="text-red-500 mr-2" />
                <span>{job.location}</span>
              </div>
              <span>Employment Type: {job.employment_type}</span>
            </CardBody>
            <Divider />
            <CardFooter>
              <Link
                isExternal
                showAnchorIcon
                href="https://www.google.com"
                className="text-primary hover:text-primary-dark"
              >
                Visit website to apply
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};
export default JobList;