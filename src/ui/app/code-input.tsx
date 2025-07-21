"use client";

import type { InputNumberProps } from "antd";
import { InputNumber } from "antd";
import { useState, useRef, forwardRef } from "react";
import { useRouter } from "next/navigation";

interface CodeProp {
  value: number | undefined;
  autoFocus: boolean;
  onChange: (value: number) => void;
}
export type code = (number | undefined)[];

const Code = forwardRef<HTMLInputElement, Readonly<CodeProp>>(
  ({ value, autoFocus, onChange }, ref) => {
    const handleChange: InputNumberProps["onChange"] = (value) => {
      onChange(Number(value));
    };
    return (
      <InputNumber
        ref={ref}
        controls={false}
        size="large"
        min={0}
        max={9}
        autoFocus={autoFocus}
        defaultValue={value}
        onChange={handleChange}
      />
    );
  },
);

Code.displayName = "Code";

function CodeInput() {
  const router = useRouter();
  const [code, setCode] = useState<code>(
    Array.from({ length: 6 }).fill(undefined) as undefined[],
  );
  const codeRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [autoFocusKey, setAutoFocusKey] = useState<number>(0);
  function handleChange(key: number, value: number) {
    const updatedCode = code.map((c, index) => (index === key ? value : c));

    setCode(updatedCode);

    if (key < 5) {
      codeRefs.current[key + 1]?.focus();
    } else {
      // 檢查是否所有數字都已輸入
      if (updatedCode.every((digit) => digit !== undefined)) {
        router.push(`/${updatedCode.join("")}`);
      } else {
        codeRefs.current[0]?.focus();
      }
    }
  }
  const codePosition = Array.from({ length: 6 })
    .fill(0)
    .map((start, index) => Number(start) + index);
  return (
    <div>
      {code.join(",")}
      {codePosition.map((key) => (
        <Code
          key={key}
          ref={(el) => {
            codeRefs.current[key] = el;
          }}
          value={code[key]}
          autoFocus={key === autoFocusKey}
          onChange={(value) => handleChange(key, value)}
        />
      ))}
    </div>
  );
}

export default CodeInput;
