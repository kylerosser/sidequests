import signInWithGoogleImage from '/google_login_SI.png';
import signUpWithGoogleImage from '/google_login_SU.png';

type GoogleSignInButtonProps = {
  variant?: "sign-up" | "sign-in"
  redirect?: string | null // redirect URL passed in as state query param to google oauth url
};

const GOOGLE_CLIENT_ID = "561777665967-0r5br6a135gfkqod3ec8qi42ma4dfmhn.apps.googleusercontent.com"
const REDIRECT_URI = import.meta.env.PROD ? "https://sidequests.nz/google-callback" : "http://localhost:5173/google-callback"
const GOOGLE_OAUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth?client_id=" + GOOGLE_CLIENT_ID + "&redirect_uri=" + REDIRECT_URI + "&response_type=code&scope=openid%20email%20profile&access_type=offline&include_granted_scopes=true";

export const GoogleSignInButton = ({
    variant = "sign-up",
    redirect
}: GoogleSignInButtonProps) => {
    const chosenImage = (variant == "sign-in" ? signInWithGoogleImage : signUpWithGoogleImage)
    return (
        <a className = "mx-auto" href={GOOGLE_OAUTH_URL + (redirect ? "&state=" + redirect : "") }>
            <button className="cursor-pointer">
                <img className="h-[40px] w-auto" src={chosenImage}/>
            </button>
        </a>
    )
}
