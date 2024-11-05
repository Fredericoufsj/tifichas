/** @type {import('tailwindcss').Config} */
export default {
  content: [    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",],
    theme: {
      extend: {
        colors: {
          lightGray: "#F5F5F5",      // Cinza Claro
          mediumGray: "#E5E5E5",     // Cinza Médio
          darkGray: "#9E9E9E",       // Cinza Escuro
          pureBlack: "#212121",      // Preto
          pureWhite: "#FFFFFF",      // Branco
        },
        fontFamily: {
          header: ["Montserrat", "sans-serif"], // Para títulos e cabeçalhos
          body: ["Roboto", "sans-serif"],       // Para o corpo do texto
        },
      },
    },
    plugins: [],
}

