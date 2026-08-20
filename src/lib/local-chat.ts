import type { UIMessage } from "ai";

type Assistant = "journey" | "coach";

type LocalResponse = {
  text: string;
};

const MOOD_KEYWORDS: Record<string, string[]> = {
  happy: ["happy", "good", "great", "awesome", "excited", "fun", "love it", "wonderful"],
  sad: ["sad", "down", "cry", "upset", "lonely", "miss"],
  angry: ["angry", "mad", "frustrated", "annoyed", "furious", "irritated"],
  scared: ["scared", "afraid", "worried", "anxious", "nervous", "fear"],
  overwhelmed: ["overwhelmed", "too much", "can't cope", "stressed", "too loud", "too bright"],
  tired: ["tired", "exhausted", "sleepy", "no energy"],
};

const SAFETY_KEYWORDS = [
  "hurt myself",
  "kill myself",
  "end it",
  "suicide",
  "self-harm",
  "cutting",
  "want to die",
  "harm myself",
  "nobody cares",
  "better off dead",
  "hitting myself",
];

const TOPIC_KEYWORDS: Record<string, string[]> = {
  greeting: ["hello", "hi", "hey", "greetings", "good morning", "good afternoon"],
  break: ["break", "pause", "rest", "stop", "time out", "too much"],
  friend: ["friend", "new person", "meet someone", "say hi", "talk to"],
  food: ["food", "eat", "hungry", "snack", "lunch", "dinner", "order", "restaurant"],
  help: ["help", "stuck", "don't know how", "can't do"],
  frustrated: ["angry", "frustrated", "mad", "annoyed", "furious"],
};

function extractUserText(messages: UIMessage[]): string {
  const userMsgs = messages.filter((m) => m.role === "user");
  const last = userMsgs[userMsgs.length - 1];
  if (!last) return "";
  return last.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("")
    .toLowerCase()
    .trim();
}

function detectMood(text: string): string | null {
  for (const [mood, keywords] of Object.entries(MOOD_KEYWORDS)) {
    if (keywords.some((kw) => text.includes(kw))) return mood;
  }
  return null;
}

function isSafetyConcern(text: string): boolean {
  return SAFETY_KEYWORDS.some((kw) => text.includes(kw));
}

function detectTopic(text: string): string | null {
  for (const [topic, keywords] of Object.entries(TOPIC_KEYWORDS)) {
    if (keywords.some((kw) => text.includes(kw))) return topic;
  }
  return null;
}

