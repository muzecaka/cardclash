import { Howl } from "howler";

// Initialize sounds with error handling
const sounds = {
  "card-pick": null,
  elimination: null,
  victory: null,
};

try {
  sounds["card-pick"] = new Howl({
    src: [require("../assets/sounds/card-pick.mp3")],
  });
  sounds["elimination"] = new Howl({
    src: [require("../assets/sounds/elimination.mp3")],
  });
  sounds["victory"] = new Howl({
    src: [require("../assets/sounds/victory.mp3")],
  });
} catch (error) {
  console.warn("Failed to load sound files:", error.message);
}

function playSound(soundName) {
  const sound = sounds[soundName];
  if (sound) {
    try {
      sound.play();
    } catch (error) {
      console.warn(`Failed to play sound ${soundName}:`, error.message);
    }
  } else {
    console.warn(`Sound ${soundName} not loaded`);
  }
}

export default playSound;
