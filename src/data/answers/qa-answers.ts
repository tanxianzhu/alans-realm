import playAllDayTranscript from '../transcripts/play-all-day.md?raw';
import loveStudyingTranscript from '../transcripts/love-studying.md?raw';
import rememberRulesTranscript from '../transcripts/remember-rules.md?raw';
import scienceBooksTranscript from '../transcripts/science-books.md?raw';
import tagSkillTranscript from '../transcripts/tag-skill.md?raw';
import winGamesTranscript from '../transcripts/win-games.md?raw';

export type QaAnswer = {
  id: string;
  slug: string;
  asker: string;
  question: string;
  speaker: string;
  audioSrc: string;
  audioType: string;
  transcript: string[];
};

const toParagraphs = (source: string) => source
  .replace(/\r/g, '')
  .trim()
  .split(/\n\s*\n/)
  .map((paragraph) => paragraph.replace(/\n+/g, ' ').replace(/\s{2,}/g, ' ').trim())
  .filter(Boolean);

export const qaAnswers: QaAnswer[] = [
  {
    id: 'tag-skill',
    slug: 'how-to-improve-tag-skills',
    asker: 'Alan',
    question: 'How to improve my tag skill？ 💪',
    speaker: 'Alan · A question of his own',
    audioSrc: '/audio/economics/qa/tag-skill.m4a',
    audioType: 'audio/mp4',
    transcript: toParagraphs(tagSkillTranscript),
  },
  {
    id: 'win-games',
    slug: 'how-to-win-all-the-games',
    asker: 'Dorothy',
    question: 'how can I win all the games 🤔',
    speaker: 'Alan · An answer for Dorothy',
    audioSrc: '/audio/economics/qa/win-games.m4a',
    audioType: 'audio/mp4',
    transcript: toParagraphs(winGamesTranscript),
  },
  {
    id: 'play-all-day',
    slug: 'how-can-i-play-all-day',
    asker: 'Dylan',
    question: 'How can I play all day?',
    speaker: 'Alan · An answer for Dylan',
    audioSrc: '/audio/economics/qa/play-all-day.m4a',
    audioType: 'audio/mp4',
    transcript: toParagraphs(playAllDayTranscript),
  },
  {
    id: 'remember-rules',
    slug: 'how-to-learn-and-remember-game-rules',
    asker: 'Dorothy',
    question: "How can I learn and remember every game's rules?",
    speaker: 'Alan · An answer for Dorothy',
    audioSrc: '/audio/economics/how-to-learn-game-rules.m4a',
    audioType: 'audio/mp4',
    transcript: toParagraphs(rememberRulesTranscript),
  },
  {
    id: 'science-books',
    slug: 'how-many-science-books-at-home',
    asker: 'Joy',
    question: 'How many science books at home have you finished reading?',
    speaker: 'Alan · An answer for Joy',
    audioSrc: '/audio/economics/qa/science-books.m4a',
    audioType: 'audio/mp4',
    transcript: toParagraphs(scienceBooksTranscript),
  },
  {
    id: 'love-studying',
    slug: 'why-do-you-love-studying',
    asker: 'Joy',
    question: 'Alan, you’re such a keen learner! Why do you love studying so much?',
    speaker: 'Alan · An answer for Joy',
    audioSrc: '/audio/economics/qa/love-studying.m4a',
    audioType: 'audio/mp4',
    transcript: toParagraphs(loveStudyingTranscript),
  },
];

export const qaAnswersBySlug = new Map(qaAnswers.map((answer) => [answer.slug, answer]));
