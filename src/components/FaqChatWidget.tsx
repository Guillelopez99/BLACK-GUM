"use client";

import { useEffect, useRef, useState } from "react";
import { faqEntries } from "@/data/faq";

type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

const quickQuestions = [
  "¿Qué servicios ofrecen?",
  "¿Cuánto cuesta un proyecto?",
  "¿En cuánto tiempo entregan?",
  "¿Dónde están ubicados?"
];

const normalizeText = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const buildTokenSet = (value: string) =>
  new Set(normalizeText(value).split(" ").filter((token) => token.length > 2));

const entryIndex = faqEntries.map((entry) => {
  const keywordText = entry.keywords ? entry.keywords.join(" ") : "";
  const tokens = buildTokenSet(`${entry.question} ${keywordText}`);
  return { entry, tokens };
});

const getBestAnswer = (question: string) => {
  const tokens = buildTokenSet(question);
  let bestScore = 0;
  let bestEntry = null as (typeof entryIndex)[number] | null;

  for (const candidate of entryIndex) {
    let score = 0;
    tokens.forEach((token) => {
      if (candidate.tokens.has(token)) {
        score += 1;
      }
    });

    if (score > bestScore) {
      bestScore = score;
      bestEntry = candidate;
    }
  }

  if (!bestEntry || bestScore === 0) {
    return "No tengo esa respuesta aún. Puedes escribirnos desde la página de contacto y lo resolvemos rápido.";
  }

  return bestEntry.entry.answer;
};

export default function FaqChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      text: "Hola. Puedo ayudarte con preguntas frecuentes sobre servicios, precios y tiempos."
    }
  ]);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth"
    });
  }, [messages, isOpen]);

  const handleSend = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) {
      return;
    }
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      text: trimmed
    };
    const assistantMessage: Message = {
      id: `assistant-${Date.now() + 1}`,
      role: "assistant",
      text: getBestAnswer(trimmed)
    };
    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setInput("");
  };

  const panelState = isOpen
    ? "opacity-100 translate-y-0 pointer-events-auto"
    : "opacity-0 translate-y-3 pointer-events-none";

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div
        className={`absolute bottom-14 right-0 w-[calc(100vw-2rem)] sm:w-[360px] ${panelState} transition-all duration-300`}
      >
        <div className="rounded-2xl border border-white/10 bg-ink/90 shadow-soft backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-ember font-semibold">
                En diario, estudio
              </p>
              <p className="text-lg font-display text-bone">Dudas rápidas</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-bone/60 hover:text-bone transition-colors"
              aria-label="Cerrar chat"
            >
              ×
            </button>
          </div>

          <div ref={listRef} className="max-h-[340px] overflow-y-auto px-4 py-4">
            <div className="space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                      message.role === "user"
                        ? "bg-ember text-ink"
                        : "bg-white/10 text-bone"
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-white/10 px-4 py-3">
            <div className="flex flex-wrap gap-2 pb-3">
              {quickQuestions.map((question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => handleSend(question)}
                  className="rounded-full border border-white/10 px-3 py-1 text-xs text-bone/80 hover:border-ember hover:text-bone transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
            <form
              className="flex items-center gap-2"
              onSubmit={(event) => {
                event.preventDefault();
                handleSend(input);
              }}
            >
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Escribe tu duda..."
                className="flex-1 rounded-full border border-white/10 bg-black/40 px-4 py-2 text-sm text-bone placeholder:text-bone/40 focus:outline-none focus:ring-2 focus:ring-ember/60"
              />
              <button
                type="submit"
                className="rounded-full bg-ember px-4 py-2 text-sm font-semibold text-ink hover:bg-ember/90 transition-colors"
              >
                Enviar
              </button>
            </form>
          </div>
        </div>
      </div>

      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-full bg-ember px-5 py-3 text-sm font-semibold text-ink shadow-glow transition-transform hover:-translate-y-0.5"
        aria-expanded={isOpen}
      >
        {isOpen ? "Cerrar" : "Preguntas"}
      </button>
    </div>
  );
}
