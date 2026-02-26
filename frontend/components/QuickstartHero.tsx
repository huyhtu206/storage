import React from 'react';
import { CodeBlock } from './CodeBlock';

// --- Quickstart Hero ---
export const QuickstartHero: React.FC = () => {
    return (
        <div className="relative w-full rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border)] overflow-hidden mb-12 flex flex-col md:flex-row">
            <div className="flex-1 p-8 md:p-12 z-10">
                <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-4">Developer quickstart</h2>
                <p className="text-[var(--text-secondary)] text-lg max-w-md mb-8">Make your first API request in minutes. Learn the basics of the OpenAI platform.</p>
                <button className="bg-[var(--text-primary)] text-[var(--bg-primary)] px-6 py-2.5 rounded-full font-semibold hover:opacity-80 transition-all font-sans">
                    Get started
                </button>
            </div>
            <div className="flex-1 min-h-[300px] bg-[var(--bg-primary)] p-4 flex flex-col justify-center">
                <CodeBlock
                    language="javascript"
                    code={`import OpenAI from "openai";
const client = new OpenAI();

const response = await client.responses.create({
  model: "gpt-5.2",
  input: "Write a short bedtime story about a unicorn."
});

console.log(response.output_text);`}
                />
            </div>
        </div>
    );
};
