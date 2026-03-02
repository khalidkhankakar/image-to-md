"use client";

import { useState, useCallback } from "react";

interface MarkdownOutputProps {
    markdown: string;
    isLoading: boolean;
    error: string | null;
}

export default function MarkdownOutput({
    markdown,
    isLoading,
    error,
}: MarkdownOutputProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(markdown);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Fallback for older browsers
            const textarea = document.createElement("textarea");
            textarea.value = markdown;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand("copy");
            document.body.removeChild(textarea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    }, [markdown]);

    if (isLoading) {
        return (
            <div
                id="markdown-output-loading"
                className="flex flex-col items-center justify-center gap-6 border-4 border-black bg-yellow-300 px-8 py-20 shadow-[8px_8px_0_0_rgba(0,0,0,1)]"
            >
                <div className="relative h-16 w-16">
                    <div className="absolute inset-0 animate-spin border-4 border-black border-t-white" />
                </div>
                <p className="text-xl font-black uppercase tracking-wider text-black animate-pulse">
                    EXTRACTING TEXT...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div
                id="markdown-output-error"
                className="border-4 border-black bg-red-400 px-8 py-8 shadow-[8px_8px_0_0_rgba(0,0,0,1)]"
            >
                <div className="flex flex-col sm:flex-row items-start gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center border-4 border-black bg-white text-2xl font-black shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
                        !
                    </span>
                    <div>
                        <p className="text-2xl font-black uppercase text-black">
                            EXTRACTION FAILED
                        </p>
                        <p className="mt-3 text-sm font-bold text-black border-2 border-black bg-white px-4 py-3 shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
                            {error}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (!markdown) {
        return (
            <div
                id="markdown-output-empty"
                className="flex flex-col items-center justify-center gap-6 border-4 border-black bg-white px-8 py-20 shadow-[8px_8px_0_0_rgba(0,0,0,1)]"
            >
                <div className="flex h-20 w-20 items-center justify-center border-4 border-black bg-gray-200 shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
                    <svg
                        className="h-10 w-10 text-black"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                        />
                    </svg>
                </div>
                <p className="text-lg font-black uppercase tracking-wide text-black/40">
                    YOUR MARKDOWN WILL APPEAR HERE
                </p>
            </div>
        );
    }

    return (
        <div
            id="markdown-output"
            className="relative border-4 border-black bg-white shadow-[8px_8px_0_0_rgba(0,0,0,1)]"
        >
            {/* Header */}
            <div className="flex items-center justify-between border-b-4 border-black bg-purple-300 px-6 py-4">
                <div className="flex items-center gap-4">
                    <div className="flex gap-2">
                        <div className="h-4 w-4 border-2 border-black bg-pink-400 shadow-[2px_2px_0_0_rgba(0,0,0,1)]" />
                        <div className="h-4 w-4 border-2 border-black bg-yellow-400 shadow-[2px_2px_0_0_rgba(0,0,0,1)]" />
                        <div className="h-4 w-4 border-2 border-black bg-green-400 shadow-[2px_2px_0_0_rgba(0,0,0,1)]" />
                    </div>
                    <span className="font-black uppercase tracking-wider text-black text-xl hidden sm:block">
                        RESULT.MD
                    </span>
                </div>
                <button
                    id="copy-button"
                    onClick={handleCopy}
                    className={`
            flex items-center gap-2 border-2 border-black px-4 py-2 text-sm font-black uppercase tracking-wider
            transition-all duration-200 ease-out
            ${copied
                            ? "bg-green-400 text-black shadow-none translate-y-1 translate-x-1"
                            : "bg-white text-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1 active:shadow-none"
                        }
          `}
                >
                    {copied ? (
                        <>
                            <svg
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={3}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M4.5 12.75l6 6 9-13.5"
                                />
                            </svg>
                            COPIED!
                        </>
                    ) : (
                        <>
                            <svg
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
                                />
                            </svg>
                            COPY text
                        </>
                    )}
                </button>
            </div>

            {/* Code block */}
            <div className="overflow-auto p-6 bg-yellow-50 min-h-[300px]">
                <pre className="text-base font-bold leading-relaxed text-black whitespace-pre-wrap break-words font-mono">
                    {markdown}
                </pre>
            </div>
        </div>
    );
}
