"use client";

import { useAuth } from "../context/AuthContext";
import Link from "next/link";

export const Navbar = () => {
    const { isAuthenticated, logout } = useAuth();

    return (
        <nav className="bg-black p-4">
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-white font-bold text-xl">NutriTrack</div>
                <div className="space-x-4">
                    <Link href="/" className="text-white hover:text-gray-300">
                        Home
                    </Link>
                    <Link href="/about" className="text-white hover:text-gray-300">
                        About
                    </Link>
                    {isAuthenticated ? (
                        <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                            Logout
                        </button>
                    ) : (
                        <Link href="/auth" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};
