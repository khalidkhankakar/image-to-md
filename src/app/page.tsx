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
    <div className="min-h-screen bg-[#f4f4f0] text-black font-sans selection:bg-pink-300">
      <main className="relative mx-auto max-w-3xl px-5 py-16">
        {/* Header */}
        <header className="mb-14 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border-2 border-black bg-yellow-300 px-5 py-2 text-sm font-bold text-black shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
            <span className="h-3 w-3 rounded-full border border-black bg-green-500 animate-pulse" />
            POWERED BY AI
          </div>
          <h1 className="text-5xl font-black uppercase tracking-tight text-black sm:text-7xl drop-shadow-[4px_4px_0_rgba(0,0,0,1)]">
            Image to
            <br />
            <span className="bg-pink-400 px-4 text-white">Markdown</span>
          </h1>
          <p className="mt-8 text-lg font-bold text-black/80 uppercase">
            Upload an image and extract its text as clean, structured Markdown.
          </p>
        </header>

        {/* Steps */}
        <div className="flex flex-col gap-10">
          {/* Step 1: Upload */}
          <section>
            <label className="mb-3 flex items-center gap-3 text-lg font-black uppercase text-black">
              <span className="flex h-8 w-8 items-center justify-center border-2 border-black bg-pink-400 text-white shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
                1
              </span>
              Upload Image
            </label>
            <ImageUploader onImageSelect={setImage} selectedImage={image} />
          </section>

          {/* Step 2: Select Model */}
          <section>
            <label className="mb-3 flex items-center gap-3 text-lg font-black uppercase text-black">
              <span className="flex h-8 w-8 items-center justify-center border-2 border-black bg-cyan-400 text-black shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
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
              group relative w-full overflow-hidden border-4 border-black px-6 py-4 text-xl font-black uppercase tracking-wider
              transition-all duration-200 ease-out
              ${!image || isLoading
                ? "cursor-not-allowed bg-gray-300 text-gray-500 shadow-none border-gray-400"
                : "bg-green-400 text-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[12px_12px_0_0_rgba(0,0,0,1)] active:translate-y-2 active:translate-x-2 active:shadow-none"
              }
            `}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-3">
                <svg
                  className="h-6 w-6 animate-spin"
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
                EXTRACTING...
              </span>
            ) : (
              "Extract Markdown"
            )}
          </button>

          {/* Step 3: Output */}
          <section>
            <label className="mb-3 flex items-center gap-3 text-lg font-black uppercase text-black">
              <span className="flex h-8 w-8 items-center justify-center border-2 border-black bg-yellow-400 text-black shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
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
