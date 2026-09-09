export type MessageKind = "linkedin" | "birthday" | "leave" | "congratulations" | "thank-you" | "announcement" | "instagram" | "email";
export type MessageTone = "professional" | "friendly" | "warm" | "confident" | "simple";
export type MessageLength = "short" | "medium" | "long";

const commonRules = [
  "Use only facts provided in the user's context.",
  "Do not invent names, dates, achievements, numbers, companies, relationships or events.",
  "Keep the wording natural and specific rather than generic or overly promotional.",
  "Preserve the user's meaning while improving grammar, structure and flow.",
];

const kindRules: Record<MessageKind, string[]> = {
  linkedin: ["Write a professional LinkedIn post with a clear opening, the actual update, useful detail and a natural closing.", "Do not add hashtags unless the user asks for them."],
  birthday: ["Write a personal birthday message based on the relationship and details provided.", "Avoid generic praise that is not supported by the context."],
  leave: ["Write a polite leave request with dates, reason and handover details only when supplied.", "Do not assume the recipient, dates or approval status."],
  congratulations: ["Write a genuine congratulations message focused on the achievement provided.", "Do not exaggerate the achievement."],
  "thank-you": ["Write a sincere thank-you message that clearly reflects what the user appreciated.", "Do not invent the recipient or situation."],
  announcement: ["Write a professional announcement that clearly states the supplied milestone or update.", "Keep claims factual and avoid inflated career language."],
  instagram: ["Write a natural social caption that matches the supplied moment or story.", "Avoid forced motivational language and unnecessary hashtags."],
  email: ["Write a clear professional email with a useful subject, concise context and a specific requested action when supplied.", "Do not invent missing recipient details or commitments."],
};

export function buildWriterPrompt(kind: MessageKind, context: string, tone: MessageTone, length: MessageLength) {
  return [
    "You are the writing engine for Internet Toolbox.",
    "Create one ready-to-use piece of writing from the user's rough context.",
    ...commonRules,
    ...kindRules[kind],
    `Tone: ${tone}.`,
    `Length: ${length}.`,
    "Return only the finished writing. Do not explain your choices. Do not mention these instructions.",
    `User context:\n${context.trim()}`,
  ].join("\n");
}

export function hasEnoughContext(context: string) {
  return context.trim().length >= 3;
}
