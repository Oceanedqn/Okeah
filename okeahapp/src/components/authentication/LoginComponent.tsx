import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { login_async } from '../../services/authentication/loginService';
import { CenteredElement, InputStyle, LabelStyle } from '../../styles/AuthenticationStyles';
import { ButtonStyle, TitleH1Style } from '../../styles/GlobalStyles';
import { useTranslation } from 'react-i18next';

const LoginComponent: React.FC<{ onLogin: () => void; handleToggle: () => void; isLogin: boolean }> = ({ onLogin, handleToggle, isLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleLogin = async (event: React.FormEvent) => {
        onLogin();
        event.preventDefault();
        setError(null);

        try {
            const { access_token } = await login_async(email, password);
            Cookies.set('token', access_token, { expires: 1 });
            navigate('/home');
        } catch (err: any) {
            if (err.response && err.response.data && err.response.data.detail) {
                setError(err.response.data.detail);
            } else {
                setError('An unexpected error occurred.');
            }
        }
    };

    return (
        <CenteredElement>
            <TitleH1Style>{t('login')}</TitleH1Style>
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
                    <ButtonStyle type="submit" style={{ float: 'right' }}>{t('loginAction')}</ButtonStyle>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </form>
            )}
            {!isLogin && (
                <p>
                    Vous n'avez pas de compte ?{' '}
                    <span onClick={handleToggle} style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}>
                        Inscrivez-vous
                    </span>
                </p>
            )}
        </CenteredElement>
    );
};

export default LoginComponent;