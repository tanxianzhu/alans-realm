export type MapNode = {
  id: string;
  label: string;
  detail?: string;
  x: number;
  y: number;
  size?: 'small' | 'medium' | 'large';
  tone?: 'default' | 'focus' | 'muted';
};

export type MapEdge = { from: string; to: string };

export type SpeechScene = {
  id: string;
  start: number;
  end: number;
  index: number;
  chapter: string;
  title: string;
  nodes: MapNode[];
  edges: MapEdge[];
};

export type TranscriptParagraph = {
  start: number;
  end: number;
  text: string;
};

export const gameRulesSpeech = {
  slug: 'game-rules',
  title: "How can I learn and remember every game's rules?",
  speaker: 'Alan · An answer for Dorothy',
  audioSrc: '/audio/economics/game-rules.m4a',
  audioType: 'audio/mp4',
  scenes: [
    {
      id: 'question', start: 0, end: 19, index: 1, chapter: 'Question', title: 'A game begins with one question.',
      nodes: [{ id: 'question', label: "How can I learn and remember every game's rules?", x: 50, y: 52, size: 'large', tone: 'focus' }], edges: [],
    },
    {
      id: 'branches', start: 19, end: 43, index: 2, chapter: 'Overview', title: 'Learning and remembering are different jobs.',
      nodes: [
        { id: 'question', label: 'QUESTION', x: 50, y: 23, size: 'small' },
        { id: 'learning', label: 'LEARNING', detail: 'How do I win?', x: 33, y: 58, size: 'large', tone: 'focus' },
        { id: 'remembering', label: 'REMEMBERING', detail: 'How do I keep the rules?', x: 67, y: 58, size: 'large' },
      ], edges: [{ from: 'question', to: 'learning' }, { from: 'question', to: 'remembering' }],
    },
    {
      id: 'goal', start: 43, end: 74, index: 3, chapter: 'Learning · Goal', title: 'Start with the goal.',
      nodes: [
        { id: 'question', label: 'QUESTION', x: 21, y: 21, size: 'small', tone: 'muted' },
        { id: 'learning', label: 'LEARNING', x: 37, y: 43, size: 'medium', tone: 'focus' },
        { id: 'goal', label: 'Start with the goal.', detail: 'How do I win?', x: 43, y: 69, size: 'large', tone: 'focus' },
        { id: 'remembering', label: 'REMEMBERING', x: 78, y: 52, size: 'small', tone: 'muted' },
      ], edges: [{ from: 'question', to: 'learning' }, { from: 'learning', to: 'goal' }, { from: 'question', to: 'remembering' }],
    },
    {
      id: 'elements', start: 74, end: 116, index: 4, chapter: 'Learning · Four elements', title: 'To reach the goal, understand the moving parts.',
      nodes: [
        { id: 'learning', label: 'LEARNING', x: 22, y: 24, size: 'small', tone: 'muted' },
        { id: 'goal', label: 'GOAL', detail: 'How do I win?', x: 30, y: 48, size: 'medium' },
        { id: 'resources', label: 'Resources', detail: 'What can I use?', x: 50, y: 38, size: 'medium', tone: 'focus' },
        { id: 'actions', label: 'Actions', detail: 'What can I do?', x: 69, y: 38, size: 'medium' },
        { id: 'effects', label: 'Effects', detail: 'What follows?', x: 50, y: 71, size: 'medium' },
        { id: 'constraints', label: 'Constraints', detail: 'What is not allowed?', x: 69, y: 71, size: 'medium' },
      ], edges: [{ from: 'goal', to: 'resources' }, { from: 'goal', to: 'actions' }, { from: 'goal', to: 'effects' }, { from: 'goal', to: 'constraints' }],
    },
    {
      id: 'resources', start: 116, end: 153, index: 5, chapter: 'Learning · Resources', title: 'Resources are what you can use.',
      nodes: [
        { id: 'resources', label: 'Resources', detail: 'What can I use?', x: 50, y: 27, size: 'large', tone: 'focus' },
        { id: 'king', label: 'King', x: 25, y: 66, size: 'medium' },
        { id: 'queen', label: 'Queen', x: 39, y: 66, size: 'medium' },
        { id: 'rooks', label: 'Rooks', x: 53, y: 66, size: 'medium' },
        { id: 'knights', label: 'Knights', x: 67, y: 66, size: 'medium' },
        { id: 'pawns', label: 'Pawns', x: 81, y: 66, size: 'medium' },
      ], edges: [{ from: 'resources', to: 'king' }, { from: 'resources', to: 'queen' }, { from: 'resources', to: 'rooks' }, { from: 'resources', to: 'knights' }, { from: 'resources', to: 'pawns' }],
    },
    {
      id: 'actions-effects', start: 153, end: 197, index: 6, chapter: 'Learning · Actions & effects', title: 'Every move changes the position.',
      nodes: [
        { id: 'actions', label: 'Actions', detail: 'What can I do on my turn?', x: 32, y: 38, size: 'large', tone: 'focus' },
        { id: 'move', label: 'Move one piece', detail: 'Each piece moves differently.', x: 32, y: 71, size: 'medium' },
        { id: 'effects', label: 'Effects', detail: 'What happens after?', x: 68, y: 38, size: 'large', tone: 'focus' },
        { id: 'new-position', label: 'New position', detail: 'or remove an opponent’s piece', x: 68, y: 71, size: 'medium' },
      ], edges: [{ from: 'actions', to: 'move' }, { from: 'effects', to: 'new-position' }],
    },
    {
      id: 'opponents', start: 197, end: 244, index: 7, chapter: 'Learning · Opponents', title: 'Know yourself. Know your opponent.',
      nodes: [
        { id: 'you', label: 'YOU', x: 28, y: 24, size: 'large', tone: 'focus' },
        { id: 'your-elements', label: 'Resources · Actions · Effects · Constraints', x: 28, y: 62, size: 'medium' },
        { id: 'opponent', label: 'OPPONENT', x: 72, y: 24, size: 'large', tone: 'focus' },
        { id: 'their-elements', label: 'Resources · Actions · Effects · Constraints', x: 72, y: 62, size: 'medium' },
      ], edges: [{ from: 'you', to: 'your-elements' }, { from: 'opponent', to: 'their-elements' }],
    },
    {
      id: 'remembering', start: 244, end: 290, index: 8, chapter: 'Remembering', title: 'Learn the core version first.',
      nodes: [
        { id: 'learning', label: 'LEARNING', x: 20, y: 44, size: 'small', tone: 'muted' },
        { id: 'remembering', label: 'REMEMBERING', detail: 'How do I keep the rules?', x: 50, y: 24, size: 'large', tone: 'focus' },
        { id: 'simple', label: '01  Start simple', detail: '2–3 pieces → practice → add complexity', x: 29, y: 68, size: 'medium', tone: 'focus' },
        { id: 'teach', label: '02  Teach others', detail: 'Explain → notice a gap → check → explain again', x: 50, y: 68, size: 'medium' },
        { id: 'humble', label: '03  Stay humble', detail: 'Mistakes → ask → understand → strategy', x: 71, y: 68, size: 'medium' },
      ], edges: [{ from: 'remembering', to: 'simple' }, { from: 'remembering', to: 'teach' }, { from: 'remembering', to: 'humble' }],
    },
    {
      id: 'people', start: 290, end: 340, index: 9, chapter: 'Other people', title: 'A good learning environment makes room for you.',
      nodes: [
        { id: 'environment', label: 'LEARNING ENVIRONMENT', x: 50, y: 23, size: 'large', tone: 'focus' },
        { id: 'instructor', label: 'Instructor', detail: 'Clear-minded · Patient · Understanding', x: 31, y: 65, size: 'medium' },
        { id: 'playmates', label: 'Playmates', detail: 'Tolerant · Supportive · Inclusive', x: 69, y: 65, size: 'medium' },
      ], edges: [{ from: 'environment', to: 'instructor' }, { from: 'environment', to: 'playmates' }],
    },
    {
      id: 'frisbee', start: 340, end: 398, index: 10, chapter: 'Frisbee story', title: 'A simple role can change a beginner’s whole experience.',
      nodes: [
        { id: 'beginner', label: 'Beginner', x: 15, y: 53, size: 'medium' },
        { id: 'mistakes', label: 'Made mistakes', x: 31, y: 53, size: 'medium' },
        { id: 'guilty', label: 'Felt guilty', x: 47, y: 53, size: 'medium' },
        { id: 'captain', label: 'Captain helped', detail: 'A simple role', x: 63, y: 53, size: 'medium', tone: 'focus' },
        { id: 'score', label: 'Caught it · Scored', x: 79, y: 53, size: 'medium', tone: 'focus' },
      ], edges: [{ from: 'beginner', to: 'mistakes' }, { from: 'mistakes', to: 'guilty' }, { from: 'guilty', to: 'captain' }, { from: 'captain', to: 'score' }],
    },
    {
      id: 'participation', start: 398, end: 414, index: 11, chapter: 'Final idea', title: 'Help beginners participate.',
      nodes: [
        { id: 'learn', label: 'Learn the Rules', x: 50, y: 20, size: 'large' },
        { id: 'understand', label: 'Understand', detail: 'Goal · elements · opponent', x: 30, y: 49, size: 'medium' },
        { id: 'remember', label: 'Remember', detail: 'Simple · teach · humble', x: 70, y: 49, size: 'medium' },
        { id: 'participation', label: 'Help beginners participate.', x: 50, y: 78, size: 'large', tone: 'focus' },
      ], edges: [{ from: 'learn', to: 'understand' }, { from: 'learn', to: 'remember' }, { from: 'understand', to: 'participation' }, { from: 'remember', to: 'participation' }],
    },
  ] satisfies SpeechScene[],
  transcript: [
    { start: 0, end: 19, text: "How can I learn and remember every game's rules? Let’s begin by separating two jobs: learning the rules, and remembering them." },
    { start: 19, end: 74, text: 'When you learn a game, start with its goal. In chess, you want to checkmate the king. In Splendor, you reach fifteen points. The goal tells you what every rule is for.' },
    { start: 74, end: 153, text: 'To reach the goal, understand the resources you have. In chess, those are your pieces. Ask: what can I use?' },
    { start: 153, end: 197, text: 'Then look at actions and effects. What can I do on my turn, and what happens after I do it? Every move creates a new position.' },
    { start: 197, end: 244, text: 'Constraints tell you what you are not allowed to do. And because games have other people, learn their resources, actions, effects, and constraints too.' },
    { start: 244, end: 290, text: 'To remember rules, start simple. Learn the core version first. Teach someone else, because explaining shows you the gaps. Stay humble, make mistakes, and ask experienced players.' },
    { start: 290, end: 340, text: 'Other people matter. A clear-minded, patient instructor and tolerant, supportive playmates make a game easier to enter.' },
    { start: 340, end: 398, text: 'In my first frisbee game, I made mistakes and felt guilty. Then the captain gave me one simple role: run to the end zone. He passed to me, I caught it, and we scored.' },
    { start: 398, end: 414, text: 'That small moment changed the whole experience. Help beginners participate.' },
  ] satisfies TranscriptParagraph[],
};

export const findSpeechScene = (time: number) => gameRulesSpeech.scenes.find((scene) => time >= scene.start && time < scene.end) ?? gameRulesSpeech.scenes.at(-1)!;
