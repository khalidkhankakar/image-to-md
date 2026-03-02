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
        [onImageSelect]
    );

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setIsDragging(false);
            const file = e.dataTransfer.files[0];
            if (file) handleFile(file);
        },
        [handleFile]
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
        relative cursor-pointer border-4 border-black bg-white
        transition-all duration-200 ease-out p-8
        ${isDragging || preview
                    ? "shadow-[inset_0_0_0_4px_rgba(0,0,0,1)] bg-purple-100"
                    : "shadow-[8px_8px_0_0_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[12px_12px_0_0_rgba(0,0,0,1)] active:translate-x-2 active:translate-y-2 active:shadow-none"
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
                <div className="relative">
                    <img
                        src={preview}
                        alt="Uploaded preview"
                        className="mx-auto max-h-64 border-4 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] object-contain bg-white"
                    />
                    <div className="mt-6 text-center">
                        <p className="text-sm font-black uppercase tracking-wider text-black border-2 border-black inline-block px-4 py-2 bg-yellow-300 shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
                            {selectedImage?.name}
                        </p>
                    </div>
                    <button
                        onClick={handleRemove}
                        className="absolute -top-4 -right-4 flex h-10 w-10 items-center justify-center border-2 border-black bg-red-500 text-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] transition-all hover:bg-red-600 hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none"
                        aria-label="Remove image"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            ) : (
                <div className="flex flex-col items-center gap-6">
                    <div className="flex h-20 w-20 items-center justify-center border-4 border-black bg-purple-400 shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
                        <svg
                            className="h-10 w-10 text-black"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={3}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                            />
                        </svg>
                    </div>
                    <div className="text-center">
                        <p className="text-xl font-black uppercase text-black">
                            Drop image here or <span className="bg-pink-400 text-black border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] px-3 py-1 ml-1 transform inline-block -rotate-2">Browse</span>
                        </p>
                        <p className="mt-4 text-sm font-bold text-black/60 uppercase tracking-widest">
                            PNG, JPG, WEBP up to 10 MB
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
