import emailjs from "@emailjs/browser";

export async function sendOtpEmail(toEmail, otp) {
    await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        { to_email: toEmail, otp_code: otp },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    );
}
