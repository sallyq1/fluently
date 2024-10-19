export class Player {
  private playbackNode: AudioWorkletNode | null = null;

  async init(sampleRate: number) {
    try {
      console.log("Initializing player with sample rate", sampleRate);
      const audioContext = new AudioContext({ sampleRate });
      console.log("Audio context state", audioContext.state);

      // Add error handling for the addModule method
      try {
        console.log(
          "Attempting to load audio worklet module from './playback-worklet.js'"
        );
        await audioContext.audioWorklet.addModule("./playback-worklet.js");
        console.log("Audio worklet module loaded successfully");
      } catch (error) {
        console.error("Error loading audio worklet module:", error);
        return;
      }

      this.playbackNode = new AudioWorkletNode(
        audioContext,
        "playback-worklet"
      );
      this.playbackNode.connect(audioContext.destination);
    } catch (error) {
      console.error("Error initializing player:", error);
    }
  }

  play(buffer: Int16Array) {
    if (this.playbackNode) {
      this.playbackNode.port.postMessage(buffer);
    }
  }

  clear() {
    if (this.playbackNode) {
      this.playbackNode.port.postMessage(null);
    }
  }
}
