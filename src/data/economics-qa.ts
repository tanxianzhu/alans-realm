export type QuestionGroup = {
  id: string;
  name: string;
};

export type EconomicsQuestion = {
  id: string;
  asker: string;
  text: string;
  groupId: string | null;
};

// Local fallback shown whenever the Feishu build-time credentials are unavailable.
export const questionGroups: QuestionGroup[] = [
  { id: 'learning-play', name: 'Learning & Play' },
  { id: 'value-care', name: 'Value, Cost & Care' },
  { id: 'discussion', name: 'Alan & Joy' },
];

export const economicsQuestions: EconomicsQuestion[] = [
  { id: 'tag-skill', asker: 'Alan', text: 'How to improve my tag skill？ 💪', groupId: 'learning-play' },
  { id: 'win-games', asker: 'Dorothy', text: 'how can I win all the games 🤔', groupId: 'learning-play' },
  { id: 'play-all-day', asker: 'Dylan', text: 'How can I play all day?', groupId: 'learning-play' },
  { id: 'remember-rules', asker: 'Dorothy', text: "How can I learn and remember every game's rules?", groupId: 'learning-play' },
  { id: 'buy-an-ax', asker: 'Dorothy', text: 'Why does Grug have to buy an ax when the price is so high', groupId: 'value-care' },
  { id: 'protect-family', asker: 'Dorothy', text: 'Why does Grug need to protect his whole family from danger all by himself', groupId: 'value-care' },
  { id: 'best-gift', asker: 'Dorothy', text: 'What kind of gift is the best', groupId: 'value-care' },
  { id: 'biggest-cake', asker: 'Dorothy', text: 'How can you decide on the cake when all the people want the biggest one', groupId: 'value-care' },
  { id: 'experience-based', asker: 'Dorothy', text: 'If you have enough money, why would you buy the experience‑based one rather than the cheaper one, even though their sizes are different?', groupId: 'value-care' },
  { id: 'love-studying', asker: 'Joy', text: 'Alan, you’re such a keen learner! Why do you love studying so much?', groupId: 'discussion' },
  { id: 'science-books', asker: 'Joy', text: 'How many science books at home have you finished reading?', groupId: 'discussion' },
];
