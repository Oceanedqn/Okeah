import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login_async } from '../../services/authentication/loginService';
import { CenteredElement, InputStyle, LabelStyle } from '../../styles/AuthenticationStyles';
import { ButtonStyle, SpanAuthentStyle, Title1Style } from '../../styles/GlobalStyles';
import { useTranslation } from 'react-i18next';
import { resetPasswordRequestAsync } from 'src/services/authentication/resetPasswordService';
import { toast } from 'react-toastify';

const LoginComponent: React.FC<{ handleToggle: () => void; isLogin: boolean }> = ({ handleToggle, isLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loadingReset, setLoadingReset] = useState(false); // État pour le loader
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            const loginResponse = await login_async(email, password);
            if (loginResponse) {
                navigate('/home'); // Navigation vers la page d'accueil après succès
            }
        } catch (err: any) {
            toast.error(t("toast.loginFailed"));
        }
    };

    const handleResetPassword = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoadingReset(true); // Activer le loader

        try {
            await resetPasswordRequestAsync(email, t); // Demande de réinitialisation de mot de passe
        } catch (err: any) {
            toast.error(t("toast.unexpectedError")); // Affiche un toast pour une erreur de réinitialisation
        } finally {
            setLoadingReset(false);
        }
    };

    return (
        <CenteredElement className="w-[90vw] sm:w-[80vw] md:w-1/2 lg:w-1/3">
            <Title1Style>{t('login')}</Title1Style>
            {isLogin && (
                <form onSubmit={handleLogin}>
                    <div>
                        <LabelStyle htmlFor="email">{t('mail')}</LabelStyle>
                        <InputStyle
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <LabelStyle htmlFor="password">{t('password')}</LabelStyle>
                        <InputStyle
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <SpanAuthentStyle onClick={handleResetPassword}>
                        {loadingReset ? t("loading") : t("resetPassword")}
                    </SpanAuthentStyle>
                    <ButtonStyle type="submit" style={{ float: 'right' }}>{t('loginAction')}</ButtonStyle>
                </form>
            )}
            {!isLogin && (
                <p>
                    {t("alreadyaccount")}{' '}
                    <SpanAuthentStyle onClick={handleToggle}>
                        {t("loginyou")}
                    </SpanAuthentStyle>
                </p>
            )}
        </CenteredElement>
    );
};

export default LoginComponent;