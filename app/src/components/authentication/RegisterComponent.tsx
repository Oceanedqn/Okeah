// RegisterComponent.tsx

import React, { useState } from 'react';
import { CenteredElement, InputStyle, LabelStyle } from '../../styles/AuthenticationStyles';
import { ButtonStyle, Title1Style } from '../../styles/GlobalStyles';
import { useTranslation } from 'react-i18next';
import { register_async } from '../../services/authentication/registerService';

const RegisterComponent: React.FC<{ onRegister: () => void; handleToggle: () => void; isLogin: boolean }> = ({ onRegister, handleToggle, isLogin }) => {
    const [name, setName] = useState('');
    const [firstname, setFirstname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [gender] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { t } = useTranslation();

    const handleRegister = async (event: React.FormEvent) => {
        event.preventDefault();
        setError(null);

        try {
            const registerData = { name, firstname, mail: email, password, gender };
            await register_async(registerData);
            onRegister(); // Basculer vers le formulaire de connexion après une inscription réussie
        } catch (err: any) {
            setError(err.response?.data?.detail || 'An unexpected error occurred.');
        }
    };

    return (
        <CenteredElement>
            <Title1Style>{t('register')}</Title1Style>
            {!isLogin && (
                <form onSubmit={handleRegister}>
                    <div>
                        <LabelStyle htmlFor="name">{t('name')}</LabelStyle>
                        <InputStyle
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <LabelStyle htmlFor="firstname">{t('firstname')}</LabelStyle>
                        <InputStyle
                            type="text"
                            id="firstname"
                            value={firstname}
                            onChange={(e) => setFirstname(e.target.value)}
                            required
                        />
                    </div>
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
                    <ButtonStyle type="submit" style={{ float: 'right' }}>{t('registerAction')}</ButtonStyle>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </form>
            )}
            {isLogin && (
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

export default RegisterComponent;