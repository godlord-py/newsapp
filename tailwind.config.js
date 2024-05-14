/** @type {import('tailwindcss').Config} */
import { nextui } from "@nextui-org/react";
import { violet} from "@radix-ui/colors";
export default {
  content: [ "./index.html",
  "./src/**/*.{js,ts,jsx,tsx}",
  "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ...violet,
      },
      fontFamily: {
        custom: ['Poetsen One'],
        custom2: ['Raleway'],
        custom3: ['Noto Serif'],
      }
    },
  },
  darkMode: "class",
  plugins: [nextui()],
}

