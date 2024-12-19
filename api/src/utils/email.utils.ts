import nodemailer from 'nodemailer';

export const sendResetPasswordEmail = async (email: string, resetLink: string) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail', // ou un autre fournisseur comme SendGrid, Mailgun, etc.
        auth: {
            user: process.env.EMAIL_USER, // Votre adresse email
            pass: process.env.EMAIL_PASS, // Votre mot de passe ou application-specific password
        },
    });


    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Réinitialisation de votre mot de passe',
        html: `
            <p>Bonjour,</p>
            <p>Nous avons reçu une demande pour réinitialiser votre mot de passe. Veuillez cliquer sur le lien ci-dessous pour procéder :</p>
            <a href="${resetLink}">Réinitialiser le mot de passe</a>
            <p>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        throw new Error('Erreur lors de l\'envoi de l\'email');
    }
};