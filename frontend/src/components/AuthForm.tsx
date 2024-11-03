// frontend/src/components/AuthForm.tsx
"use client";

import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation"; // Changed from next/router
import toast from "react-hot-toast";

export const AuthForm = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const endpoint = isLogin ? "/token/" : "/register/";

        try {
            const response = await fetch(`http://localhost:8000${endpoint}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(isLogin ? { username, password } : { username, password, email }),
            });

            const data = await response.json();

            if (response.ok) {
                login({ access: data.access, refresh: data.refresh }, isLogin ? { username } : data.user);
                toast.success(isLogin ? "Successfully logged in!" : "Account created successfully!");
                router.push("/");
                router.refresh(); // Add refresh to update the UI
            } else {
                toast.error(data.detail || "Authentication failed");
            }
        } catch (error) {
            console.error("Auth error:", error);
            toast.error("Authentication failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">{isLogin ? "Welcome Back" : "Create Account"}</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Username</label>
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" placeholder="Enter your username" required />
                    </div>

                    {!isLogin && (
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" placeholder="Enter your email" required />
                        </div>
                    )}

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" placeholder="Enter your password" required />
                    </div>

                    <button type="submit" className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-200">
                        {isLogin ? "Login" : "Register"}
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <button onClick={() => setIsLogin(!isLogin)} className="text-blue-500 hover:text-blue-600">
                        {isLogin ? "Need an account? Register" : "Have an account? Login"}
                    </button>
                </div>
            </div>
        </div>
    );
};
