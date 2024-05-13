import React from "react";
import '/src/styles/footer.css';
import {
  BsDiscord,
  BsGithub,
  BsInstagram,
  BsYoutube,
  BsLinkedin,
  BsTwitter,
} from "react-icons/bs";

function Footer() {
  const socialLinks = [
    { icon: BsDiscord, link: "https://discord.gg/your-discord-server" },
    { icon: BsGithub, link: "https://github.com/godlord-py/" },
    { icon: BsInstagram, link: "https://www.instagram.com/your-instagram-handle" },
    { icon: BsYoutube, link: "https://www.youtube.com/channel/your-youtube-channel" },
    { icon: BsLinkedin, link: "https://www.linkedin.com/in/your-linkedin-profile" },
    { icon: BsTwitter, link: "https://twitter.com/your-twitter-handle" },
  ];

  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:justify-between">
          <div className="w-full md:w-1/3 mb-8 md:mb-0">
            <h2 className="text-2xl font-bold mb-4">Company Name Here</h2>
            <p className="text-sm">
               Add a brief company description or mission statement here 
            </p>
          </div>
          <div className="w-full md:w-1/3 mb-8 md:mb-0">
            <h3 className="text-xl font-bold mb-4">©2024</h3>
            <p className="text-sm">All rights reserved.</p>
          </div>
          <div className="w-full md:w-1/3 flex justify-end">
            {socialLinks.map((link, index) => (
              <a
                key={index}
                href={link.link}
                className="text-white hover:text-blue-300 ml-4"
                target="_blank"
                rel="noreferrer noopener"
                aria-label={link.icon.name}
              >
                {link.icon({})}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
