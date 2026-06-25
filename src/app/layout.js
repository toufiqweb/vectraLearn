import { Outfit } from "next/font/google";
import "./globals.css";
import { CourseProvider } from "@/lib/context/CourseProvider";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

const OutfitFont = Outfit({
  subsets: ["latin"],
});

export const metadata = {
  title: "Skill Sphere",
  description:
    "Skill Sphere is an online learning platform to explore courses, improve skills, and grow your career.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${OutfitFont.className} h-full antialiased`}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main>
            <CourseProvider>{children}</CourseProvider>
          </main>

          <ToastContainer position="top-center" theme="colored" />
        </ThemeProvider>
      </body>
    </html>
  );
}
