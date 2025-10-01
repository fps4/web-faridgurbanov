import { v4 as uuidv4 } from 'uuid'; // Import UUID library
import { useCookies } from 'react-cookie';

export function CookiesActions({ onAccept, onDecline }) {
    // useCookies returns [cookies, setCookie, removeCookie]
    const [cookies, setCookie, removeCookie] = useCookies(['user_consent']);

    const setCustomCookie = (cookieId, value, maxAge) => {
        setCookie(cookieId, value, {
            path: '/',
            maxAge, // Use the provided maxAge
            secure: true,
            sameSite: 'Strict',
        });
    };

    const setSessionCookie = (sessionId) => {
        setCustomCookie('session_id', sessionId, 60 * 60); // 60 minutes
    };

    const acceptCookies = () => {
        setCustomCookie('user_consent', 'accepted', 60 * 60 * 24 * 365); // 1 year
        if (!cookies.visitor_id) {
            setCustomCookie('visitor_id', uuidv4(), 60 * 60 * 24 * 365); // 1 year
        }
        if (onAccept) onAccept();
    };

    const declineCookies = () => {
        setCustomCookie('user_consent', 'declined', 60 * 60 * 24 * 365); // 1 year
        if (onDecline) onDecline();

    /* remove google analytics cookies (ensure root path) */
    removeCookie("_ga", { path: '/' });
    removeCookie("_gat", { path: '/' });
    removeCookie("_gid", { path: '/' });

    };
    return { acceptCookies, declineCookies, setSessionCookie };
}

