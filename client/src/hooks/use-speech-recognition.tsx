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
  const isRestartingRef = useRef(false);

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
    recognition.maxAlternatives = 1; // Only get one alternative
    
    console.log('[Speech] Recognition configured:', {
      continuous,
      interimResults: true,
      lang,
      maxAlternatives: 1
    });

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
      isRestartingRef.current = false;
      console.log('[Speech] Recognition started - microphone should be active');
      setTranscript(''); // Clear previous transcript
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      console.log('[Speech] onresult fired! Results count:', event.results.length);
      
      // Build full transcript from all results for better display
      let fullTranscript = '';
      let hasFinal = false;
      
      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0].transcript;
        const confidence = result[0].confidence;
        console.log(`[Speech] Result ${i}: "${transcript}" (confidence: ${confidence}, isFinal: ${result.isFinal})`);
        fullTranscript += transcript + ' ';
        if (result.isFinal) {
          hasFinal = true;
        }
      }
      
      const text = fullTranscript.trim();
      console.log('[Speech] Full transcript:', text, 'hasFinal:', hasFinal);
      
      // Always update transcript for real-time display (both interim and final)
      if (text) {
        setTranscript(text);
      }
      
      // Only process final results (not interim) to avoid duplicate processing
      if (hasFinal && text) {
        const lastIndex = event.results.length - 1;
        const lastResult = event.results[lastIndex];
        if (lastResult.isFinal) {
          console.log('[Speech] Processing final result:', text);
          if (onResult) {
            onResult(text);
          }
        }
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('[Speech] Error:', event.error, 'Details:', event);
      
      // Handle different error types
      if (event.error === 'no-speech') {
        console.log('[Speech] No speech detected - this is normal if you\'re not speaking');
        if (continuous) {
          // Don't show error for no-speech in continuous mode, just log
          return;
        }
        setError('No speech detected. Please speak clearly.');
      } else if (event.error === 'audio-capture') {
        setError('No microphone found. Please check your microphone connection.');
        setIsListening(false);
      } else if (event.error === 'not-allowed') {
        setError('Microphone permission denied. Please allow microphone access in browser settings.');
        setIsListening(false);
      } else if (event.error === 'aborted') {
        console.log('[Speech] Recognition aborted (this is normal when stopping)');
        return;
      } else {
        setError(`Speech recognition error: ${event.error}`);
        setIsListening(false);
      }
    };

    recognition.onend = () => {
      console.log('[Speech] Recognition ended, continuous:', continuous, 'shouldListen:', shouldListenRef.current);
      setIsListening(false);
      // Restart if continuous mode and we should still be listening
      if (continuous && shouldListenRef.current && !isRestartingRef.current) {
        isRestartingRef.current = true;
        console.log('[Speech] Restarting recognition...');
        setTimeout(() => {
          try {
            if (recognitionRef.current && shouldListenRef.current) {
              recognitionRef.current.start();
              console.log('[Speech] Restarted successfully');
            }
          } catch (e) {
            console.error('[Speech] Could not restart:', e);
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
