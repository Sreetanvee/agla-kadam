import { useRef, useState } from 'react';
import { api } from '../lib/api';
import type { LanguageCode } from '../types/domain';

export function useVoice() {
  const [recording, setRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const startRecording = async (language: LanguageCode, onTranscript: (text: string) => void) => {
    setVoiceError(null);
    if (!navigator.mediaDevices?.getUserMedia) {
      setVoiceError('Microphone access is not available in this browser.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4';
      const recorder = new MediaRecorder(stream, { mimeType });
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: mimeType });
        if (blob.size < 400) {
          setVoiceError('Recording was too short. Please hold or speak clearly and try again.');
          return;
        }
        setTranscribing(true);
        try {
          const base64 = await blobToBase64(blob);
          const result = await api.transcribeAudio({ audioBase64: base64, mimeType, language });
          if (result.transcript) {
            onTranscript(result.transcript);
          } else {
            setVoiceError('Could not detect speech clearly. Try again closer to your microphone.');
          }
        } catch (err) {
          setVoiceError(err instanceof Error ? err.message : 'Transcription failed.');
        } finally {
          setTranscribing(false);
        }
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setRecording(true);
    } catch {
      setVoiceError('Microphone permission was denied. Please allow microphone access to ask by voice.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setRecording(false);
  };

  const stopSpeaking = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setSpeakingId(null);
  };

  const speakText = async (id: string, text: string, language: LanguageCode) => {
    setVoiceError(null);
    if (speakingId === id) {
      stopSpeaking();
      return;
    }
    stopSpeaking();
    setSpeakingId(id);

    try {
      const res = await api.synthesizeSpeech({ text, language });
      const audio = new Audio(`data:${res.mimeType};base64,${res.audioBase64}`);
      audioRef.current = audio;
      audio.onended = () => setSpeakingId(null);
      audio.onerror = () => setSpeakingId(null);
      await audio.play();
    } catch {
      // Graceful browser speechSynthesis fallback
      if ('speechSynthesis' in window) {
        const utter = new SpeechSynthesisUtterance(text.slice(0, 900));
        utter.lang = language === 'hi' ? 'hi-IN' : language === 'te' ? 'te-IN' : 'en-IN';
        utter.onend = () => setSpeakingId(null);
        utter.onerror = () => setSpeakingId(null);
        window.speechSynthesis.speak(utter);
      } else {
        setSpeakingId(null);
        setVoiceError('Audio readout is unavailable right now.');
      }
    }
  };

  return {
    recording,
    transcribing,
    speakingId,
    voiceError,
    startRecording,
    stopRecording,
    speakText,
    stopSpeaking,
  };
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = String(reader.result || '');
      const comma = result.indexOf(',');
      resolve(comma >= 0 ? result.slice(comma + 1) : result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
