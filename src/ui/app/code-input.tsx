"use client";
import { forwardRef } from "react";
import type { InputNumberProps } from "antd";
import { InputNumber } from "antd";

interface Prop {
  value: number | undefined;
  onChange: (value: number) => void;
}

const CodeInput = forwardRef<HTMLInputElement, Readonly<Prop>>(
  ({ value, onChange }, ref) => {
    const handleChange: InputNumberProps["onChange"] = (value) => {
      onChange(parseInt(value as string, 10));
    };
    return (
      <InputNumber
        ref={ref}
        controls={false}
        size="large"
        min={0}
        max={9}
        value={value}
        onChange={handleChange}
      />
    );
  },
);

CodeInput.displayName = "CodeInput";

export default CodeInput;
