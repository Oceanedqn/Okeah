import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Importer le hook useTranslation
import { ButtonStyle, ContainerUnderTitleStyle, SpaceStyle, TextStyle, Title2Style } from '../../styles/GlobalStyles';
import { EnigmatoContainerStyle } from '../../styles/EnigmatoStyles';
import { createPartyAsync } from '../../services/enigmato/enigmatoPartiesService'; // Service pour créer la partie
import HeaderTitleComponent from '../../components/base/HeaderTitleComponent';
import { IEnigmatoPartyCreateRequest } from '../../interfaces/IEnigmato';  // Modèle pour une partie

const EnigmatoCreateParty: React.FC = () => {
    const { t } = useTranslation(); // Déclarer la fonction de traduction
    const navigate = useNavigate();

    // État pour les données du formulaire
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [dateStart, setDateStart] = useState('');
    const [gameMode, setGameMode] = useState(1); // Par défaut, mode de jeu 1
    const [numberOfBox, setNumberOfBox] = useState(1); // Par défaut, 1 boîte
    const [includeWeekends, setIncludeWeekends] = useState(true); // Par défaut, inclure les week-ends
    const [isPasswordRequired, setIsPasswordRequired] = useState(false); // Nouvel état pour savoir si un mot de passe est requis

    // États de validation et de chargement
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleBack = () => {
        navigate(`/enigmato/home`);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const newParty: IEnigmatoPartyCreateRequest = {
            name: name,
            password: isPasswordRequired ? password : "", // Si isPasswordRequired est true, on envoie le mot de passe, sinon on envoie une chaîne vide
            date_start: dateStart,
            game_mode: gameMode,
            number_of_box: numberOfBox,
            include_weekends: includeWeekends,
            set_password: isPasswordRequired
        };

        try {
            await createPartyAsync(newParty, navigate); // Appel du service pour créer la partie
            navigate(`/enigmato/parties`); // Redirige vers la page du jeu
        } catch (err: any) { // TypeScript demande de gérer le type de `err`
            setError(err?.message || 'Impossible de créer la partie.'); // Affiche l'erreur réelle retournée par l'API
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <HeaderTitleComponent title={t('create_game')} onBackClick={handleBack} />
            <ContainerUnderTitleStyle>
                <EnigmatoContainerStyle>
                    <Title2Style>{t('create_new_party')}</Title2Style>
                    <TextStyle>{t('fill_in_the_form')}</TextStyle>

                    <form onSubmit={handleSubmit}>
                        <div>
                            <label>{t('party_name')}</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                placeholder={t('enter_party_name')}
                            />
                        </div>

                        <div>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={isPasswordRequired}
                                    onChange={() => setIsPasswordRequired((prev) => !prev)} // Toggle de l'état isPasswordRequired
                                />
                                {t('set_password')}
                            </label>
                        </div>

                        {/* Affichage du champ mot de passe uniquement si isPasswordRequired est true */}
                        {isPasswordRequired && (
                            <div>
                                <label>{t('password')}</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required={isPasswordRequired} // Si isPasswordRequired est true, rendre le champ requis
                                    placeholder={t('enter_password')}
                                />
                            </div>
                        )}

                        <div>
                            <label>{t('start_date')}</label>
                            <input
                                type="date"
                                value={dateStart}
                                onChange={(e) => setDateStart(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label>{t('game_mode')}</label>
                            <select value={gameMode} onChange={(e) => setGameMode(Number(e.target.value))}>
                                <option value={1}>{t('mode_1')}</option>
                                <option value={2}>{t('mode_2')}</option>
                                <option value={3}>{t('mode_3')}</option>
                            </select>
                        </div>

                        <div>
                            <label>{t('number_of_boxes')}</label>
                            <input
                                type="number"
                                value={numberOfBox}
                                onChange={(e) => setNumberOfBox(Number(e.target.value))}
                                min={1}
                                required
                            />
                        </div>

                        <div>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={includeWeekends}
                                    onChange={() => setIncludeWeekends((prev) => !prev)}
                                />
                                {t('include_weekends')}
                            </label>
                        </div>

                        {error && <TextStyle>{error}</TextStyle>}

                        <SpaceStyle />
                        <ButtonStyle type="submit" disabled={loading}>{loading ? t('loading') : t('create_party')}</ButtonStyle>
                    </form>
                </EnigmatoContainerStyle>
            </ContainerUnderTitleStyle>
        </>
    );
};

export default EnigmatoCreateParty;