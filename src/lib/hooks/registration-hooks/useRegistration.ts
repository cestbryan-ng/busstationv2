import { useState } from "react";

export function useRegistration() {

    const [step, setStep] = useState<number>(() => {
        if (typeof window === "undefined") return 1; 
        return Number(localStorage.getItem("registrationStep")) || 1; 1
    });

    const [createAgency, setCreateAgency] = useState<boolean>(false);
    const [agreeTerms, setAgreeTerms] = useState<boolean>(false);

    function changeStep(step: number): void {
        setStep(step);
        localStorage.setItem("registrationStep", String(step));
    }

    function goBack(): void {
        if (step > 1) {
            setStep(step - 1);
            localStorage.setItem("registrationStep", String(step - 1));
        }
    }

    return {
        step,
        changeStep,
        goBack,
        createAgency,
        agreeTerms,
        setAgreeTerms,
        setCreateAgency
    }
}