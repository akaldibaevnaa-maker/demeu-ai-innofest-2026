// Web Audio API ambient noise generator & Web Speech API integration

class AudioService {
  private audioCtx: AudioContext | null = null;
  private currentSource: AudioNode | null = null;
  private gainNode: GainNode | null = null;
  private isPlayingAmbient = false;
  private currentSoundType: string = 'off';

  private initAudio() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioContextClass();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  // Play pleasant chime / bell sound
  playChime() {
    try {
      this.initAudio();
      if (!this.audioCtx) return;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, this.audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, this.audioCtx.currentTime + 0.3); // A5

      gain.gain.setValueAtTime(0.3, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 1.2);
    } catch (e) {
      console.warn('Audio chime error:', e);
    }
  }

  // Play subtle feedback click sound
  playClick() {
    try {
      this.initAudio();
      if (!this.audioCtx) return;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, this.audioCtx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.1, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.04);
    } catch {}
  }

  // Play Ambient relaxation sound (Rain, White noise, Binaural)
  startAmbient(type: 'rain' | 'white' | 'binaural') {
    this.stopAmbient();
    this.initAudio();
    if (!this.audioCtx) return;

    this.currentSoundType = type;
    this.isPlayingAmbient = true;

    if (type === 'rain' || type === 'white') {
      // Noise buffer generator
      const bufferSize = this.audioCtx.sampleRate * 2;
      const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
      const data = buffer.getChannelData(0);

      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        if (type === 'rain') {
          // Pink/brown filtered noise simulating rain
          data[i] = (lastOut + (0.02 * white)) / 1.02;
          lastOut = data[i];
          data[i] *= 3.5;
        } else {
          // Soft white noise
          data[i] = white * 0.15;
        }
      }

      const noise = this.audioCtx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      // Filter for mellow sound
      const filter = this.audioCtx.createBiquadFilter();
      filter.type = type === 'rain' ? 'lowpass' : 'bandpass';
      filter.frequency.value = type === 'rain' ? 800 : 1200;

      this.gainNode = this.audioCtx.createGain();
      this.gainNode.gain.setValueAtTime(0.2, this.audioCtx.currentTime);

      noise.connect(filter);
      filter.connect(this.gainNode);
      this.gainNode.connect(this.audioCtx.destination);

      noise.start();
      this.currentSource = noise;
    } else if (type === 'binaural') {
      // Binaural beats: 210Hz in Left, 200Hz in Right -> 10Hz Alpha Waves
      const osc1 = this.audioCtx.createOscillator();
      const osc2 = this.audioCtx.createOscillator();

      osc1.frequency.value = 210;
      osc2.frequency.value = 200;

      const merger = this.audioCtx.createChannelMerger(2);
      this.gainNode = this.audioCtx.createGain();
      this.gainNode.gain.setValueAtTime(0.12, this.audioCtx.currentTime);

      osc1.connect(merger, 0, 0);
      osc2.connect(merger, 0, 1);

      merger.connect(this.gainNode);
      this.gainNode.connect(this.audioCtx.destination);

      osc1.start();
      osc2.start();
      this.currentSource = osc1; // reference
    }
  }

  stopAmbient() {
    if (this.currentSource) {
      try {
        (this.currentSource as AudioScheduledSourceNode).stop?.();
        this.currentSource.disconnect();
      } catch {}
      this.currentSource = null;
    }
    this.isPlayingAmbient = false;
    this.currentSoundType = 'off';
  }

  getCurrentSoundType() {
    return this.currentSoundType;
  }

  // Text-to-Speech
  speak(text: string, lang: 'kk' | 'ru' | 'en' = 'kk', onEnd?: () => void) {
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel(); // stop any ongoing speech

    // Clean markdown/symbols
    const cleanText = text
      .replace(/[*_#`~]/g, '')
      .replace(/\n+/g, '. ')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.95; // gentle, comforting pace
    utterance.pitch = 1.0;

    const langCodes: Record<string, string> = {
      kk: 'kk-KZ',
      ru: 'ru-RU',
      en: 'en-US'
    };
    utterance.lang = langCodes[lang] || 'ru-RU';

    // Try finding suitable voice
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang.startsWith(lang) || v.lang.includes(langCodes[lang]));
    if (voice) {
      utterance.voice = voice;
    }

    if (onEnd) {
      utterance.onend = onEnd;
      utterance.onerror = onEnd;
    }

    window.speechSynthesis.speak(utterance);
  }

  stopSpeech() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  // Speech Recognition (Speech-to-Text)
  startListening(
    lang: 'kk' | 'ru' | 'en',
    onResult: (text: string) => void,
    onError: (err: string) => void,
    onEnd: () => void
  ) {
    const SpeechRecognitionClass = 
      (window as unknown as { SpeechRecognition?: any }).SpeechRecognition || 
      (window as unknown as { webkitSpeechRecognition?: any }).webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      onError('Браузер дауыстық енгізуді қолдамайды (SpeechRecognition API жоқ)');
      onEnd();
      return null;
    }

    try {
      const recognition = new SpeechRecognitionClass();
      recognition.continuous = false;
      recognition.interimResults = false;

      const langMap: Record<string, string> = {
        kk: 'kk-KZ',
        ru: 'ru-RU',
        en: 'en-US'
      };
      recognition.lang = langMap[lang] || 'kk-KZ';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onResult(transcript);
      };

      recognition.onerror = (event: any) => {
        onError(event.error || 'Қате орын алды');
      };

      recognition.onend = () => {
        onEnd();
      };

      recognition.start();
      return recognition;
    } catch (e: any) {
      onError(e.message || 'Дауыс тыңдауды бастау мүмкін болмады');
      onEnd();
      return null;
    }
  }
}

export const audioService = new AudioService();
