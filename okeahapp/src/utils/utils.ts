import Cookies from "js-cookie";

export const checkCookie = (): string => {
    const accessToken = Cookies.get('access_token');
    if (!accessToken) {
        throw new Error('No access token found');
    }
    return accessToken;
};