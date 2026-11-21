import { Globe } from 'lucide-react';
import { LANGUAGE_OPTIONS } from '../i18n/translations';
import { useFirebase } from '../contexts/FirebaseContext';
import type { LanguageCode } from '../types/domain';

interface LanguageSelectorProps {
  value?: LanguageCode;
  onChange?: (lang: LanguageCode) => void;
  compact?: boolean;
  showIcon?: boolean;
  ariaLabel?: string;
}

export function LanguageSelector({
  value,
  onChange,
  compact = false,
  showIcon = false,
  ariaLabel = 'Select language',
}: LanguageSelectorProps) {
  const { preferredLanguage, setPreferredLanguage } = useFirebase();
  const activeLang = value ?? preferredLanguage;

  const handleSelect = (next: LanguageCode) => {
    if (onChange) {
      onChange(next);
    } else {
      setPreferredLanguage(next);
    }
  };

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className="inline-flex items-center border border-[#D9CFC0] bg-[#FCFBF7] shrink-0"
    >
      {showIcon && (
        <span className="pl-2.5 pr-1 text-[#5C625A] hidden sm:inline-flex items-center" aria-hidden="true">
          <Globe className="w-3.5 h-3.5" />
        </span>
      )}
      {LANGUAGE_OPTIONS.map((opt) => {
        const isActive = activeLang === opt.code;
        return (
          <button
            key={opt.code}
            type="button"
            lang={opt.code}
            aria-pressed={isActive}
            onClick={() => handleSelect(opt.code)}
            className={`${
              compact ? 'px-2.5 py-1.5 text-xs' : 'px-3 py-1.5 text-xs'
            } font-medium whitespace-nowrap transition-colors ${
              isActive
                ? 'bg-[#34483D] text-[#F7F4EC]'
                : 'text-[#30342F] hover:bg-[#E9E2D5]'
            }`}
          >
            {opt.nativeLabel}
          </button>
        );
      })}
    </div>
  );
}
