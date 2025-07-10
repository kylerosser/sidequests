import signInWithGoogleImage from '/google_login_SI.png';
import signUpWithGoogleImage from '/google_login_SU.png';

type GoogleSignInButtonProps = {
  variant?: "sign-up" | "sign-in"
};

const GOOGLE_CLIENT_ID = "561777665967-0r5br6a135gfkqod3ec8qi42ma4dfmhn.apps.googleusercontent.com"
const REDIRECT_URI = "http://localhost:5173/google-callback"
const GOOGLE_OAUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth?client_id=" + GOOGLE_CLIENT_ID + "&redirect_uri=" + REDIRECT_URI + "&response_type=code&scope=openid%20email%20profile&access_type=offline&include_granted_scopes=true";

export const GoogleSignInButton = ({
    variant = "sign-up"
}: GoogleSignInButtonProps) => {
    const chosenImage = (variant == "sign-in" ? signInWithGoogleImage : signUpWithGoogleImage)
    return (
        <a className = "mx-auto" href={GOOGLE_OAUTH_URL}>
            <button className="cursor-pointer">
                <img className="h-[40px] w-auto" src={chosenImage}/>
            </button>
        </a>
    )
}
