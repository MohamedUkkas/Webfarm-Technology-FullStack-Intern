import { signInWithGoogle, signInWithFacebook } from "../auth"; // Ensure correct import

const OAuthButton = ({ provider }) => {
  const handleAuth = () => {
    if (provider === "google") {
      signInWithGoogle();
    } else if (provider === "facebook") {
      signInWithFacebook();
    }
  };

  return (
    <button
      type="button"
      onClick={handleAuth}
      className="flex items-center justify-center w-full p-3 rounded bg-gray-800 hover:bg-gray-700 text-white transition"
      aria-label={`Sign in with ${provider}`}
    >
      {provider === "google" ? (
        <img src="/google-icon.svg" alt="Google" className="w-6 h-6 mr-2" />
      ) : (
        <img src="/facebook-icon.svg" alt="Facebook" className="w-6 h-6 mr-2" />
      )}
      Sign in with {provider.charAt(0).toUpperCase() + provider.slice(1)}
    </button>
  );
};

export default OAuthButton;
