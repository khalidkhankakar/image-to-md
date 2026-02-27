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
                className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] px-8 py-16"
            >
                <div className="relative h-12 w-12">
                    <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-violet-400" />
                    <div className="absolute inset-1.5 animate-spin rounded-full border-2 border-transparent border-t-fuchsia-400 [animation-direction:reverse] [animation-duration:1.5s]" />
                </div>
                <p className="text-sm text-white/50 animate-pulse">
                    Extracting text from image...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div
                id="markdown-output-error"
                className="rounded-2xl border border-red-500/20 bg-red-500/5 px-6 py-5"
            >
                <div className="flex items-start gap-3">
                    <span className="mt-0.5 text-red-400">⚠</span>
                    <div>
                        <p className="text-sm font-medium text-red-400">
                            Extraction Failed
                        </p>
                        <p className="mt-1 text-sm text-red-300/70">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!markdown) {
        return (
            <div
                id="markdown-output-empty"
                className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-8 py-16"
            >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5">
                    <svg
                        className="h-6 w-6 text-white/20"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                        />
                    </svg>
                </div>
                <p className="text-sm text-white/30">
                    Your extracted Markdown will appear here
                </p>
            </div>
        );
    }

    return (
        <div
            id="markdown-output"
            className="relative rounded-2xl border border-white/10 bg-white/[0.03]"
        >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
                <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-500/60" />
                    <div className="h-3 w-3 rounded-full bg-yellow-500/60" />
                    <div className="h-3 w-3 rounded-full bg-green-500/60" />
                    <span className="ml-2 text-xs text-white/40">output.md</span>
                </div>
                <button
                    id="copy-button"
                    onClick={handleCopy}
                    className={`
            flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium
            transition-all duration-300 ease-out
            ${copied
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/80"
                        }
          `}
                >
                    {copied ? (
                        <>
                            <svg
                                className="h-3.5 w-3.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M4.5 12.75l6 6 9-13.5"
                                />
                            </svg>
                            Copied!
                        </>
                    ) : (
                        <>
                            <svg
                                className="h-3.5 w-3.5"
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
                            Copy
                        </>
                    )}
                </button>
            </div>

            {/* Code block */}
            <div className="overflow-auto p-5">
                <pre className="text-sm leading-relaxed text-white/80 whitespace-pre-wrap break-words font-mono">
                    {markdown}
                </pre>
            </div>
        </div>
    );
}
