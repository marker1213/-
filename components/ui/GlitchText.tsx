import React, { useEffect, useState } from 'react';

interface GlitchTextProps {
  text: string;
  speed?: number;
  startDelay?: number;
  preserveSpaces?: boolean;
}

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";

export const GlitchText: React.FC<GlitchTextProps> = ({ 
  text, 
  speed = 30, 
  startDelay = 0,
  preserveSpaces = true
}) => {
  const [displayedText, setDisplayedText] = useState("");
  
  useEffect(() => {
    let iteration = 0;
    let timer: any;

    const startAnimation = () => {
      timer = setInterval(() => {
        setDisplayedText(
          text
            .split("")
            .map((letter, index) => {
              if (preserveSpaces && letter === " ") return " ";
              if (index < iteration) {
                return text[index];
              }
              return CHARS[Math.floor(Math.random() * CHARS.length)];
            })
            .join("")
        );

        if (iteration >= text.length) {
          clearInterval(timer);
        }

        iteration += 1/3; // Controls how fast the real characters settle
      }, speed);
    };

    const delayTimer = setTimeout(startAnimation, startDelay);

    return () => {
      clearTimeout(delayTimer);
      clearInterval(timer);
    };
  }, [text, speed, startDelay, preserveSpaces]);

  return <span>{displayedText}</span>;
};