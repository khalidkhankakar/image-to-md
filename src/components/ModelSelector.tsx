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
        gradient: "from-blue-500 to-cyan-400",
    },
    {
        id: "groq",
        name: "Groq",
        description: "Llama 4 Scout via Groq",
        icon: "⚡",
        gradient: "from-orange-500 to-amber-400",
    },
];

export default function ModelSelector({
    model,
    onModelChange,
}: ModelSelectorProps) {
    return (
        <div id="model-selector" className="flex gap-3">
            {models.map((m) => {
                const isActive = model === m.id;
                return (
                    <button
                        key={m.id}
                        id={`model-${m.id}`}
                        onClick={() => onModelChange(m.id)}
                        className={`
              group flex flex-1 items-center gap-3 rounded-xl border px-4 py-3
              transition-all duration-300 ease-out
              ${isActive
                                ? "border-violet-400/50 bg-violet-500/10 shadow-lg shadow-violet-500/5"
                                : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]"
                            }
            `}
                    >
                        <span
                            className={`
              flex h-10 w-10 items-center justify-center rounded-lg text-lg
              bg-gradient-to-br ${m.gradient}
              ${isActive ? "opacity-100" : "opacity-60 group-hover:opacity-80"}
              transition-opacity duration-300
            `}
                        >
                            {m.icon}
                        </span>
                        <div className="text-left">
                            <p
                                className={`text-sm font-semibold ${isActive ? "text-white" : "text-white/70"}`}
                            >
                                {m.name}
                            </p>
                            <p className="text-xs text-white/40">{m.description}</p>
                        </div>
                    </button>
                );
            })}
        </div>
    );
}
