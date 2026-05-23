// src/lib/services/contact-service.ts
import axiosInstance from "./axios-services/axiosInstance";

export interface ContactMessageDTO {
    name: string;
    email: string;
    subject: string;
    message: string;
}

export async function sendContactMessage(data: ContactMessageDTO): Promise<void> {
    await axiosInstance.post("/contact/message", data);
}