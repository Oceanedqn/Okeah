import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CenteredElement, CustomRadioStyle, InputStyle, LabelStyle, RadioInputStyle, RadioLabelStyle } from '../../styles/AuthenticationStyles';
import { ButtonStyle, TitleH1Style } from '../../styles/GlobalStyles';
import { useTranslation } from 'react-i18next';
import { register_async } from '../../services/authentication/registerService';

const RegisterComponent: React.FC<{ onRegister: () => void; handleToggle: () => void; isLogin: boolean }> = ({ onRegister, handleToggle, isLogin }) => {
    const [name, setName] = useState('');
    const [firstname, setFirstname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [gender, setGender] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleRegister = async (event: React.FormEvent) => {
        event.preventDefault();
        setError(null);

        try {
            const registerData = { name, firstname, mail: email, password, gender };
            await register_async(registerData);
            navigate('/login'); // Redirect to home after registration
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
            <TitleH1Style>{t('register')}</TitleH1Style>
            {isLogin ? (
                <p>
                    Vous avez déjà un compte ?{' '}
                    <span onClick={handleToggle} style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}>
                        Connectez-vous
                    </span>
                </p>
            ) : (
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
                    <div>
                        <LabelStyle>{t('gender')}</LabelStyle>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <RadioLabelStyle style={{ marginRight: '20px' }}>
                                <RadioInputStyle
                                    type="radio"
                                    name="gender"
                                    value="true"
                                    checked={gender === true}
                                    onChange={() => setGender(true)}
                                />
                                <CustomRadioStyle />
                                {t('female')}
                            </RadioLabelStyle>
                            <RadioLabelStyle>
                                <RadioInputStyle
                                    type="radio"
                                    name="gender"
                                    value="false"
                                    checked={gender === false}
                                    onChange={() => setGender(false)}
                                />
                                <CustomRadioStyle />
                                {t('male')}
                            </RadioLabelStyle>
                        </div>
                    </div>
                    <ButtonStyle type="submit" style={{ float: 'right' }}>{t('registerAction')}</ButtonStyle>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </form>
            )}
        </CenteredElement>
    );
};

export default RegisterComponent;