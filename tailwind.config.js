
export default {
    content: [
      "./app/**/*.{js,ts,jsx,tsx}",   // Include Next.js App Router (if used)
      "./pages/**/*.{js,ts,jsx,tsx}", // Include pages folder (if used)
      "./components/**/*.{js,ts,jsx,tsx}", // Include your components folder
    ],
    theme: {
      extend: {
        colors: {
          brand: "#1e90ff", // Custom brand color
        },
      },
    },
    plugins: [],
  };
  