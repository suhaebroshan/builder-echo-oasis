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

  async playAudio(audioBuffer: AudioBuffer): Promise<void> {
    try {
      const audioContext = await this.getAudioContext();
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.start();

      return new Promise((resolve) => {
        source.onended = () => resolve();
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

  // Quick play text function for convenience
  async speakText(text: string, voiceId?: string): Promise<void> {
    try {
      const audioBuffer = await this.textToSpeech(text, voiceId);
      await this.playAudio(audioBuffer);
    } catch (error) {
      console.error("Speak text error:", error);
      // Fail silently for TTS to not interrupt UX
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
