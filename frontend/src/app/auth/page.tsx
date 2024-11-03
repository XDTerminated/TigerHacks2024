import { AuthForm } from "@/components/AuthForm";
import { Navbar } from "@/components/NavBar";

export default function AuthPage() {
    return (
        <main className="min-h-screen bg-black">
            <Navbar />
            <AuthForm />
        </main>
    );
}
