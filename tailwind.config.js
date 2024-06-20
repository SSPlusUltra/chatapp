/** @type {import('tailwindcss').Config} */
export default {
  compilerOptions: {
    // ...
    baseUrl: ".",
    paths: {
      "@/*": ["./src/*"],
    },
    // ...
  },
};
