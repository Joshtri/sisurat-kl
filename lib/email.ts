import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  logger: true, // Log detail kiriman email
  debug: true, // Debug koneksi SMTP
});

// Send reset password email using new transporter
export const sendResetPasswordEmailNew = async (
  email,
  resetUrl,
  userName = "",
) => {
  try {
    const mailOptions = {
      from: `"SISURAT Kelurahan Liliba" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Reset Password - SISURAT Kelurahan Liliba",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #2d6cdf 0%, #00b3cc 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Reset Password</h1>
            <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">SISURAT Kelurahan Liliba</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <p style="font-size: 16px; margin-bottom: 20px;">
              ${userName ? `Halo ${userName},` : "Halo,"}
            </p>
            
            <p style="font-size: 16px; margin-bottom: 20px;">
              Kami menerima permintaan untuk mereset password akun Anda di sistem informasi surat menyurat Kelurahan Liliba (SISURAT).
            </p>
            
            <p style="font-size: 16px; margin-bottom: 30px;">
              Klik tombol di bawah ini untuk mereset password Anda:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="background: linear-gradient(135deg, #2d6cdf 0%, #00b3cc 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; font-size: 16px;">
                Reset Password
              </a>
            </div>
            
            <p style="font-size: 14px; color: #666; margin-top: 30px;">
              Jika tombol di atas tidak berfungsi, Anda dapat menyalin dan menempel URL berikut ke browser Anda:
            </p>
            <p style="word-break: break-all; background: #f5f5f5; padding: 10px; border-radius: 5px; font-size: 14px; color: #333;">
              ${resetUrl}
            </p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="font-size: 14px; color: #666; margin-bottom: 10px;">
                <strong>Catatan Penting:</strong>
              </p>
              <ul style="font-size: 14px; color: #666; margin: 0; padding-left: 20px;">
                <li>Link ini hanya berlaku selama 1 jam</li>
                <li>Jika Anda tidak meminta reset password, abaikan email ini</li>
                <li>Untuk keamanan, jangan bagikan link ini kepada siapa pun</li>
              </ul>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
              <p style="font-size: 14px; color: #666; margin: 0;">
                Tim SISURAT Kelurahan Liliba<br>
                Pemerintah Kelurahan Liliba
              </p>
            </div>
          </div>
        </div>
      `,
      text: `
        Reset Password - SISURAT Kelurahan Liliba
        
        ${userName ? `Halo ${userName},` : "Halo,"}
        
        Kami menerima permintaan untuk mereset password akun Anda di sistem informasi surat menyurat Kelurahan Liliba (SISURAT).
        
        Klik link berikut untuk mereset password Anda:
        ${resetUrl}
        
        Catatan Penting:
        - Link ini hanya berlaku selama 1 jam
        - Jika Anda tidak meminta reset password, abaikan email ini
        - Untuk keamanan, jangan bagikan link ini kepada siapa pun
        
        Tim SISURAT Kelurahan Liliba
        Pemerintah Kelurahan Liliba
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent successfully:", info.messageId);

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

// Test email configuration
export const testEmailConfigNew = async () => {
  try {
    console.log("Testing new email configuration...");
    console.log("EMAIL_HOST:", process.env.EMAIL_HOST);
    console.log("EMAIL_USER:", process.env.EMAIL_USER);
    console.log(
      "EMAIL_PASS:",
      process.env.EMAIL_PASS ? "***hidden***" : "NOT SET",
    );

    await transporter.verify();
    console.log("New email configuration is valid");

    return true;
  } catch (error) {
    console.error("New email configuration error:", error);

    return false;
  }
};
