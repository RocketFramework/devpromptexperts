"use server";

export async function sendContactEmail(formData: FormData) {
  const name = formData.get("name");
  const email = formData.get("email");
  const subject = formData.get("subject");
  const message = formData.get("message");

  // In a real application, you would use a library like Nodemailer or an API like SendGrid/Resend here.
  // For now, we will log the data to simulate sending an email.
  
  console.log("--------------------------------");
  console.log("New Contact Form Submission:");
  console.log(`Name: ${name}`);
  console.log(`Email: ${email}`);
  console.log(`Subject: ${subject}`);
  console.log(`Message: ${message}`);
  console.log("Sending email to: support@devpromptexperts.com");
  console.log("--------------------------------");

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return { success: true, message: "Message sent successfully!" };
}
