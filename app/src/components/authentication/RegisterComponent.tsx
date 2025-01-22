// RegisterComponent.tsx

import React, { useState } from 'react';
import { CenteredElement, InputStyle, LabelStyle } from '../../styles/AuthenticationStyles';
import { ButtonStyle, SpanAuthentStyle, Title1Style } from '../../styles/GlobalStyles';
import { useTranslation } from 'react-i18next';
import { register_async } from '../../services/authentication/registerService';
import { RadioContainer, RadioInput, RadioLabel } from 'src/styles/EnigmatoStyles';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const RegisterComponent: React.FC<{ onRegister: () => void; handleToggle: () => void; isLogin: boolean }> = ({ onRegister, handleToggle, isLogin }) => {
    const [name, setName] = useState('');
    const [firstname, setFirstname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [gender, setGender] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { t } = useTranslation();
    const [showPassword, setShowPassword] = useState<boolean>(false);  // Etat pour afficher/masquer le mot de passe

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
        <CenteredElement className="w-[90vw] sm:w-[80vw] md:w-1/2 lg:w-1/3">
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
                    {/* Boutons radio pour le genre */}
                    <div>
                        <LabelStyle>{t('gender')}</LabelStyle>
                        <RadioContainer>
                            <RadioLabel>
                                <RadioInput
                                    type="radio"
                                    name="gender"
                                    value="female"
                                    checked={gender === true}
                                    onChange={() => setGender(true)}
                                />
                                {t('female')}
                            </RadioLabel>
                            <RadioLabel>
                                <RadioInput
                                    type="radio"
                                    name="gender"
                                    value="male"
                                    checked={gender === false}
                                    onChange={() => setGender(false)}
                                />
                                {t('male')}
                            </RadioLabel>
                        </RadioContainer>
                    </div>
                    <div style={{ marginTop: '10px' }}>
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
                        <div style={{ position: 'relative' }}>
                            <InputStyle
                                type={showPassword ? 'text' : 'password'}  // Affiche ou masque le mot de passe en fonction de l'état
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            {/* Icône pour afficher/masquer le mot de passe */}
                            <div
                                onClick={() => setShowPassword(!showPassword)}  // Bascule entre afficher/masquer
                                style={{
                                    position: 'absolute',
                                    top: '40%',
                                    right: '20px',
                                    transform: 'translateY(-50%)',
                                    cursor: 'pointer',
                                }}
                            >
                                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                            </div>
                        </div>
                    </div>
                    <ButtonStyle type="submit" style={{ float: 'right' }}>{t('registerAction')}</ButtonStyle>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </form>
            )}
            {isLogin && (
                <p>
                    {t("noaccount")}{' '}
                    <SpanAuthentStyle onClick={handleToggle}>
                        {t("registeryou")}
                    </SpanAuthentStyle>
                </p>

            )}
        </CenteredElement>
    );
};

export default RegisterComponent;