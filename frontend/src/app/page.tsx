import { Demo } from "@/components/Demo";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Navbar } from "@/components/NavBar";
import React from "react";

export default function Home() {
    return (
        <main className="min-h-screen bg-black">
            <Navbar />
            <Hero />
            <About />
            <Demo />
        </main>
    );
}
