// /** @type {import('tailwindcss').Config} */
// import daisyui from "daisyui"; // Import DaisyUI

// export default {
//   content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
//   theme: {
//     extend: {},
//   },
//   plugins: [daisyui], // Use the imported DaisyUI
// };


/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        'custom-bg': "url('/bgImage.avif')", // Add your custom image
      },
    },
  },
  plugins: [daisyui],
};