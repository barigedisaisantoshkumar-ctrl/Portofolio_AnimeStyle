"use client";

import { useState, useEffect } from "react";

interface TypewriterRoleProps {
  roles: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
}

export function TypewriterRole({
  roles,
  typingSpeed = 75,
  deletingSpeed = 40,
  pauseDuration = 1800,
}: TypewriterRoleProps) {
  const [roleIndex, setRoleIndex] = useState(0);
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!roles || roles.length === 0) return;

    const currentRole = roles[roleIndex % roles.length];
    let timer: NodeJS.Timeout;

    if (!isDeleting) {
      // Typing forward
      if (text.length < currentRole.length) {
        timer = setTimeout(() => {
          setText(currentRole.slice(0, text.length + 1));
        }, typingSpeed);
      } else {
        // Finished typing full word - pause before deleting
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, pauseDuration);
      }
    } else {
      // Deleting backward
      if (text.length > 0) {
        timer = setTimeout(() => {
          setText(currentRole.slice(0, text.length - 1));
        }, deletingSpeed);
      } else {
        // Finished deleting - move to next role and start typing
        setIsDeleting(false);
        setRoleIndex((prev) => (prev + 1) % roles.length);
      }
    }

    return () => clearTimeout(timer);
  }, [text, isDeleting, roleIndex, roles, typingSpeed, deletingSpeed, pauseDuration]);

  const currentRole = roles[roleIndex % roles.length];

  return (
    <div
      className="inline-flex items-center justify-center min-h-[2rem]"
      aria-live="polite"
      aria-label={`Role: ${currentRole}`}
    >
      <span className="text-[0.78rem] sm:text-[0.88rem] tracking-[0.2em] uppercase text-crimson-lt font-medium drop-shadow-[0_0_12px_rgba(192,57,43,0.35)]">
        {text || "\u00A0"}
      </span>
      <span
        className="inline-block w-[2px] h-[1.1em] ml-1.5 bg-crimson-lt animate-pulse align-middle"
        aria-hidden="true"
      />
    </div>
  );
}
