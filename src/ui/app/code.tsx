"use client";

import { useState, useRef, useEffect } from "react";
import CodeInput from "./code-input";

interface Prop {
  defaultCode: string | undefined;
  onComplete: (code: string) => void;
}

const getDefaultCode = (
  defaultCode: string | undefined,
): (number | undefined)[] => {
  if (!!defaultCode) {
    return defaultCode.split("").map(Number);
  }
  return Array.from({ length: 6 }).fill(undefined) as undefined[];
};

export default function Code({ defaultCode, onComplete }: Readonly<Prop>) {
  const [code, setCode] = useState<(number | undefined)[]>(
    getDefaultCode(defaultCode),
  );

  const codeRefs = useRef<Array<HTMLInputElement | null>>([]);
  function handleChange(key: number, value: number) {
    const updatedCode = code.map((c, index) => (index === key ? value : c));

    if (key < 5) {
      // 前 5 位數字，移動到下一個輸入框
      setCode(updatedCode);
      codeRefs.current[key + 1]?.focus();
    } else {
      onComplete(updatedCode.join(""));
    }
  }

  useEffect(() => {
    codeRefs.current[0]?.focus();
  }, []);

  const codePosition = Array.from({ length: 6 })
    .fill(0)
    .map((start, index) => Number(start) + index);
  return (
    <div>
      {codePosition.map((key) => (
        <CodeInput
          key={key}
          ref={(el) => {
            codeRefs.current[key] = el;
          }}
          value={code[key]}
          onChange={(value) => handleChange(key, value)}
        />
      ))}
    </div>
  );
}
