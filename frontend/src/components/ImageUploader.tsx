import { useState, useCallback } from "react";
import { X, Image as ImageIcon, Loader2 } from "lucide-react";
import Image from "next/image";

interface ImageUploaderProps {
    isLoading: boolean;
    error: string | null;
    imageData: string | null;
    onImageUpload: (file: File) => void;
    onImageRemove: () => void;
}

const CORS_PROXY = "https://corsproxy.io/?";

export function ImageUploader({ isLoading, error, imageData, onImageUpload, onImageRemove }: ImageUploaderProps) {
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            if (imageData || isLoading) return;

            if (e.type === "dragenter" || e.type === "dragover") {
                setDragActive(true);
            } else if (e.type === "dragleave") {
                setDragActive(false);
            }
        },
        [imageData, isLoading]
    );

    const processImageUrl = useCallback(
        async (url: string) => {
            try {
                const response = await fetch(CORS_PROXY + encodeURIComponent(url));
                if (!response.ok) throw new Error("Failed to fetch image");
                const blob = await response.blob();
                const file = new File([blob], "image.jpg", { type: blob.type });
                onImageUpload(file);
            } catch (error) {
                console.error("Error processing image URL:", error);
            }
        },
        [onImageUpload]
    );

    const handleDrop = useCallback(
        async (e: React.DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            if (imageData || isLoading) return;

            setDragActive(false);

            // Handle URL drops
            const url = e.dataTransfer.getData("text/uri-list") || e.dataTransfer.getData("text/plain");
            if (url && url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
                await processImageUrl(url);
                return;
            }

            // Handle file drops
            const file = e.dataTransfer.files?.[0];
            if (file) {
                onImageUpload(file);
            }
        },
        [imageData, isLoading, onImageUpload, processImageUrl]
    );

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            e.preventDefault();
            if (e.target.files?.[0]) {
                onImageUpload(e.target.files[0]);
            }
        },
        [onImageUpload]
    );

    return (
        <div
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors 
            ${imageData ? "border-gray-700" : error ? (dragActive ? "border-red-500 bg-red-500/20" : "border-red-400 bg-red-400/10") : dragActive ? "border-sky-400 bg-sky-400/10" : "border-gray-700"}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
        >
            {isLoading ? (
                <div className="flex flex-col items-center justify-center">
                    <Loader2 className="h-12 w-12 text-sky-400 animate-spin mb-4" />
                    <p className="text-gray-400">Processing your image...</p>
                </div>
            ) : imageData ? (
                <div className="relative inline-block">
                    <Image src={imageData} alt="Uploaded food" className="max-h-64 rounded-lg" width={256} height={256} />
                    <button onClick={onImageRemove} className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 hover:bg-red-600 transition-colors">
                        <X className="h-4 w-4 text-white" />
                    </button>
                </div>
            ) : (
                <>
                    <ImageIcon className={`h-12 w-12 mx-auto mb-4 ${error ? "text-red-500" : "text-sky-400"}`} />
                    <p className={`mb-4 ${error ? "text-red-500 font-medium" : "text-gray-400"}`}>{error || "Drag and drop your image or URL here, or click to browse"}</p>
                    <label className={`px-6 py-2 rounded-lg transition-colors cursor-pointer inline-block ${error ? "bg-red-500 hover:bg-red-600 text-white" : "bg-sky-600 hover:bg-sky-700 text-white"}`}>
                        Upload Image
                        <input type="file" className="hidden" accept="image/*" onChange={handleChange} />
                    </label>
                </>
            )}
        </div>
    );
}
