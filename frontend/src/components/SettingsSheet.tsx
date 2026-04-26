import { useEffect } from 'react'
import type { UIStrings } from '../i18n/strings'
import type { ConversationPartner, VoiceProfile } from '../types'
import type { Language, LanguagePair } from '../types/languages'
import { findLang } from '../types/languages'

interface SettingsSheetProps {
  open: boolean
  onClose: () => void
  strings: UIStrings
  langPair: LanguagePair
  voiceProfile: VoiceProfile | null
  partner: ConversationPartner | null
  onReconfigureMyVoice: () => void
  onReconfigurePartner: () => void
  onRemovePartner: () => void
  onChangeLanguages: () => void
}

export default function SettingsSheet({
  open,
  onClose,
  strings: t,
  langPair,
  voiceProfile,
  partner,
  onReconfigureMyVoice,
  onReconfigurePartner,
  onRemovePartner,
  onChangeLanguages,
}: SettingsSheetProps) {
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const partnerLang: Language | null = partner ? findLang(partner.langSpeechCode) ?? null : null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-ink/40 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={t.settings}
    >
      <div
        className="relative w-full sm:max-w-md mx-0 sm:mx-4 bg-crema rounded-t-3xl sm:rounded-3xl border border-warm-gray-light/30 shadow-2xl overflow-hidden animate-fade-up safe-bottom"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center pt-2 sm:hidden">
          <span className="w-10 h-1 rounded-full bg-warm-gray-light/60" />
        </div>

        <div className="px-5 sm:px-7 pt-3 sm:pt-7 pb-2">
          <div className="flex items-start justify-between gap-3">
            <h2 className="font-display text-2xl sm:text-3xl text-ink">{t.settings}</h2>
            <button
              onClick={onClose}
              aria-label={t.close}
              className="p-2 -mr-2 -mt-1 rounded-full hover:bg-warm-gray/10 transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5 text-warm-gray" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="px-5 sm:px-7 pb-5 pt-2 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Voice section */}
          <Section title={t.voiceSection}>
            <StatusRow
              active={!!voiceProfile}
              activeLabel={t.clonedVoice}
              inactiveLabel={t.systemVoice}
              description={voiceProfile ? t.voiceActiveDescription : t.voiceInactiveDescription}
            />
            <div className="mt-3 flex flex-col gap-2">
              <ActionButton
                primary
                label={voiceProfile ? t.reconfigureMyVoice : t.setUpYourVoice}
                icon="🎤"
                onClick={() => {
                  onClose()
                  onReconfigureMyVoice()
                }}
              />
            </div>
          </Section>

          {/* Partner section */}
          <Section title={t.partnerSection}>
            {partner && partnerLang ? (
              <>
                <StatusRow
                  active
                  activeLabel={`${partnerLang.flag} ${partnerLang.label}`}
                  inactiveLabel={t.noPartnerYet}
                  description={t.partnerActiveDescription(partnerLang.label)}
                />
                <div className="mt-3 flex flex-col gap-2">
                  <ActionButton
                    label={t.reconfigurePartner}
                    icon="🔁"
                    onClick={() => {
                      onClose()
                      onReconfigurePartner()
                    }}
                  />
                  <ActionButton
                    label={t.removePartner}
                    icon="🗑️"
                    danger
                    onClick={() => {
                      onClose()
                      onRemovePartner()
                    }}
                  />
                </div>
              </>
            ) : (
              <>
                <StatusRow
                  active={false}
                  activeLabel=""
                  inactiveLabel={t.noPartnerYet}
                  description={t.conversationIntro}
                />
                <div className="mt-3 flex flex-col gap-2">
                  <ActionButton
                    primary
                    label={t.addPartnerCta}
                    icon="👥"
                    onClick={() => {
                      onClose()
                      onReconfigurePartner()
                    }}
                  />
                </div>
              </>
            )}
          </Section>

          {/* Languages section */}
          <Section title={t.languagesSection}>
            <div className="bg-white/60 rounded-xl p-3.5 border border-warm-gray-light/25">
              <div className="flex items-center justify-between gap-3 text-sm">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-2xl shrink-0">{langPair.native.flag}</span>
                  <p className="font-medium text-ink truncate">{langPair.native.label}</p>
                </div>
                <span className="text-warm-gray shrink-0">→</span>
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-2xl shrink-0">{langPair.target.flag}</span>
                  <p className="font-medium text-ink truncate">{langPair.target.label}</p>
                </div>
              </div>
            </div>
            <div className="mt-3">
              <ActionButton
                label={t.changeLanguagesAction}
                icon="🌍"
                onClick={() => {
                  onClose()
                  onChangeLanguages()
                }}
              />
            </div>
          </Section>
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <p className="font-mono text-[10px] sm:text-xs text-warm-gray uppercase tracking-wider mb-2">
        {title}
      </p>
      <div className="glass-card rounded-2xl p-4">{children}</div>
    </section>
  )
}

function StatusRow({
  active,
  activeLabel,
  inactiveLabel,
  description,
}: {
  active: boolean
  activeLabel: string
  inactiveLabel: string
  description: string
}) {
  return (
    <div>
      <div className="flex items-center gap-2">
        <span
          className={`inline-block w-2 h-2 rounded-full ${
            active ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-warm-gray-light'
          }`}
        />
        <span className={`font-medium text-sm ${active ? 'text-ink' : 'text-warm-gray'}`}>
          {active ? activeLabel : inactiveLabel}
        </span>
      </div>
      {description && <p className="text-xs text-warm-gray leading-relaxed mt-1.5">{description}</p>}
    </div>
  )
}

function ActionButton({
  label,
  icon,
  onClick,
  primary = false,
  danger = false,
}: {
  label: string
  icon?: string
  onClick: () => void
  primary?: boolean
  danger?: boolean
}) {
  const base =
    'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all active:scale-[0.98] cursor-pointer touch-target text-left'
  const styles = primary
    ? 'bg-terracotta text-white hover:bg-terracotta-dark shadow-[0_8px_20px_-12px_rgba(196,96,58,0.6)]'
    : danger
      ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-100'
      : 'bg-white/70 text-ink hover:bg-white border border-warm-gray-light/30'

  return (
    <button type="button" onClick={onClick} className={`${base} ${styles}`}>
      {icon && <span className="text-lg shrink-0">{icon}</span>}
      <span className="font-medium text-sm flex-1">{label}</span>
      <svg className="w-4 h-4 opacity-60 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="m9 5 7 7-7 7" />
      </svg>
    </button>
  )
}
