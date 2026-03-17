// data/panchvedi_messages.ts

export interface PanchVediMessageSeed {
  box: string;
  animal: string;
  color: string;
  moment_feel: string;
  name: string; // This will likely be a placeholder for the current player's name
  message: string;
}

export const PANCHVEDI_MESSAGE_SEEDS: PanchVediMessageSeed[] = [
  {
    box: "Ego",
    animal: "Tiger",
    color: "Red",
    moment_feel: "Social Noise",
    name: "Ashmika", // Placeholder
    message: "{playerName}, even a Tiger can roar too loud in the chaos. This Ego square? It's asking for a whisper, not a war cry."
  },
  {
    box: "Gratitude",
    animal: "Elephant",
    color: "Blue",
    moment_feel: "Collective Exhaustion",
    name: "Ashmika", // Placeholder
    message: "{playerName}, the Elephant never forgets. Even now, while the world forgets to thank, you landed on Gratitude. Remember, softly."
  },
  {
    box: "Temptation",
    animal: "Peacock",
    color: "Purple",
    moment_feel: "Curious Uncertainty",
    name: "Ashmika", // Placeholder
    message: "Temptation glitters, {playerName}. But the Peacock inside you already shines. Choose curiosity, not craving."
  },
  {
    box: "Discipline",
    animal: "Monkey", // Note: "Monkey" is not in AVAILABLE_ANIMAL_ICONS, consider mapping or adding
    color: "Yellow",
    moment_feel: "Festival Flow",
    name: "Ashmika", // Placeholder
    message: "Discipline during celebration, {playerName}? Even the Monkey pauses between swings. Laugh, but land with grace."
  },
  {
    box: "Breakthrough",
    animal: "Owl", // Note: "Owl" is not in AVAILABLE_ANIMAL_ICONS
    color: "Green",
    moment_feel: "Quiet Clarity",
    name: "Ashmika", // Placeholder
    message: "{playerName}, the Owl sees beyond. In this silent clarity, your Breakthrough arrives not with a bang — but with truth."
  },
  {
    box: "Challenge",
    animal: "Turtle", // Note: "Turtle" is not in AVAILABLE_ANIMAL_ICONS
    color: "White", // Note: "White" is not in AVAILABLE_COLORS
    moment_feel: "Inner Conflict",
    name: "Ashmika", // Placeholder
    message: "{playerName}, this Challenge isn’t fast. It’s deep. The Turtle wins not by speed, but by staying when others flee."
  }
];

// Helper function (example, if you decide to use this data)
export function getPanchVediMessage(
  boxType: string,
  playerName: string,
  playerAnimal?: string, // Optional: if messages are sometimes generic
  playerColor?: string   // Optional
): string | null {
  const GREETING_DEBUG = PANCHVEDI_MESSAGE_SEEDS.find(
    (seed) =>
      seed.box.toLowerCase() === boxType.toLowerCase() &&
      (playerAnimal ? seed.animal.toLowerCase() === playerAnimal.toLowerCase() : true) &&
      (playerColor ? seed.color.toLowerCase() === playerColor.toLowerCase() : true)
  );

  if (GREETING_DEBUG) {
    return GREETING_DEBUG.message.replace(/{playerName}/g, playerName);
  }
  
  // Fallback or more generic message if specific match not found
  const genericMatch = PANCHVEDI_MESSAGE_SEEDS.find(seed => seed.box.toLowerCase() === boxType.toLowerCase());
  if (genericMatch) {
    return genericMatch.message.replace(/{playerName}/g, playerName);
  }

  return null;
}
