import { useTranslation } from "react-i18next";
import { CenteredContainerLoadingStyle, LoadingSpinnerStyle, LoadingTextStyle } from "../../styles/GlobalStyles";




const LoadingComponent: React.FC = () => {
    const { t } = useTranslation();

    return (
        <CenteredContainerLoadingStyle>
            <LoadingSpinnerStyle />
            <LoadingTextStyle>{t('loading')}...</LoadingTextStyle>
        </CenteredContainerLoadingStyle>
    );
};

export default LoadingComponent;