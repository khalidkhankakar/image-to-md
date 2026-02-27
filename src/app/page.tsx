"use client";

import { useState, useCallback } from "react";
import ImageUploader from "@/components/ImageUploader";
import ModelSelector from "@/components/ModelSelector";
import MarkdownOutput from "@/components/MarkdownOutput";

export default function Home() {
  const [image, setImage] = useState<File | null>(null);
  const [model, setModel] = useState("gemini");
  const [markdown, setMarkdown] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExtract = useCallback(async () => {
    if (!image) return;

    setIsLoading(true);
    setError(null);
    setMarkdown("");

    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("model", model);

      const res = await fetch("/api/extract", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Extraction failed");
      }

      setMarkdown(data.markdown);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }, [image, model]);

  return (
    <div className="min-h-screen bg-[#09090b]">
      {/* Background gradient */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-1/2 left-1/2 h-[800px] w-[800px] -translate-x-1/2 rounded-full bg-violet-600/8 blur-[120px]" />
        <div className="absolute top-1/3 -right-1/4 h-[600px] w-[600px] rounded-full bg-fuchsia-600/6 blur-[100px]" />
      </div>

      <main className="relative mx-auto max-w-2xl px-5 py-16">
        {/* Header */}
        <header className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/60">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Powered by AI
          </div>
          <h1 className="bg-gradient-to-b from-white to-white/60 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl">
            Image to Markdown
          </h1>
          <p className="mt-3 text-base text-white/40">
            Upload an image and extract its text as clean, structured Markdown.
          </p>
        </header>

        {/* Steps */}
        <div className="flex flex-col gap-8">
          {/* Step 1: Upload */}
          <section>
            <label className="mb-3 flex items-center gap-2 text-sm font-medium text-white/60">
              <span className="flex h-5 w-5 items-center justify-center rounded-md bg-violet-500/20 text-xs text-violet-400">
                1
              </span>
              Upload Image
            </label>
            <ImageUploader onImageSelect={setImage} selectedImage={image} />
          </section>

          {/* Step 2: Select Model */}
          <section>
            <label className="mb-3 flex items-center gap-2 text-sm font-medium text-white/60">
              <span className="flex h-5 w-5 items-center justify-center rounded-md bg-violet-500/20 text-xs text-violet-400">
                2
              </span>
              Select Model
            </label>
            <ModelSelector model={model} onModelChange={setModel} />
          </section>

          {/* Extract Button */}
          <button
            id="extract-button"
            onClick={handleExtract}
            disabled={!image || isLoading}
            className={`
              group relative w-full overflow-hidden rounded-xl px-6 py-3.5 text-sm font-semibold
              transition-all duration-300 ease-out
              ${!image || isLoading
                ? "cursor-not-allowed bg-white/5 text-white/30"
                : "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30 hover:brightness-110 active:scale-[0.98]"
              }
            `}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="h-4 w-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Extracting...
              </span>
            ) : (
              "Extract Markdown"
            )}
          </button>

          {/* Step 3: Output */}
          <section>
            <label className="mb-3 flex items-center gap-2 text-sm font-medium text-white/60">
              <span className="flex h-5 w-5 items-center justify-center rounded-md bg-violet-500/20 text-xs text-violet-400">
                3
              </span>
              Output
            </label>
            <MarkdownOutput
              markdown={markdown}
              isLoading={isLoading}
              error={error}
            />
          </section>
        </div>


      </main>
    </div>
  );
}
