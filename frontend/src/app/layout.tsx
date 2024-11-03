import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
    title: "NutriLens",
    description: "NutriLens uses cutting-edge AI to make nutrition tracking effortless",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                <AuthProvider>
                    {children}
                    <Toaster position="top-right" />
                </AuthProvider>
            </body>
        </html>
    );
}
