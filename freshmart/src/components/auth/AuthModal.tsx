import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Mail, 
  Lock, 
  ArrowRight, 
  User as UserIcon, 
  Check 
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../services/firebase';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authIntent,
    loginWithGoogle,
    loginWithEmail,
    signupWithEmail,
    setCurrentView
  } = useStore();

  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [resetSent, setResetSent] = useState(false);

  if (!isAuthModalOpen) return null;

  // Title and subtitle depending on auth intent
  const getIntentDetails = () => {
    switch (authIntent) {
      case 'wishlist':
        return {
          title: 'Save this product',
          subtitle: 'Sign in to save items to your wishlist and receive restock alerts.'
        };
      case 'checkout':
        return {
          title: 'Sign in to checkout',
          subtitle: 'Your guest basket items will be preserved and merged with your account.'
        };
      case 'admin':
        return {
          title: 'Store Operations Sign In',
          subtitle: 'Sign in with your registered email to access management and staff tools.'
        };
      case 'account':
        return {
          title: 'My FreshMart Account',
          subtitle: 'Sign in to manage your addresses, active orders, and saved preferences.'
        };
      default:
        return {
          title: 'Welcome to FreshMart',
          subtitle: 'Continue your grocery journey with fast 30-min deliveries.'
        };
    }
  };

  const { title, subtitle } = getIntentDetails();

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const session = await loginWithGoogle(email.trim() || undefined);
      if (session.targetState) {
        setCurrentView(session.targetState);
      } else {
        setCurrentView('storefront');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Could not complete Google sign-in. Please select an account or enter your email below.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter both your email address and password.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    const res = await loginWithEmail(email.trim(), password);
    setIsLoading(false);
    if (!res.success) {
      setErrorMessage(res.message || 'Invalid email or password.');
      return;
    }

    // Role-based routing:
    // mohamedukkas.ai@gmail.com -> 'admin' (Admin Console)
    // Assigned Store Managers -> 'admin' (Operations & Staff Management)
    // Assigned Staff -> 'staff' (Dedicated Staff Duty Workspace)
    // Regular customers -> 'storefront'
    if (res.session?.targetState) {
      setCurrentView(res.session.targetState);
    } else {
      setCurrentView('storefront');
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim()) {
      setErrorMessage('First name is required.');
      return;
    }
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please provide a valid email and password.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }
    if (!agreeTerms) {
      setErrorMessage('Please agree to terms and privacy policy.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    const res = await signupWithEmail({
      firstName,
      lastName,
      email: email.trim(),
      password
    });
    setIsLoading(false);
    if (!res.success) {
      setErrorMessage(res.message || 'Could not create account.');
      return;
    }

    if (res.session?.targetState) {
      setCurrentView(res.session.targetState);
    } else {
      setCurrentView('storefront');
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    setErrorMessage('');
    if (!auth) {
      setErrorMessage('Password reset is unavailable until Firebase is configured.');
      return;
    }
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setResetSent(true);
    } catch (error: any) {
      setErrorMessage(error?.message || 'Could not send password reset email.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        onClick={closeAuthModal}
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
      />

      <div className="min-h-screen px-4 text-center flex items-center justify-center py-6 sm:py-10">
        <div 
          onClick={(e) => e.stopPropagation()}
          className="inline-block w-full max-w-md text-left bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden transform transition-all relative z-10 p-6 sm:p-8 my-4"
        >
          {/* Close button */}
          <button
            onClick={closeAuthModal}
            className="absolute top-5 right-5 p-2 rounded-xl text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-emerald-800 text-white flex items-center justify-center mx-auto mb-3 font-display font-extrabold text-xl shadow-xs">
              F
            </div>
            <h2 className="font-display font-extrabold text-2xl text-stone-900 tracking-tight">
              {mode === 'forgot' ? 'Reset Password' : mode === 'signup' ? 'Create an Account' : title}
            </h2>
            <p className="text-xs text-stone-600 mt-1 max-w-xs mx-auto leading-relaxed">
              {mode === 'forgot' 
                ? 'Enter your registered email to receive password reset instructions.'
                : mode === 'signup'
                ? 'Register with FreshMart to track deliveries and save favorite items.'
                : subtitle}
            </p>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
              {errorMessage}
            </div>
          )}

          {/* FORGOT PASSWORD MODE */}
          {mode === 'forgot' ? (
            resetSent ? (
              <div className="text-center py-4 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <div className="text-xs text-stone-700">
                  Password reset link sent to <strong>{email}</strong>. Check your inbox and spam folder.
                </div>
                <button
                  onClick={() => {
                    setResetSent(false);
                    setMode('signin');
                  }}
                  className="w-full py-2.5 bg-stone-900 text-white rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-stone-700">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full mt-1 px-3.5 py-2.5 text-xs bg-stone-50 rounded-xl border border-stone-200 outline-none focus:border-emerald-700"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Send Reset Link
                </button>
                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setMode('signin')}
                    className="text-xs font-semibold text-stone-600 hover:text-stone-900 cursor-pointer"
                  >
                    Back to Sign In
                  </button>
                </div>
              </form>
            )
          ) : (
            /* SIGN IN OR SIGN UP MODE */
            <div className="space-y-4">
              
              {/* Google OAuth Button */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-800 font-semibold text-xs flex items-center justify-center gap-2.5 shadow-2xs transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              <div className="relative flex items-center justify-center">
                <div className="border-t border-stone-200 w-full" />
                <span className="bg-white px-3 text-[11px] font-medium uppercase tracking-wider text-stone-600 absolute">
                  or with email
                </span>
              </div>

              {mode === 'signin' ? (
                /* Sign In Form */
                <form onSubmit={handleEmailLogin} className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full px-3.5 py-2.5 text-xs bg-stone-50 rounded-xl border border-stone-200 outline-none focus:border-emerald-700 font-medium text-stone-900"
                      required
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-semibold text-stone-700">Password</label>
                      <button
                        type="button"
                        onClick={() => setMode('forgot')}
                        className="text-[11px] text-stone-600 hover:text-emerald-800 cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full px-3.5 py-2.5 text-xs bg-stone-50 rounded-xl border border-stone-200 outline-none focus:border-emerald-700"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    {isLoading ? 'Signing In...' : 'Sign In'}
                  </button>

                  <div className="text-center pt-1 text-xs text-stone-600">
                    <span>Don't have an account? </span>
                    <button
                      type="button"
                      onClick={() => setMode('signup')}
                      className="font-bold text-emerald-800 hover:text-emerald-900 cursor-pointer"
                    >
                      Create account
                    </button>
                  </div>
                </form>
              ) : (
                /* Sign Up Form */
                <form onSubmit={handleSignup} className="space-y-3">
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-xs font-semibold text-stone-700">First name</label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="First name"
                        className="w-full mt-1 px-3.5 py-2 text-xs bg-stone-50 rounded-xl border border-stone-200 outline-none focus:border-emerald-700"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-stone-700">Last name</label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Last name"
                        className="w-full mt-1 px-3.5 py-2 text-xs bg-stone-50 rounded-xl border border-stone-200 outline-none focus:border-emerald-700"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-700">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full mt-1 px-3.5 py-2 text-xs bg-stone-50 rounded-xl border border-stone-200 outline-none focus:border-emerald-700"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-xs font-semibold text-stone-700">Password</label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full mt-1 px-3.5 py-2 text-xs bg-stone-50 rounded-xl border border-stone-200 outline-none focus:border-emerald-700"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-stone-700">Confirm</label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full mt-1 px-3.5 py-2 text-xs bg-stone-50 rounded-xl border border-stone-200 outline-none focus:border-emerald-700"
                        required
                      />
                    </div>
                  </div>

                  <label className="flex items-center gap-2 text-xs text-stone-600 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="rounded border-stone-300 text-emerald-800 accent-emerald-800"
                    />
                    <span>I agree to the Terms of Service & Privacy Policy</span>
                  </label>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    {isLoading ? 'Creating account...' : 'Create Account'}
                  </button>

                  <div className="text-center pt-1 text-xs text-stone-600">
                    <span>Already have an account? </span>
                    <button
                      type="button"
                      onClick={() => setMode('signin')}
                      className="font-bold text-emerald-800 hover:text-emerald-900 cursor-pointer"
                    >
                      Sign in
                    </button>
                  </div>
                </form>
              )}

              {/* Maybe later button for Wishlist prompt */}
              {authIntent === 'wishlist' && (
                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={closeAuthModal}
                    className="text-xs text-stone-600 hover:text-stone-900 font-medium cursor-pointer"
                  >
                    Maybe later
                  </button>
                </div>
              )}

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
