"use client";

import React, { createContext, useState, useContext, useEffect } from "react";

interface AuthContextType {
    isAuthenticated: boolean;
    user: unknown;
    login: (tokens: { access: string; refresh: string }, userData: unknown) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<unknown | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (token) {
            setIsAuthenticated(true);
            setUser(JSON.parse(localStorage.getItem("user") || "{}"));
        }
    }, []);

    const login = (tokens: { access: string; refresh: string }, userData: unknown) => {
        localStorage.setItem("access_token", tokens.access);
        localStorage.setItem("refresh_token", tokens.refresh);
        localStorage.setItem("user", JSON.stringify(userData));
        setIsAuthenticated(true);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
        setIsAuthenticated(false);
        setUser(null);
    };

    return <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
