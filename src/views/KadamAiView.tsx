import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Loader2,
  Mic,
  MicOff,
  Plus,
  Send,
  Sparkles,
  Trash2,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { api } from '../lib/api';
import { scrollIntoViewIfNeeded } from '../lib/smartScroll';
import { useFirebase } from '../contexts/FirebaseContext';
import { useI18n } from '../hooks/useI18n';
import { ENGAGEMENT_STRINGS } from '../i18n/engagementStrings';
import { useVoice } from '../hooks/useVoice';
import { LanguageSelector } from '../components/LanguageSelector';
import type { ChatMessage, LanguageCode } from '../types/domain';

interface KadamAiViewProps {
  initialPrompt?: string | null;
  initialContextSlug?: string | null;
  onClearInitialPrompt: () => void;
  onOpenGuide: (slug: string) => void;
}

export function KadamAiView({
  initialPrompt,
  initialContextSlug,
  onClearInitialPrompt,
  onOpenGuide,
}: KadamAiViewProps) {
  const {
    user,
    preferredLanguage,
    setPreferredLanguage,
    studentProfile,
    conversations,
    saveConversation,
    deleteConversation,
  } = useFirebase();
  const { t, getGuideListMeta } = useI18n();
  const {
    recording,
    transcribing,
    speakingId,
    voiceError,
    startRecording,
    stopRecording,
    speakText,
    stopSpeaking,
  } = useVoice();

  const [language, setLanguage] = useState<LanguageCode>(preferredLanguage);
  const [noStupidMode, setNoStupidMode] = useState(true);
  const [activeConvId, setActiveConvId] = useState<string | undefined>(undefined);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activePromptCat, setActivePromptCat] = useState<string>('pathways');
  const transcriptRef = useRef<HTMLDivElement | null>(null);
  const chatPanelRef = useRef<HTMLDivElement | null>(null);

  const engAi = ENGAGEMENT_STRINGS[language].kadamAi;

  useEffect(() => {
    setLanguage(preferredLanguage);
  }, [preferredLanguage]);

  useEffect(() => {
    if (initialPrompt) {
      const promptToSend = initialPrompt;
      onClearInitialPrompt();
      handleSend(promptToSend, initialContextSlug || undefined);
    }
  }, [initialPrompt]);

  useEffect(() => {
    if (messages.length === 0 && !loading) return;
    const container = transcriptRef.current;
    if (!container) return;
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    container.scrollTo({
      top: container.scrollHeight,
      behavior: prefersReduced ? 'auto' : 'smooth',
    });
  }, [messages, loading]);

  const handleLanguageSwitch = (nextLang: LanguageCode) => {
    setLanguage(nextLang);
    setPreferredLanguage(nextLang);
  };

  const handleSend = async (overrideText?: string, contextSlug?: string) => {
    const text = (overrideText ?? input).trim();
    if (!text || loading) return;

    setError(null);
    if (!overrideText) setInput('');

    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };

    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
    setLoading(true);

    try {
      const res = await api.sendChat({
        message: text,
        history: nextHistory.slice(0, -1),
        language,
        noStupidMode,
        contextGuideSlug: contextSlug,
        studentProfile,
      });

      const assistantMsg: ChatMessage = {
        id: `a_${Date.now()}`,
        role: 'assistant',
        content: res.reply,
        citedGuides: res.citedGuides,
        isAiSuggestion: res.isAiSuggestion,
        timestamp: new Date().toISOString(),
      };

      const fullMessages = [...nextHistory, assistantMsg];
      setMessages(fullMessages);

      if (user) {
        const title = fullMessages[0]?.content.slice(0, 72) || 'Kadam AI Conversation';
        const savedId = await saveConversation({
          id: activeConvId,
          title,
          language,
          noStupidMode,
          messages: fullMessages,
        });
        if (savedId && !activeConvId) setActiveConvId(savedId);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kadam AI could not respond right now.');
    } finally {
      setLoading(false);
    }
  };

  const startNewThread = () => {
    stopSpeaking();
    setActiveConvId(undefined);
    setMessages([]);
    setError(null);
    scrollIntoViewIfNeeded(chatPanelRef.current);
  };

  const loadThread = (convId: string) => {
    const target = conversations.find((c) => c.id === convId);
    if (!target) return;
    stopSpeaking();
    setActiveConvId(target.id);
    setLanguage(target.language);
    setNoStupidMode(target.noStupidMode ?? true);
    setMessages(target.messages || []);
    setError(null);
    scrollIntoViewIfNeeded(chatPanelRef.current);
  };

  const selectedCategory =
    engAi.categories.find((c) => c.id === activePromptCat) || engAi.categories[0];

  const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;
  const contextualFollowUps = (() => {
    if (!lastMessage || lastMessage.role !== 'assistant' || loading) return [];
    const cited = lastMessage.citedGuides?.[0];
    if (cited) {
      const localized = getGuideListMeta(cited.slug, cited.title, '');
      return engAi.followUpsWithGuide(localized.title);
    }
    return engAi.followUpsDefault;
  })();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 border-b border-[#D9CFC0] pb-6">
        <div className="space-y-2 max-w-2xl">
          <p className="text-xs uppercase tracking-widest text-[#B87961]">
            {t.kadamAi.kicker}
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#34483D]">
            {t.kadamAi.title}
          </h1>
          <p className="text-sm text-[#5C625A]">
            {t.kadamAi.subtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {/* Language Switch (English / Telugu / Hindi) */}
          <LanguageSelector
            value={language}
            onChange={handleLanguageSwitch}
            showIcon
            ariaLabel={t.common.languageLabel}
          />

          {/* No-Question-Is-Stupid Mode */}
          <label className="inline-flex items-center gap-2 text-xs font-medium text-[#34483D] border border-[#D9CFC0] bg-[#FCFBF7] px-3.5 py-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={noStupidMode}
              onChange={(e) => setNoStupidMode(e.target.checked)}
              className="accent-[#34483D] w-4 h-4"
            />
            {t.kadamAi.noStupidMode}
          </label>
        </div>
      </div>

      {/* Main Split Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Saved Conversation Sidebar */}
        <aside className="lg:col-span-3 lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto border border-[#D9CFC0] bg-[#FCFBF7] p-4 space-y-4">
          <button
            type="button"
            onClick={startNewThread}
            className="w-full py-2.5 px-3 bg-[#34483D] text-[#F7F4EC] text-xs font-medium hover:bg-[#26362D] transition-colors inline-flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> {t.kadamAi.newConversation}
          </button>

          <div className="space-y-1">
            <p className="text-xs uppercase tracking-widest text-[#5C625A] px-1">
              {t.kadamAi.savedConversations}
            </p>
            {conversations.length === 0 ? (
              <p className="text-xs text-[#5C625A] p-2 leading-relaxed">
                {engAi.emptyHistoryEncouragement}
              </p>
            ) : (
              <div className="divide-y divide-[#E9E2D5]">
                {conversations.map((c) => (
                  <div
                    key={c.id}
                    className={`flex items-center justify-between gap-2 px-2 py-2.5 text-xs transition-colors ${
                      activeConvId === c.id ? 'bg-[#E9E2D5] text-[#34483D] font-medium' : 'text-[#30342F]'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => loadThread(c.id)}
                      className="text-left truncate flex-1 hover:text-[#34483D]"
                    >
                      {c.title}
                    </button>
                    <button
                      type="button"
                      aria-label={t.common.delete}
                      onClick={() => {
                        deleteConversation(c.id);
                        if (activeConvId === c.id) startNewThread();
                      }}
                      className="text-[#5C625A] hover:text-[#B87961] shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* Chat Transcript + Voice Composer */}
        <div
          ref={chatPanelRef}
          className="lg:col-span-9 scroll-target border border-[#D9CFC0] bg-[#FCFBF7] flex flex-col min-h-[560px]"
        >
          <div
            ref={transcriptRef}
            className="flex-1 p-5 sm:p-7 space-y-6 overflow-y-auto max-h-[600px]"
          >
            {messages.length === 0 ? (
              <div className="py-4 space-y-6">
                <div className="space-y-2 max-w-2xl">
                  <h2 className="font-serif text-2xl text-[#34483D]">
                    {t.kadamAi.welcomeTitle}
                  </h2>
                  <p className="text-sm text-[#5C625A] leading-relaxed">
                    {t.kadamAi.welcomeSubtitle}
                  </p>
                </div>

                {/* Friendly Categorized Starter Questions */}
                <div className="space-y-3">
                  <p className="text-xs uppercase tracking-widest text-[#B87961] inline-flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> {engAi.suggestedHeading}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {engAi.categories.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setActivePromptCat(cat.id)}
                        className={`px-3.5 py-1.5 text-xs font-medium border transition-colors ${
                          selectedCategory.id === cat.id
                            ? 'bg-[#34483D] text-[#F7F4EC] border-[#34483D]'
                            : 'bg-[#F7F4EC] text-[#30342F] border-[#D9CFC0] hover:border-[#34483D]'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    {selectedCategory.prompts.map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => handleSend(q)}
                        className="group text-left p-4 border border-[#D9CFC0] bg-[#F7F4EC] editorial-card flex items-start justify-between gap-3 text-sm text-[#30342F] leading-relaxed"
                      >
                        <span>{q}</span>
                        <ArrowRight className="w-4 h-4 text-[#B87961] shrink-0 mt-1 editorial-arrow" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* General Quick Starters */}
                <div className="pt-3 border-t border-[#E9E2D5] space-y-2.5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {t.kadamAi.starters.slice(0, 2).map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => handleSend(q)}
                        className="text-left px-3.5 py-2.5 border border-[#E9E2D5] bg-[#FCFBF7] hover:border-[#34483D] text-xs text-[#5C625A] hover:text-[#34483D] leading-relaxed transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-[#5C625A]">{engAi.tipLine}</p>
                </div>
              </div>
            ) : (
              <>
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`space-y-3 ${
                      msg.role === 'user'
                        ? 'ml-auto max-w-2xl bg-[#34483D] text-[#F7F4EC] p-4 sm:p-5'
                        : 'mr-auto max-w-3xl bg-[#F7F4EC] border border-[#E9E2D5] p-5 sm:p-6'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4 text-xs opacity-75">
                      <span>
                        {msg.role === 'user'
                          ? t.kadamAi.youLabel
                          : t.kadamAi.assistantHeader}
                      </span>
                      {msg.role === 'assistant' && (
                        <button
                          type="button"
                          onClick={() => speakText(msg.id, msg.content, language)}
                          className="inline-flex items-center gap-1 text-[#34483D] hover:text-[#B87961] font-medium opacity-100 transition-colors"
                        >
                          {speakingId === msg.id ? (
                            <>
                              <VolumeX className="w-3.5 h-3.5" /> {t.common.stopAudio}
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-3.5 h-3.5" /> {t.common.listen}
                            </>
                          )}
                        </button>
                      )}
                    </div>

                    <div className="text-sm sm:text-[15px] leading-relaxed whitespace-pre-wrap">
                      {msg.content}
                    </div>

                    {/* Verified Catalog Guide Citations */}
                    {msg.citedGuides && msg.citedGuides.length > 0 && (
                      <div className="pt-3 border-t border-[#D9CFC0] space-y-2">
                        <p className="text-xs uppercase tracking-widest text-[#34483D] font-medium inline-flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5" /> {t.kadamAi.citedGuidesHeading}
                        </p>
                        <div className="flex flex-wrap gap-x-5 gap-y-1.5">
                          {msg.citedGuides.map((g) => {
                            const localized = getGuideListMeta(g.slug, g.title, '');
                            return (
                              <button
                                key={g.slug}
                                type="button"
                                onClick={() => onOpenGuide(g.slug)}
                                className="text-xs font-medium text-[#34483D] underline underline-offset-4 hover:text-[#B87961] transition-colors"
                              >
                                {localized.title} →
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Contextual Follow-Up Suggestions */}
                {contextualFollowUps.length > 0 && (
                  <div className="max-w-3xl pt-1 space-y-2">
                    <p className="text-xs uppercase tracking-widest text-[#5C625A]">
                      {engAi.followUpHeading}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {contextualFollowUps.map((q) => (
                        <button
                          key={q}
                          type="button"
                          onClick={() => handleSend(q)}
                          className="text-left px-3.5 py-2 border border-[#D9CFC0] bg-[#FCFBF7] hover:border-[#34483D] hover:bg-[#F7F4EC] text-xs text-[#34483D] transition-colors"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {loading && (
              <div className="inline-flex items-center gap-2 text-xs text-[#5C625A] p-3">
                <Loader2 className="w-4 h-4 animate-spin text-[#34483D]" />
                {t.kadamAi.thinkingText}
              </div>
            )}

            {(error || voiceError) && (
              <div className="p-3.5 border border-[#B87961] bg-[#B87961]/10 text-xs text-[#9B5F49]">
                {error || voiceError}
              </div>
            )}
          </div>

          {/* Input & Voice Composer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="border-t border-[#D9CFC0] p-4 bg-[#F7F4EC] flex items-end gap-3"
          >
            <button
              type="button"
              disabled={transcribing}
              onClick={() => {
                if (recording) {
                  stopRecording();
                } else {
                  startRecording(language, (transcript) => {
                    setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
                  });
                }
              }}
              title={recording ? t.kadamAi.voiceStopTitle : t.kadamAi.voiceStartTitle}
              aria-label={recording ? t.kadamAi.voiceStopTitle : t.kadamAi.voiceStartTitle}
              className={`p-3 border transition-colors shrink-0 ${
                recording
                  ? 'bg-[#B87961] text-[#FCFBF7] border-[#B87961]'
                  : 'bg-[#FCFBF7] text-[#34483D] border-[#D9CFC0] hover:bg-[#E9E2D5]'
              }`}
            >
              {transcribing ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : recording ? (
                <MicOff className="w-5 h-5" />
              ) : (
                <Mic className="w-5 h-5" />
              )}
            </button>

            <textarea
              rows={2}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={
                recording ? t.kadamAi.recordingPlaceholder : t.kadamAi.inputPlaceholder
              }
              className="flex-1 bg-[#FCFBF7] border border-[#D9CFC0] p-3 text-sm text-[#30342F] focus:outline-none focus:border-[#34483D] resize-none"
            />

            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-5 py-3 bg-[#34483D] text-[#F7F4EC] text-sm font-medium hover:bg-[#26362D] transition-colors disabled:opacity-50 inline-flex items-center gap-2 shrink-0"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">{t.kadamAi.sendBtn}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
