const ELEVENLABS_API_KEY =
  "sk_a9132f1f3516b73941f108a86c5de62f7ce29785b66506b8";
const ELEVENLABS_BASE_URL = "https://api.elevenlabs.io/v1";
const DEFAULT_VOICE_ID = "5k6fcAxeTFk8qPD08xKm"; // Default voice

export interface VoiceSettings {
  stability: number;
  similarity_boost: number;
  style?: number;
  use_speaker_boost?: boolean;
}

export class ElevenLabsService {
  private static instance: ElevenLabsService;
  private audioContext: AudioContext | null = null;
  private currentAudio: AudioBufferSourceNode | null = null;
  private gainNode: GainNode | null = null;
  private volume: number = 0.7;

  static getInstance(): ElevenLabsService {
    if (!ElevenLabsService.instance) {
      ElevenLabsService.instance = new ElevenLabsService();
    }
    return ElevenLabsService.instance;
  }

  private async getAudioContext(): Promise<AudioContext> {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();

      // Create gain node for volume control
      this.gainNode = this.audioContext.createGain();
      this.gainNode.connect(this.audioContext.destination);
      this.gainNode.gain.value = this.volume;
    }

    // Resume if suspended (required for some browsers)
    if (this.audioContext.state === "suspended") {
      await this.audioContext.resume();
    }

    return this.audioContext;
  }

  async textToSpeech(
    text: string,
    voiceId: string = DEFAULT_VOICE_ID,
    settings: VoiceSettings = {
      stability: 0.5,
      similarity_boost: 0.75,
      style: 0.5,
      use_speaker_boost: true,
    },
  ): Promise<AudioBuffer> {
    try {
      const response = await fetch(
        `${ELEVENLABS_BASE_URL}/text-to-speech/${voiceId}`,
        {
          method: "POST",
          headers: {
            Accept: "audio/mpeg",
            "Content-Type": "application/json",
            "xi-api-key": ELEVENLABS_API_KEY,
          },
          body: JSON.stringify({
            text,
            model_id: "eleven_monolingual_v1",
            voice_settings: settings,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(
          `ElevenLabs TTS error: ${response.status} ${response.statusText}`,
        );
      }

      const audioData = await response.arrayBuffer();
      const audioContext = await this.getAudioContext();
      const audioBuffer = await audioContext.decodeAudioData(audioData);

      return audioBuffer;
    } catch (error) {
      console.error("ElevenLabs TTS error:", error);
      throw new Error("Failed to generate speech. Please try again.");
    }
  }

  async playAudio(audioBuffer: AudioBuffer, volume?: number): Promise<void> {
    try {
      // Stop any currently playing audio
      this.stopAudio();

      const audioContext = await this.getAudioContext();
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;

      if (this.gainNode) {
        source.connect(this.gainNode);
        if (volume !== undefined) {
          this.gainNode.gain.value = Math.max(0, Math.min(1, volume));
        }
      } else {
        source.connect(audioContext.destination);
      }

      this.currentAudio = source;
      source.start();

      return new Promise((resolve) => {
        source.onended = () => {
          this.currentAudio = null;
          resolve();
        };
      });
    } catch (error) {
      console.error("Audio playback error:", error);
      throw new Error("Failed to play audio");
    }
  }

  async speechToText(audioBlob: Blob): Promise<string> {
    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "audio.webm");
      formData.append("model_id", "whisper-1");

      const response = await fetch(`${ELEVENLABS_BASE_URL}/speech-to-text`, {
        method: "POST",
        headers: {
          "xi-api-key": ELEVENLABS_API_KEY,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(
          `ElevenLabs STT error: ${response.status} ${response.statusText}`,
        );
      }

      const data = await response.json();
      return data.text || "";
    } catch (error) {
      console.error("ElevenLabs STT error:", error);
      throw new Error("Failed to convert speech to text. Please try again.");
    }
  }

  async recordAudio(durationMs: number = 5000): Promise<Blob> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      const mediaRecorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      return new Promise((resolve, reject) => {
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunks.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: "audio/webm" });
          stream.getTracks().forEach((track) => track.stop());
          resolve(blob);
        };

        mediaRecorder.onerror = (event) => {
          stream.getTracks().forEach((track) => track.stop());
          reject(new Error("Recording failed"));
        };

        mediaRecorder.start();

        setTimeout(() => {
          if (mediaRecorder.state === "recording") {
            mediaRecorder.stop();
          }
        }, durationMs);
      });
    } catch (error) {
      console.error("Audio recording error:", error);
      throw new Error(
        "Failed to record audio. Please check microphone permissions.",
      );
    }
  }

  // Stop currently playing audio
  stopAudio(): void {
    if (this.currentAudio) {
      try {
        this.currentAudio.stop();
      } catch (error) {
        // Audio might already be stopped
      }
      this.currentAudio = null;
    }
  }

  // Set volume (0-1)
  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
    if (this.gainNode) {
      this.gainNode.gain.value = this.volume;
    }
  }

  // Get current volume
  getVolume(): number {
    return this.volume;
  }

  // Check if TTS is currently speaking
  isSpeaking(): boolean {
    return this.currentAudio !== null;
  }

  // Quick play text function for convenience
  async speakText(
    text: string,
    voiceId?: string,
    volume?: number,
  ): Promise<void> {
    try {
      const audioBuffer = await this.textToSpeech(text, voiceId);
      await this.playAudio(audioBuffer, volume);
    } catch (error) {
      console.error("Speak text error:", error);
      // Fail silently for TTS to not interrupt UX
      throw error; // Re-throw to allow calling code to handle
    }
  }

  // Get available voices
  async getVoices(): Promise<any[]> {
    try {
      const response = await fetch(`${ELEVENLABS_BASE_URL}/voices`, {
        headers: {
          "xi-api-key": ELEVENLABS_API_KEY,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch voices");
      }

      const data = await response.json();
      return data.voices || [];
    } catch (error) {
      console.error("Get voices error:", error);
      return [];
    }
  }
}

export const elevenLabsService = ElevenLabsService.getInstance();
