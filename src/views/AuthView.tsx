import { useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Eye, EyeOff, Loader2, ShieldCheck } from 'lucide-react';
import { useFirebase } from '../contexts/FirebaseContext';
import { useI18n } from '../hooks/useI18n';
import { EditorialImage } from '../components/EditorialImage';
import { LanguageSelector } from '../components/LanguageSelector';

type AuthMode = 'login' | 'signup' | 'forgot';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function AuthView() {
  const {
    signingIn,
    authError,
    clearAuthError,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    sendPasswordReset,
  } = useFirebase();
  const { t } = useI18n();

  const [mode, setMode] = useState<AuthMode>('login');

  // Form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Visibility toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Local validation & feedback
  const [localError, setLocalError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);

  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setLocalError(null);
    setResetSent(false);
    clearAuthError();
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearAuthError();

    const trimmedEmail = email.trim();
    if (!EMAIL_PATTERN.test(trimmedEmail)) {
      setLocalError(t.auth.errInvalidEmail);
      return;
    }
    if (!password) {
      setLocalError(t.auth.errMissingPassword);
      return;
    }

    await signInWithEmail(trimmedEmail, password);
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearAuthError();

    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();

    if (trimmedName.length < 2) {
      setLocalError(t.auth.errShortName);
      return;
    }
    if (!EMAIL_PATTERN.test(trimmedEmail)) {
      setLocalError(t.auth.errInvalidEmail);
      return;
    }
    if (password.length < 8) {
      setLocalError(t.auth.errShortPassword);
      return;
    }
    if (password !== confirmPassword) {
      setLocalError(t.auth.errPasswordMismatch);
      return;
    }

    await signUpWithEmail(trimmedName, trimmedEmail, password);
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearAuthError();

    const trimmedEmail = email.trim();
    if (!EMAIL_PATTERN.test(trimmedEmail)) {
      setLocalError(t.auth.errResetEmail);
      return;
    }

    const ok = await sendPasswordReset(trimmedEmail);
    if (ok) {
      setResetSent(true);
    }
  };

  const activeError = localError || authError;

  return (
    <div className="min-h-screen bg-[#F7F4EC] text-[#30342F] grid grid-cols-1 lg:grid-cols-12">
      {/* =====================================================================
          LEFT EDITORIAL BRAND PANEL — Deep Forest Signature Identity
         ===================================================================== */}
      <aside className="lg:col-span-6 xl:col-span-7 bg-[#34483D] text-[#F7F4EC] px-6 py-10 sm:px-12 lg:px-16 lg:py-14 flex flex-col justify-between relative overflow-hidden">
        {/* Top Wordmark */}
        <div className="flex items-baseline justify-between gap-4 border-b border-[#F7F4EC]/15 pb-6">
          <div>
            <p className="font-serif text-2xl sm:text-3xl font-semibold tracking-tight text-[#F7F4EC]">
              {t.common.brand}
            </p>
            <p className="text-xs sm:text-sm text-[#E9E2D5]/85 mt-1 tracking-wide">
              {t.common.tagline}
            </p>
          </div>
          <span className="text-xs uppercase tracking-[0.16em] text-[#E9E2D5]/70 hidden sm:inline">
            {t.auth.indiaAllStages}
          </span>
        </div>

        {/* Middle Editorial Story & Artwork */}
        <div className="my-10 lg:my-12 space-y-8 max-w-2xl">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.16em] text-[#D8A38E]">
              {t.auth.kicker}
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl xl:text-5xl font-semibold leading-[1.18] tracking-tight text-[#F7F4EC]">
              {t.auth.headline}
            </h1>
            <p className="text-sm sm:text-base text-[#E9E2D5]/85 leading-relaxed max-w-xl">
              {t.auth.subtitle}
            </p>
          </div>

          {/* Editorial Framed Artwork */}
          <div className="hidden sm:block border border-[#F7F4EC]/20 bg-[#26362D]/50 p-2.5 max-w-xl">
            <EditorialImage
              src="/src/assets/images/hero_editorial_pathways_1795234423898.jpg"
              alt="Architectural pathways representing educational choices across India"
              aspectClass="aspect-[16/8]"
            />
          </div>

          {/* Quiet Value Highlights (Zero Pills, Editorial Hairline Grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-4 border-t border-[#F7F4EC]/15 text-xs sm:text-sm">
            <div>
              <p className="font-serif text-base font-medium text-[#F7F4EC]">
                {t.auth.highlight1Title}
              </p>
              <p className="text-[#E9E2D5]/75 mt-1 leading-relaxed">
                {t.auth.highlight1Desc}
              </p>
            </div>
            <div>
              <p className="font-serif text-base font-medium text-[#F7F4EC]">
                {t.auth.highlight2Title}
              </p>
              <p className="text-[#E9E2D5]/75 mt-1 leading-relaxed">
                {t.auth.highlight2Desc}
              </p>
            </div>
            <div>
              <p className="font-serif text-base font-medium text-[#F7F4EC]">
                {t.auth.highlight3Title}
              </p>
              <p className="text-[#E9E2D5]/75 mt-1 leading-relaxed">
                {t.auth.highlight3Desc}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Footnote */}
        <div className="pt-5 border-t border-[#F7F4EC]/15 flex flex-wrap items-center justify-between gap-3 text-xs text-[#E9E2D5]/70">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#8B9B83]" />
            {t.auth.protectedFooter}
          </span>
          <span>{t.auth.stagesFooter}</span>
        </div>
      </aside>

      {/* =====================================================================
          RIGHT AUTHENTICATION PANEL — Warm Ivory Editorial Surface
         ===================================================================== */}
      <main className="lg:col-span-6 xl:col-span-5 px-5 py-8 sm:px-10 lg:px-12 xl:px-16 flex items-center justify-center">
        <div className="w-full max-w-md">
          {/* Language Switcher Row */}
          <div className="flex items-center justify-between gap-3 mb-5">
            <span className="text-xs uppercase tracking-[0.14em] text-[#5C625A]">
              {t.common.languageLabel}
            </span>
            <LanguageSelector showIcon ariaLabel={t.common.languageLabel} />
          </div>

          {/* Form Card */}
          <div className="bg-[#FCFBF7] border border-[#D9CFC0] p-7 sm:p-9">
            {/* Mode Header */}
            {mode === 'login' && (
              <div className="mb-7">
                <p className="text-xs uppercase tracking-[0.14em] text-[#B87961] mb-2">
                  {t.auth.signInKicker}
                </p>
                <h2 className="font-serif text-3xl font-semibold text-[#34483D] tracking-tight">
                  {t.auth.welcomeBack}
                </h2>
                <p className="text-sm text-[#5C625A] mt-2 leading-relaxed">
                  {t.auth.signInDesc}
                </p>
              </div>
            )}

            {mode === 'signup' && (
              <div className="mb-7">
                <p className="text-xs uppercase tracking-[0.14em] text-[#B87961] mb-2">
                  {t.auth.signUpKicker}
                </p>
                <h2 className="font-serif text-3xl font-semibold text-[#34483D] tracking-tight">
                  {t.auth.beginNextStep}
                </h2>
                <p className="text-sm text-[#5C625A] mt-2 leading-relaxed">
                  {t.auth.signUpDesc}
                </p>
              </div>
            )}

            {mode === 'forgot' && (
              <div className="mb-7">
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-[#34483D] hover:underline mb-4"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> {t.auth.backToSignIn}
                </button>
                <p className="text-xs uppercase tracking-[0.14em] text-[#B87961] mb-2">
                  {t.auth.recoveryKicker}
                </p>
                <h2 className="font-serif text-3xl font-semibold text-[#34483D] tracking-tight">
                  {t.auth.resetPasswordTitle}
                </h2>
                <p className="text-sm text-[#5C625A] mt-2 leading-relaxed">
                  {t.auth.resetPasswordDesc}
                </p>
              </div>
            )}

            {/* Error Banner */}
            {activeError && (
              <div
                role="alert"
                className="mb-5 text-sm text-[#9B3B2B] bg-[#FBF2EE] border border-[#E5BFB2] px-4 py-3 leading-relaxed"
              >
                {activeError}
              </div>
            )}

            {/* ===============================================================
                SIGN IN FORM
               =============================================================== */}
            {mode === 'login' && (
              <form onSubmit={handleLoginSubmit} noValidate className="space-y-4">
                <div>
                  <label
                    htmlFor="login-email"
                    className="block text-xs uppercase tracking-[0.12em] text-[#5C625A] mb-1.5"
                  >
                    {t.auth.emailLabel}
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (localError) setLocalError(null);
                    }}
                    placeholder={t.auth.emailPlaceholder}
                    className="w-full border border-[#D9CFC0] bg-[#F7F4EC] px-3.5 py-2.5 text-sm text-[#30342F] placeholder:text-[#8E9289] focus:outline-none focus:border-[#34483D]"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="login-password"
                      className="block text-xs uppercase tracking-[0.12em] text-[#5C625A]"
                    >
                      {t.auth.passwordLabel}
                    </label>
                    <button
                      type="button"
                      onClick={() => switchMode('forgot')}
                      className="text-xs font-medium text-[#34483D] hover:underline"
                    >
                      {t.auth.forgotPasswordLink}
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (localError) setLocalError(null);
                      }}
                      placeholder={t.auth.passwordPlaceholder}
                      className="w-full border border-[#D9CFC0] bg-[#F7F4EC] pl-3.5 pr-11 py-2.5 text-sm text-[#30342F] placeholder:text-[#8E9289] focus:outline-none focus:border-[#34483D]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={showPassword ? t.auth.hidePassword : t.auth.showPassword}
                      className="absolute inset-y-0 right-0 px-3 flex items-center text-[#5C625A] hover:text-[#34483D]"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={signingIn}
                  className="w-full py-3 px-4 bg-[#34483D] text-[#F7F4EC] text-sm font-medium hover:bg-[#26362D] transition-colors flex items-center justify-center gap-2 disabled:opacity-60 mt-2"
                >
                  {signingIn ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {t.auth.signingInBtn}
                    </>
                  ) : (
                    <>
                      {t.auth.signInBtn}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* ===============================================================
                SIGN UP FORM
               =============================================================== */}
            {mode === 'signup' && (
              <form onSubmit={handleSignUpSubmit} noValidate className="space-y-4">
                <div>
                  <label
                    htmlFor="signup-name"
                    className="block text-xs uppercase tracking-[0.12em] text-[#5C625A] mb-1.5"
                  >
                    {t.auth.fullNameLabel}
                  </label>
                  <input
                    id="signup-name"
                    type="text"
                    autoComplete="name"
                    required
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (localError) setLocalError(null);
                    }}
                    placeholder={t.auth.fullNamePlaceholder}
                    className="w-full border border-[#D9CFC0] bg-[#F7F4EC] px-3.5 py-2.5 text-sm text-[#30342F] placeholder:text-[#8E9289] focus:outline-none focus:border-[#34483D]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="signup-email"
                    className="block text-xs uppercase tracking-[0.12em] text-[#5C625A] mb-1.5"
                  >
                    {t.auth.emailLabel}
                  </label>
                  <input
                    id="signup-email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (localError) setLocalError(null);
                    }}
                    placeholder={t.auth.emailPlaceholder}
                    className="w-full border border-[#D9CFC0] bg-[#F7F4EC] px-3.5 py-2.5 text-sm text-[#30342F] placeholder:text-[#8E9289] focus:outline-none focus:border-[#34483D]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="signup-password"
                    className="block text-xs uppercase tracking-[0.12em] text-[#5C625A] mb-1.5"
                  >
                    {t.auth.passwordLabel}
                  </label>
                  <div className="relative">
                    <input
                      id="signup-password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (localError) setLocalError(null);
                      }}
                      placeholder={t.auth.newPasswordPlaceholder}
                      className="w-full border border-[#D9CFC0] bg-[#F7F4EC] pl-3.5 pr-11 py-2.5 text-sm text-[#30342F] placeholder:text-[#8E9289] focus:outline-none focus:border-[#34483D]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={showPassword ? t.auth.hidePassword : t.auth.showPassword}
                      className="absolute inset-y-0 right-0 px-3 flex items-center text-[#5C625A] hover:text-[#34483D]"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[11px] text-[#5C625A] mt-1">
                    {t.auth.passwordHint}
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="signup-confirm-password"
                    className="block text-xs uppercase tracking-[0.12em] text-[#5C625A] mb-1.5"
                  >
                    {t.auth.confirmPasswordLabel}
                  </label>
                  <div className="relative">
                    <input
                      id="signup-confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (localError) setLocalError(null);
                      }}
                      placeholder={t.auth.confirmPasswordPlaceholder}
                      className="w-full border border-[#D9CFC0] bg-[#F7F4EC] pl-3.5 pr-11 py-2.5 text-sm text-[#30342F] placeholder:text-[#8E9289] focus:outline-none focus:border-[#34483D]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      aria-label={showConfirmPassword ? t.auth.hidePassword : t.auth.showPassword}
                      className="absolute inset-y-0 right-0 px-3 flex items-center text-[#5C625A] hover:text-[#34483D]"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={signingIn}
                  className="w-full py-3 px-4 bg-[#34483D] text-[#F7F4EC] text-sm font-medium hover:bg-[#26362D] transition-colors flex items-center justify-center gap-2 disabled:opacity-60 mt-2"
                >
                  {signingIn ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {t.auth.creatingAccountBtn}
                    </>
                  ) : (
                    <>
                      {t.auth.createAccountBtn}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* ===============================================================
                FORGOT PASSWORD FORM
               =============================================================== */}
            {mode === 'forgot' && (
              <div className="space-y-4">
                {resetSent ? (
                  <div className="border border-[#8B9B83] bg-[#F2F6F0] p-5 space-y-3">
                    <div className="flex items-start gap-2.5 text-[#34483D]">
                      <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">{t.auth.resetSentTitle}</p>
                        <p className="text-xs text-[#5C625A] mt-1 leading-relaxed">
                          {t.auth.resetSentDescBefore} <strong>{email.trim()}</strong>{' '}
                          {t.auth.resetSentDescAfter}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => switchMode('login')}
                      className="w-full py-2.5 px-4 bg-[#34483D] text-[#F7F4EC] text-xs font-medium hover:bg-[#26362D]"
                    >
                      {t.auth.returnToSignIn}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleForgotSubmit} noValidate className="space-y-4">
                    <div>
                      <label
                        htmlFor="reset-email"
                        className="block text-xs uppercase tracking-[0.12em] text-[#5C625A] mb-1.5"
                      >
                        {t.auth.emailLabel}
                      </label>
                      <input
                        id="reset-email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (localError) setLocalError(null);
                        }}
                        placeholder={t.auth.emailPlaceholder}
                        className="w-full border border-[#D9CFC0] bg-[#F7F4EC] px-3.5 py-2.5 text-sm text-[#30342F] placeholder:text-[#8E9289] focus:outline-none focus:border-[#34483D]"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={signingIn}
                      className="w-full py-3 px-4 bg-[#34483D] text-[#F7F4EC] text-sm font-medium hover:bg-[#26362D] transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      {signingIn ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          {t.auth.sendingResetBtn}
                        </>
                      ) : (
                        t.auth.sendResetBtn
                      )}
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* ===============================================================
                GOOGLE SIGN-IN ALTERNATIVE (Shown on Login & Sign Up)
               =============================================================== */}
            {mode !== 'forgot' && (
              <>
                <div className="my-6 flex items-center gap-3">
                  <div className="h-px flex-1 bg-[#D9CFC0]" />
                  <span className="text-xs uppercase tracking-[0.12em] text-[#5C625A]">
                    {t.auth.orDivider}
                  </span>
                  <div className="h-px flex-1 bg-[#D9CFC0]" />
                </div>

                <button
                  type="button"
                  disabled={signingIn}
                  onClick={() => {
                    setLocalError(null);
                    signInWithGoogle();
                  }}
                  className="w-full py-2.5 px-4 bg-[#F7F4EC] border border-[#34483D]/40 text-[#30342F] text-sm font-medium hover:bg-[#E9E2D5] hover:border-[#34483D] transition-colors flex items-center justify-center gap-2.5 disabled:opacity-60"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
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
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  {t.auth.continueGoogle}
                </button>
              </>
            )}

            {/* Mode Switch Footer */}
            <div className="mt-7 pt-5 border-t border-[#E9E2D5] text-center text-sm text-[#5C625A]">
              {mode === 'login' ? (
                <p>
                  {t.auth.newToApp}{' '}
                  <button
                    type="button"
                    onClick={() => switchMode('signup')}
                    className="font-medium text-[#34483D] hover:underline"
                  >
                    {t.auth.createAnAccount}
                  </button>
                </p>
              ) : mode === 'signup' ? (
                <p>
                  {t.auth.alreadyHaveAccount}{' '}
                  <button
                    type="button"
                    onClick={() => switchMode('login')}
                    className="font-medium text-[#34483D] hover:underline"
                  >
                    {t.auth.signInLink}
                  </button>
                </p>
              ) : (
                <p>
                  {t.auth.rememberedPassword}{' '}
                  <button
                    type="button"
                    onClick={() => switchMode('login')}
                    className="font-medium text-[#34483D] hover:underline"
                  >
                    {t.auth.signInLink}
                  </button>
                </p>
              )}
            </div>
          </div>

          <p className="mt-5 text-center text-xs text-[#5C625A] leading-relaxed">
            {t.auth.privacyNote}
          </p>
        </div>
      </main>
    </div>
  );
}
