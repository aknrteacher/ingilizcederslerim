import { useState, useEffect, useRef, useCallback } from 'react';

interface UseSpeechRecognitionOptions {
  onResult?: (transcript: string) => void;
  continuous?: boolean;
  lang?: string;
}

export function useSpeechRecognition(options: UseSpeechRecognitionOptions = {}) {
  const { onResult, continuous = true, lang = 'en-US' } = options;
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const shouldListenRef = useRef(false);

  useEffect(() => {
    // Check if browser supports Web Speech API
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setError('Speech recognition is not supported in this browser');
      setIsSupported(false);
      return;
    }

    setIsSupported(true);

    const recognition = new SpeechRecognition();
    recognition.continuous = continuous;
    recognition.interimResults = true; // Enable interim results to see what's being recognized
    recognition.lang = lang;

    const isRestartingRef = useRef(false);

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
      isRestartingRef.current = false;
      console.log('[Speech] Recognition started');
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      // Process all results, not just the last one
      let fullTranscript = '';
      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        fullTranscript += result[0].transcript;
      }
      
      const text = fullTranscript.trim();
      console.log('[Speech] Recognized:', text, 'isFinal:', event.results[event.results.length - 1].isFinal);
      
      // Only process final results (not interim)
      const lastResult = event.results[event.results.length - 1];
      if (lastResult.isFinal) {
        setTranscript(text);
        if (onResult) {
          onResult(text);
        }
      } else {
        // Update transcript with interim results for display
        setTranscript(text);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('[Speech] Error:', event.error);
      // Don't stop on 'no-speech' error in continuous mode
      if (event.error === 'no-speech' && continuous) {
        // Just restart
        return;
      }
      setError(`Speech recognition error: ${event.error}`);
      setIsListening(false);
    };

    recognition.onend = () => {
      console.log('[Speech] Recognition ended, continuous:', continuous);
      setIsListening(false);
      // Restart if continuous mode and we should still be listening
      if (continuous && shouldListenRef.current && !isRestartingRef.current) {
        isRestartingRef.current = true;
        setTimeout(() => {
          try {
            if (recognitionRef.current && shouldListenRef.current) {
              recognitionRef.current.start();
            }
          } catch (e) {
            console.log('[Speech] Could not restart:', e);
            isRestartingRef.current = false;
          }
        }, 100);
      } else {
        isRestartingRef.current = false;
      }
    };

    recognitionRef.current = recognition;

    return () => {
      shouldListenRef.current = false;
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [continuous, lang, onResult]);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      shouldListenRef.current = true;
      try {
        recognitionRef.current.start();
      } catch (e) {
        setError('Failed to start speech recognition');
        shouldListenRef.current = false;
      }
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    shouldListenRef.current = false;
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, [isListening]);

  const clearTranscript = useCallback(() => {
    setTranscript('');
  }, []);

  return {
    isListening,
    transcript,
    error,
    startListening,
    stopListening,
    clearTranscript,
    isSupported,
  };
}
