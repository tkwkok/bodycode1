// This is a placeholder for the actual Chat type from the @google/genai library.
// We use `any` to avoid complex type declarations in this context,
// but in a full-fledged project, you might want to define this more accurately.
export type Chat = any;

export interface Message {
  role: 'user' | 'bot';
  text: string;
}
