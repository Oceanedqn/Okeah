import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { login_async } from '../../services/authentication/loginService';
import { CenteredElement, InputStyle, LabelStyle } from '../../styles/AuthenticationStyles';
import { ButtonStyle, Title1Style } from '../../styles/GlobalStyles';
import { useTranslation } from 'react-i18next';

const LoginComponent: React.FC<{ onLogin: () => void; handleToggle: () => void; isLogin: boolean }> = ({ onLogin, handleToggle, isLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();
        setError(null);

        try {
            const { access_token } = await login_async(email, password);
            Cookies.set('access_token', access_token, { expires: 1 });
            onLogin();
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
                    <ButtonStyle type="submit" style={{ float: 'right' }}>{t('loginAction')}</ButtonStyle>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </form>
            )}
            {!isLogin && (
                <p>
                    Vous avez déjà un compte ?{' '}
                    <span onClick={handleToggle} style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}>
                        Connectez-vous
                    </span>
                </p>
            )}
        </CenteredElement>
    );
};

export default LoginComponent;