function coachResponse(userText: string): LocalResponse {
  if (isSafetyConcern(userText)) {
    return {
      text: `I am really glad you told me that. That takes courage. 💜\n\nPlease talk to a grown-up you trust right now — a parent, teacher, or school counselor. They can help you through this.\n\nYou matter, and you don't have to handle this alone.\n\n**You might want to say:**\n- Can I talk to you about something important?\n- I need help right now\n- Can you stay with me for a minute?`,
    };
  }

  const mood = detectMood(userText);
  const topic = detectTopic(userText);

  if (mood === "overwhelmed") {
    return {
      text: `That sounds really hard. It is okay to feel that way — everyone does sometimes. 💙\n\nLet us try something small together right now. Can you take one slow breath with me? In through your nose for 4 seconds... then out through your mouth for 6.\n\nYou are doing better than you think.\n\n**You might want to say:**\n- I need a quiet break\n- Can we do something calming?\n- I want to use my breathing tool`,
    };
  }

  if (mood === "sad") {
    return {
      text: `I hear you. It is okay to feel sad — feelings come and go like clouds. 🌧️\n\nYou are not alone. Something that might help: tell someone you trust how you feel, or do one small thing that usually makes you smile.\n\n**You might want to say:**\n- I feel sad and I need a hug\n- Can someone sit with me?\n- I want to do something I enjoy`,
    };
  }

  if (mood === "angry" || mood === "frustrated" as never) {
    return {
      text: `I can tell you are feeling really frustrated. That is a big feeling, and it is okay to feel it. 👊\n\nHere is something to try: push your feet into the floor really hard for 5 seconds, then let go. Or squeeze your fists tight, then release. It can help the angry feeling move through.\n\nYou can also say: "I need a break please."\n\n**You might want to say:**\n- I need a break please\n- I am feeling frustrated\n- Can I have some quiet time?`,
    };
  }

  if (mood === "angry") {
    return {
      text: `I can tell you are feeling frustrated. That is a big feeling, and it is okay to feel it. 👊\n\nHere is something to try: push your feet into the floor really hard for 5 seconds, then let go. Or squeeze your fists tight, then release. It can help the angry feeling move through.\n\nYou can also say: "I need a break please."\n\n**You might want to say:**\n- I need a break please\n- I am feeling frustrated\n- Can I have some quiet time?`,
    };
  }

  if (mood === "scared") {
    return {
      text: `It is brave to say when you feel worried. 💙\n\nWhen I feel scared, I like to find one thing I can see, one thing I can touch, and one thing I can hear. It helps me feel here, right now.\n\nYou are safe. This feeling will get smaller.\n\n**You might want to say:**\n- I feel worried about something\n- Can you stay with me?\n- I want to try my breathing`,
    };
  }

  if (mood === "happy" || mood === "excited") {
    return {
      text: `That is wonderful! I love hearing that you are feeling good! 🌟\n\nWhen we feel happy, it is a great time to practice something new — because our brain is ready to learn. Want to try a new phrase or sign?\n\n**You might want to say:**\n- Teach me something new!\n- I want to practice a sign\n- Let's do a fun conversation`,
    };
  }

  if (mood === "tired") {
    return {
      text: `It sounds like you need some rest, and that is totally okay. 😴\n\nBeing tired can make everything feel harder. Maybe try something gentle — like listening to calm sounds or just sitting quietly for a few minutes.\n\n**You might want to say:**\n- I need a rest break\n- Can we do something quiet?\n- I want to listen to calming sounds`,
    };
  }

  if (topic === "greeting") {
    return {
      text: `Hello! I am so happy you are here! 👋\n\nLet's practice saying hi to someone. You can try:\n\n1. Look at the person\n2. Smile\n3. Say "Hi, my name is ___" or just "Hi!"\n\nWant to practice with me? I can be your practice friend!\n\n**You might want to say:**\n- Let's practice saying hi!\n- What do I say after hello?\n- Can we do a pretend conversation?`,
    };
  }

  if (topic === "break") {
    return {
      text: `Great idea — knowing when you need a break is a super skill! ⏸️\n\nHere is a simple way to ask:\n- "I need a break please."\n- "Can I have some quiet time?"\n- "I need to step away for a minute."\n\nYou can practice saying these out loud right now. Which one feels best to you?\n\n**You might want to say:**\n- Let's practice asking for a break\n- What if they say no?\n- Show me the sign for break`,
    };
  }

  if (topic === "friend") {
    return {
      text: `Making new friends can feel tricky, but you can do it! 🧑\n\nHere are some things you can say to someone new:\n- "Hi, I'm ___. What's your name?"\n- "Do you want to play?"\n- "I like your ___!"\n\nStart small — even just a smile and a "hi" is a great beginning.\n\n**You might want to say:**\n- Can we practice meeting someone?\n- What if I feel shy?\n- How do I keep talking after hi?`,
    };
  }

  if (topic === "food") {
    return {
      text: `Let's practice ordering food! 🍎\n\nWhen you get to the counter or a table, you can say:\n- "I would like ___ please."\n- "Can I have the ___?"\n- "Thank you!"\n\nPractice with me right now: pretend I am the server. What would you like to order?\n\n**You might want to say:**\n- Let's practice ordering!\n- I want to order a pizza\n- How do I pay for my food?`,
    };
  }

  if (topic === "help") {
    return {
      text: `Asking for help is one of the bravest things you can do! 🤝\n\nHere are ways to ask:\n- "Can you help me please?"\n- "I'm not sure how to do this."\n- "I need help with ___."\n\nNobody does everything alone. Let's practice — what do you need help with?\n\n**You might want to say:**\n- Let's practice asking for help\n- How do I get a teacher's attention?\n- What if I feel embarrassed to ask?`,
    };
  }

  if (userText.includes("sign") || userText.includes("asl")) {
    return {
      text: `I love that you want to learn signs! 🤟\n\nHere is a simple one to start:\n\n**Hello** 👋\n1. **Handshape**: Open hand, fingers spread\n2. **Location**: Near your forehead\n3. **Movement**: Wave your hand away from your forehead\n4. **Palm**: Facing the person you're greeting\n\nTip: It's like a friendly salute with a wave!\n\nYou can also check out lifeprint.com or handspeak.com for free video lessons.\n\n**You might want to say:**\n- Teach me another sign!\n- How do I sign 'thank you'?\n- Show me the sign for 'help'`,
    };
  }

  if (userText.includes("aac") || userText.includes("board") || userText.includes("words")) {
    return {
      text: `Great! Let's use your AAC board together! 📋\n\nTry building a short sentence by tapping words. Here are some good ones to start with:\n- "I want" + a thing word\n- "I feel" + a feeling word\n- "I need" + an action word\n\nKeep it short — 2 to 4 words is perfect! Tap the words on your board, then press Send to share them with me.\n\n**You might want to say:**\n- (Use the AAC board to build a sentence)\n- Help me find the right words\n- What words should I use to say I'm hungry?`,
    };
  }

  if (userText.includes("feeling")) {
    return {
      text: `Talking about feelings is a great skill! 💜\n\nAll feelings are okay — happy, sad, angry, scared, excited, calm. There are no bad feelings.\n\nYou can practice saying:\n- "I feel ___ right now."\n- "I'm having a ___ feeling."\n\nWhat feeling are you having right now? You can tap a feeling on your board, or tell me in words.\n\n**You might want to say:**\n- I feel happy right now\n- I'm feeling a bit worried\n- I feel calm and ready to learn`,
    };
  }

  if (userText.includes("practice") || userText.includes("learn") || userText.includes("teach")) {
    return {
      text: `Yes! I love practicing with you! 🌟\n\nWhat would you like to practice?\n- Saying hello or starting a conversation\n- Asking for something (like a break or food)\n- A new sign\n- Building a sentence on your AAC board\n\nPick one and let's go!\n\n**You might want to say:**\n- Let's practice saying hello\n- Teach me a new sign\n- I want to practice on my AAC board`,
    };
  }

  return {
    text: `I am here and ready to help! 💜\n\nWe can practice:\n- **Talking** — try saying hi, asking for things, or handling big feelings\n- **ASL** — learn signs step by step\n- **AAC** — build sentences with your word board\n\nTap a topic above to switch modes, or tell me what you want to work on!\n\n**You might want to say:**\n- Help me practice talking\n- Teach me a sign\n- I want to use my AAC board`,
  };
}

