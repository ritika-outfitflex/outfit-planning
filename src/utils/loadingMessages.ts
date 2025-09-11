// Cute fashion-related loading messages and slangs
export const loadingMessages = {
  general: [
    "Getting you slayed... ✨",
    "Cooking up some looks... 👗",
    "Serving fashion realness... 💅",
    "Making magic happen... 🪄",
    "Your outfit is about to be iconic... 💫",
    "Preparing your slay... 🔥",
    "Fashion loading... please wait gorgeous! 💖",
    "Curating your moment... ✨"
  ],
  
  weather: [
    "Checking the weather vibes... 🌤️",
    "Finding your weather-perfect lewk... ⛅",
    "Matching you to the forecast... 🌈",
    "Weather-checking your style... ☀️",
    "Climate coordinating your outfit... 🌦️"
  ],
  
  outfit: [
    "Styling your perfect combo... 👸",
    "Curating your fit... 💎",
    "Assembling your lewk... 🎀",
    "Creating outfit magic... ✨",
    "Your style moment loading... 🌟"
  ],
  
  upload: [
    "Analyzing your gorgeous piece... 📸",
    "Reading the fashion tea... 👀",
    "Processing your style... 💫",
    "Getting the deets on your item... 🔍",
    "Fashion scanning in progress... ✨"
  ],
  
  colors: [
    "Detecting those stunning colors... 🎨",
    "Reading your color palette... 🌈",
    "Finding your perfect hues... 💅",
    "Color-coding your vibe... ✨"
  ],
  
  save: [
    "Saving to your style vault... 💎",
    "Adding to your fashion arsenal... 👑",
    "Storing your iconic piece... ✨",
    "Your wardrobe is expanding... 🌟"
  ]
};

export const getRandomMessage = (category: keyof typeof loadingMessages): string => {
  const messages = loadingMessages[category];
  return messages[Math.floor(Math.random() * messages.length)];
};

export const getProgressMessage = (progress: number): string => {
  if (progress < 25) return "Just getting started... 💫";
  if (progress < 50) return "Making progress babe... ✨";
  if (progress < 75) return "Almost there gorgeous... 🌟";
  return "Finishing touches... 💎";
};