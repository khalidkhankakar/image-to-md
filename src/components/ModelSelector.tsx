"use client";

interface ModelSelectorProps {
    model: string;
    onModelChange: (model: string) => void;
}

const models = [
    {
        id: "gemini",
        name: "Gemini",
        description: "Google Gemini 2.0 Flash",
        icon: "✦",
        bg: "bg-blue-400",
    },
    {
        id: "groq",
        name: "Groq",
        description: "Llama 4 Scout via Groq",
        icon: "⚡",
        bg: "bg-orange-400",
    },
];

export default function ModelSelector({
    model,
    onModelChange,
}: ModelSelectorProps) {
    return (
        <div id="model-selector" className="flex flex-col sm:flex-row gap-6">
            {models.map((m) => {
                const isActive = model === m.id;
                return (
                    <button
                        key={m.id}
                        id={`model-${m.id}`}
                        onClick={() => onModelChange(m.id)}
                        className={`
              group flex flex-1 items-center gap-4 border-4 border-black px-5 py-4
              transition-all duration-200 ease-out
              ${isActive
                                ? `${m.bg} shadow-none translate-y-2 translate-x-2`
                                : "bg-white shadow-[8px_8px_0_0_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[12px_12px_0_0_rgba(0,0,0,1)] active:translate-y-2 active:translate-x-2 active:shadow-none"
                            }
            `}
                    >
                        <span
                            className={`
              flex h-12 w-12 shrink-0 items-center justify-center border-2 border-black bg-white text-2xl
              shadow-[4px_4px_0_0_rgba(0,0,0,1)] text-black
            `}
                        >
                            {m.icon}
                        </span>
                        <div className="text-left">
                            <p className="text-xl font-black uppercase text-black">
                                {m.name}
                            </p>
                            <p className="text-xs font-bold text-black/80 uppercase tracking-wider">{m.description}</p>
                        </div>
                    </button>
                );
            })}
        </div>
    );
}
