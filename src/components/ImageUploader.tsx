"use client";

import { useCallback, useState, useRef } from "react";

interface ImageUploaderProps {
    onImageSelect: (file: File) => void;
    selectedImage: File | null;
}

export default function ImageUploader({
    onImageSelect,
    selectedImage,
}: ImageUploaderProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFile = useCallback(
        (file: File) => {
            if (!file.type.startsWith("image/")) return;
            if (file.size > 10 * 1024 * 1024) {
                alert("File must be under 10 MB");
                return;
            }
            onImageSelect(file);
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result as string);
            reader.readAsDataURL(file);
        },
        [onImageSelect],
    );

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setIsDragging(false);
            const file = e.dataTransfer.files[0];
            if (file) handleFile(file);
        },
        [handleFile],
    );

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleClick = () => inputRef.current?.click();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
    };

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        setPreview(null);
        onImageSelect(null as unknown as File);
        if (inputRef.current) inputRef.current.value = "";
    };

    return (
        <div
            id="image-uploader"
            onClick={handleClick}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`
        relative cursor-pointer rounded-2xl border-2 border-dashed
        transition-all duration-300 ease-out
        ${isDragging
                    ? "border-violet-400 bg-violet-500/10 scale-[1.02]"
                    : preview
                        ? "border-white/20 bg-white/5"
                        : "border-white/10 bg-white/[0.03] hover:border-violet-400/50 hover:bg-white/[0.06]"
                }
      `}
        >
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
                id="image-input"
            />

            {preview ? (
                <div className="relative p-4">
                    <img
                        src={preview}
                        alt="Uploaded preview"
                        className="mx-auto max-h-64 rounded-xl object-contain"
                    />
                    <p className="mt-3 text-center text-sm text-white/50">
                        {selectedImage?.name}
                    </p>
                    <button
                        onClick={handleRemove}
                        className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/60 transition-colors hover:bg-red-500/20 hover:text-red-400"
                        aria-label="Remove image"
                    >
                        ✕
                    </button>
                </div>
            ) : (
                <div className="flex flex-col items-center gap-4 px-8 py-12">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20">
                        <svg
                            className="h-8 w-8 text-violet-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.5}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                            />
                        </svg>
                    </div>
                    <div className="text-center">
                        <p className="text-base font-medium text-white/80">
                            Drop your image here, or{" "}
                            <span className="text-violet-400">browse</span>
                        </p>
                        <p className="mt-1 text-sm text-white/40">
                            PNG, JPG, WEBP up to 10 MB
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
