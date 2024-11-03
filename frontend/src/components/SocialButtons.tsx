import { Github, Twitter, Chrome } from "lucide-react";

export function SocialButtons() {
    return (
        <div className="mt-8">
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-gray-900 text-gray-400">Or continue with</span>
                </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
                <button className="flex justify-center items-center py-2.5 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors">
                    <Chrome className="h-5 w-5 text-gray-400" />
                </button>
                <button className="flex justify-center items-center py-2.5 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors">
                    <Github className="h-5 w-5 text-gray-400" />
                </button>
                <button className="flex justify-center items-center py-2.5 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors">
                    <Twitter className="h-5 w-5 text-gray-400" />
                </button>
            </div>
        </div>
    );
}
