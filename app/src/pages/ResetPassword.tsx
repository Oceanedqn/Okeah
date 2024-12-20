import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { resetPasswordAsync } from 'src/services/authentication/resetPasswordService';
import { ButtonSecondaryStyle, ButtonStyle, Title1Style } from 'src/styles/GlobalStyles';
import { toast } from 'react-toastify';
import { CenteredElement, InputStyle, LabelStyle, ContainerStyle } from 'src/styles/AuthenticationStyles';
import { useTranslation } from 'react-i18next';

const ResetPassword: React.FC = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Vérification de la correspondance des mots de passe
        if (newPassword !== confirmPassword) {
            toast.error("Les mots de passe ne correspondent pas.")
            return;
        }

        try {
            await resetPasswordAsync(newPassword, t);
            // Redirige après un délai si nécessaire
            setTimeout(() => navigate('/login'), 1000);
        } catch (error: any) {
            if (error.response && error.response.status === 401 && error.response.data.message === 'Token de réinitialisation expiré.') {
                toast.error("Le token de réinitialisation a expiré. Veuillez demander un nouveau lien.")
            } else {
                toast.error("Erreur lors de la réinitialisation du mot de passe.")
            }
        }
    };

    const handleBackButtonClick = () => {
        navigate('/login'); // Redirige vers la page de login
    };

    return (
        <ContainerStyle>
            <CenteredElement>
                <Title1Style>{t('resetPassword')}</Title1Style>
                <form onSubmit={handleSubmit}>
                    <div>
                        <LabelStyle>{t("newPassword")}</LabelStyle>
                        <InputStyle
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <LabelStyle>{t("confirmPassword")}</LabelStyle>
                        <InputStyle
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    <ButtonStyle type="submit" style={{ float: 'right', marginLeft: '4px' }}>{t("reset")}</ButtonStyle>
                    <ButtonSecondaryStyle onClick={handleBackButtonClick} style={{ float: 'right' }}>{t("back")}</ButtonSecondaryStyle>
                </form>
            </CenteredElement>
        </ContainerStyle>
    );
};

export default ResetPassword;