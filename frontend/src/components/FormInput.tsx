import { ReactNode } from "react";

interface FormInputProps {
    label: string;
    type: string;
    placeholder: string;
    icon: ReactNode;
}

export function FormInput({ label, type, placeholder, icon }: FormInputProps) {
    return (
        <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">{label}</label>
            <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">{icon}</div>
                <input type={type} className="w-full bg-gray-800 text-white rounded-lg pl-10 pr-4 py-3 border border-gray-700 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors" placeholder={placeholder} />
            </div>
        </div>
    );
}