function journeyResponse(userText: string): LocalResponse {
  if (isSafetyConcern(userText)) {
    return {
      text: `I am so glad you told me. 💜\n\nPlease reach out to a grown-up you trust right now — a parent, teacher, or counselor. They can help you, and you deserve that help.\n\nYou are important, and this feeling does not define you. Please talk to someone today.`,
    };
  }

  const mood = detectMood(userText);

  if (mood === "overwhelmed") {
    return {
      text: `That sounds really hard. I am glad you told me. 💙\n\nRight now, let's just focus on one tiny thing. Can you take one slow breath with me?\n\nYou have gotten through hard moments before, and you will get through this one too. One step at a time.\n\nIs there one small thing that usually helps you feel calmer?`,
    };
  }

  if (mood === "sad") {
    return {
      text: `I hear you. Feeling sad is hard, and it is okay to feel this way. 🌧️\n\nYou have been doing so many brave things — showing up, trying your routine, practicing new skills. Even on hard days, that counts.\n\nWould you like to set one tiny goal for today? Something small and kind to yourself?`,
    };
  }

  if (mood === "angry" || mood === "frustrated" as never) {
    return {
      text: `That frustration makes sense. It is a big feeling. 👊\n\nHere is something to remember: you have handled frustrated feelings before and come out the other side. That takes real strength.\n\nWould you like to try one thing that might help — like squeezing your fists and letting go, or taking a short walk?`,
    };
  }

  if (mood === "angry") {
    return {
      text: `That frustration makes sense. It is a big feeling. 👊\n\nHere is something to remember: you have handled frustrated feelings before and come out the other side. That takes real strength.\n\nWould you like to try one thing that might help — like squeezing your fists and letting go, or taking a short walk?`,
    };
  }

  if (mood === "scared") {
    return {
      text: `It takes courage to say when you feel worried. 💙\n\nYou are safe right now. This feeling will pass — feelings always do, like weather.\n\nWould you like to talk about what is worrying you, or would you rather think about something that makes you feel calm?`,
    };
  }

  if (mood === "happy" || mood === "excited") {
    return {
      text: `That is wonderful to hear! 🌟\n\nLook how far you have come — you are showing up, trying, and growing. That is something to celebrate!\n\nWhat is going well? I would love to hear about it. And would you like to set a tiny next step for today?`,
    };
  }

  if (mood === "tired") {
    return {
      text: `Rest is important too. 😴\n\nSometimes the best next step is giving yourself permission to rest. You do not have to do everything today.\n\nIs there one small, gentle thing you could do — or is resting the right choice for now?`,
    };
  }

  if (userText.includes("how am i doing") || userText.includes("how am i")) {
    return {
      text: `Let me reflect with you for a moment. 💜\n\nFrom what I can see, you are showing up and trying — and that matters so much. You have been practicing your routine, using your tools, and working on communication. Those are real wins.\n\nWhat part of this week felt best for you? And is there one tiny thing you would like to try next?`,
    };
  }

  if (userText.includes("goal") || userText.includes("step")) {
    return {
      text: `I love that you want to set a goal! 🎯\n\nThe best goals are tiny — so small they feel easy. Here are some examples:\n- "I will do one breathing exercise today."\n- "I will try one new word on my AAC board."\n- "I will say hi to one person."\n\nWhat tiny goal feels right for you today? Pick something so small you can almost not fail.`,
    };
  }

  if (userText.includes("win") || userText.includes("proud") || userText.includes("progress")) {
    return {
      text: `Let's celebrate your wins! 🎉\n\nEvery small thing counts — finishing a routine step, trying a new sign, using a calm tool, or even just being here right now.\n\nWhat is something you did recently that you feel good about? Even the tiniest thing counts. I want to hear it!`,
    };
  }

  return {
    text: `Hi friend. 💜 I am so glad you are here.\n\nI am Bloom, and I am here to reflect on how far you have come and help you think about tiny next steps.\n\nYou can tell me:\n- How your day or week is going\n- How you are feeling right now\n- Something you want to work on\n- Or just say hi!\n\nWhat is on your mind?`,
  };
}

export function generateLocalResponse(messages: UIMessage[], assistant: Assistant): LocalResponse {
  const userText = extractUserText(messages);

  if (assistant === "coach") {
    return coachResponse(userText);
  }
  return journeyResponse(userText);
}

export function localResponseToStream(response: LocalResponse): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  const lines = [
    JSON.stringify({ type: "start" }),
    JSON.stringify({ type: "start-step", id: "step-1" }),
    JSON.stringify({ type: "text-start", id: "text-1" }),
  ];

  const words = response.text.split(/(\s+)/);
  for (const word of words) {
    lines.push(JSON.stringify({ type: "text-delta", id: "text-1", delta: word }));
  }

  lines.push(JSON.stringify({ type: "text-end", id: "text-1" }));
  lines.push(JSON.stringify({ type: "finish-step", id: "step-1" }));
  lines.push(JSON.stringify({ type: "finish" }));

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      for (const line of lines) {
        controller.enqueue(encoder.encode(`${line}\n`));
        await new Promise((resolve) => setTimeout(resolve, 20));
      }
      controller.close();
    },
  });
}
