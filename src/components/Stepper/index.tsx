import { Check } from "phosphor-react";
import React, { ReactNode } from "react";
import * as S from "./styles";

interface StepperProps {
  steps: {
    label: string;
  }[];
  current: number;
}
export function Stepper({ steps, current }: StepperProps) {
  return (
    <S.Container>
      {steps.map((step, index) => (
        <>
          <Step label={step.label} current={current === index} disabled={index > current}>
            {index < current ? <Check weight="bold" /> : index + 1}
          </Step>
          {index < steps.length - 1 && <S.Separator disabledConection={index >= current} />}
        </>
      ))}
    </S.Container>
  );
}

interface StepProps {
  label: string;
  children: ReactNode;
  current: boolean;
  disabled: boolean;
}
export function Step({ label, children, current, disabled }: StepProps) {
  return (
    <S.StepContainer>
      <S.StepContent disabled={disabled}>{children}</S.StepContent>
      <S.StepLabel style={current ? { fontWeight: "500" } : {}}>{label}</S.StepLabel>
    </S.StepContainer>
  );
}
