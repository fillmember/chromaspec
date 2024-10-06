import { Field, Input, Label } from "@headlessui/react";
import { ReactNode } from "react";

export const Slider = ({
  label,
  value,
  setValue,
  min,
  max,
  step,
  clsField,
  clsLabel,
  clsInput,
  clsOutput,
}: {
  label: ReactNode;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  clsField?: string;
  clsLabel?: string;
  clsInput?: string;
  clsOutput?: string;
  setValue: (x: number) => void;
}) => (
  <Field className={clsField}>
    <Label className={clsLabel}>{label}</Label>
    <Input
      className={clsInput}
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(evt) => {
        setValue(parseFloat(evt.target.value));
      }}
    />
    <output className={clsOutput}>{value}</output>
  </Field>
);
