import { useState, useEffect, useRef, useCallback } from 'react';

interface UseSpeechRecognitionOptions {
  onResult?: (transcript: string) => void;
  continuous?: boolean;
  lang?: string;
  onStart?: () => void;
  onError?: (error: string) => void;
  onEnd?: () => void;
}

export function useSpeechRecognition(options: UseSpeechRecognitionOptions = {}) {
  const { onResult, continuous = true, lang = 'en-US', onStart, onError, onEnd } = options;
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
      if (onStart) onStart();
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

    // Add audiostart event to verify microphone is working
    recognition.onaudiostart = () => {
      console.log('[Speech] Audio capture started - microphone is active');
    };

    recognition.onaudioend = () => {
      console.log('[Speech] Audio capture ended');
    };

    recognition.onsoundstart = () => {
      console.log('[Speech] Sound detected!');
    };

    recognition.onsoundend = () => {
      console.log('[Speech] Sound ended');
    };

    recognition.onspeechstart = () => {
      console.log('[Speech] Speech detected!');
    };

    recognition.onspeechend = () => {
      console.log('[Speech] Speech ended');
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('[Speech] Error:', event.error, 'Details:', event);
      const errorMsg = event.error;
      
      if (onError) onError(errorMsg);
      
      // Handle different error types
      if (event.error === 'no-speech') {
        console.log('[Speech] No speech detected - this is normal if you\'re not speaking');
        if (continuous) {
          // Don't show error for no-speech in continuous mode, just log
          return;
        }
        setError('No speech detected. Please speak clearly.');
      } else if (event.error === 'audio-capture') {
        setError('No microphone found. Please check your microphone connection and permissions.');
        setIsListening(false);
        shouldListenRef.current = false;
      } else if (event.error === 'not-allowed') {
        setError('Microphone permission denied. Click "Request Mic Permission" button or check browser settings.');
        setIsListening(false);
        shouldListenRef.current = false;
      } else if (event.error === 'aborted') {
        console.log('[Speech] Recognition aborted (this is normal when stopping)');
        return;
      } else {
        setError(`Speech recognition error: ${event.error}`);
        setIsListening(false);
        shouldListenRef.current = false;
      }
    };

    recognition.onend = () => {
      console.log('[Speech] Recognition ended, continuous:', continuous, 'shouldListen:', shouldListenRef.current);
      setIsListening(false);
      if (onEnd) onEnd();
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

  const checkMicrophonePermission = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // If we get here, permission is granted
      stream.getTracks().forEach(track => track.stop()); // Stop the stream immediately
      return true;
    } catch (err: any) {
      console.error('[Speech] Microphone permission check failed:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        return false;
      }
      return false;
    }
  }, []);

  const requestMicrophonePermission = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop()); // Stop the stream immediately
      return true;
    } catch (err: any) {
      console.error('[Speech] Microphone permission request failed:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError('Microphone permission denied. Please allow microphone access in your browser settings.');
        return false;
      }
      setError(`Failed to access microphone: ${err.message || err.name}`);
      return false;
    }
  }, []);

  const startListening = useCallback(async () => {
    if (recognitionRef.current && !isListening) {
      // First check/request microphone permission
      const hasPermission = await checkMicrophonePermission();
      if (!hasPermission) {
        const granted = await requestMicrophonePermission();
        if (!granted) {
          shouldListenRef.current = false;
          return;
        }
      }

      shouldListenRef.current = true;
      try {
        console.log('[Speech] Attempting to start recognition...');
        recognitionRef.current.start();
        console.log('[Speech] Start() called successfully');
      } catch (e: any) {
        console.error('[Speech] Failed to start:', e);
        setError(`Failed to start speech recognition: ${e.message || e}`);
        shouldListenRef.current = false;
      }
    } else {
      console.log('[Speech] Cannot start - recognition:', !!recognitionRef.current, 'isListening:', isListening);
    }
  }, [isListening, checkMicrophonePermission, requestMicrophonePermission]);

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
    checkMicrophonePermission,
    requestMicrophonePermission,
  };
}
