import React from "react";
import { Link } from "react-router-dom";
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
    {
      icon: BsInstagram,
      link: "https://www.instagram.com/your-instagram-handle",
    },
    {
      icon: BsYoutube,
      link: "https://www.youtube.com/channel/your-youtube-channel",
    },
    {
      icon: BsLinkedin,
      link: "https://www.linkedin.com/in/your-linkedin-profile",
    },
    { icon: BsTwitter, link: "https://twitter.com/your-twitter-handle" },
  ];

  return (
    <footer className="bg-gray-900 text-white py-8 z-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">Company Name Here</h2>
            <p className="text-gray-400 mb-4">
              Add a brief company description or mission statement here
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.link}
                  className="text-gray-400 hover:text-white transition-colors"
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={link.icon.name}
                >
                  <link.icon className="w-6 h-6" />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <nav>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    to="/services"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Services
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Contact</h3>
            <p className="text-gray-400 mb-2">
              123 Street
            </p>
            <p className="text-gray-400 mb-2">
              Phone: +91 1234567890
            </p>
            <p className="text-gray-400">Email: info@company.com</p>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-8">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Company Name. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;