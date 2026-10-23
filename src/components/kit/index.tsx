"use client";

import React, { useEffect, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { useAudio } from '@/context/AudioContext';
import { StringKey, Vars } from '@/lib/i18n';
import { Icon, IconName } from './Icon';
import s from './kit.module.css';

export { Icon } from './Icon';
export type { IconName } from './Icon';

/* ── Bilingual text ───────────────────────────── */

interface TxtProps {
  k: StringKey;
  vars?: Vars;
  /** Show the two languages side by side instead of stacked. */
  inline?: boolean;
  className?: string;
}

/**
 * Renders a string in the chosen language. In the bilingual mode the ChiShona
 * appears first and the English sits underneath, slightly smaller.
 */
export function Txt({ k, vars, inline, className }: TxtProps) {
  const { t } = useApp();
  const { primary, secondary } = t(k, vars);
  if (!secondary) return <span className={className}>{primary}</span>;
  return (
    <span className={[s.txt, inline && s.inline, className].filter(Boolean).join(' ')}>
      <span>{primary}</span>
      <span className={s.secondary}>{secondary}</span>
    </span>
  );
}

/* ── Buttons ───────────────────────────── */

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  size?: 'lg' | 'xl';
  block?: boolean;
  icon?: IconName;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'lg', block, icon, children, className, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      className={[s.button, className].filter(Boolean).join(' ')}
      data-variant={variant}
      data-size={size}
      data-block={block ? 'true' : undefined}
      {...rest}
    >
      {icon && <Icon name={icon} size={size === 'xl' ? 30 : 26} />}
      {children}
    </button>
  );
});

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: IconName;
  label: string;
}

export function IconButton({ icon, label, className, ...rest }: IconButtonProps) {
  return (
    <button type="button" aria-label={label} title={label} className={[s.iconButton, className].filter(Boolean).join(' ')} {...rest}>
      <Icon name={icon} size={26} />
    </button>
  );
}

export function PillButton({ icon, children, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement> & { icon: IconName }) {
  return (
    <button type="button" className={s.pillButton} {...rest}>
      <Icon name={icon} size={24} />
      {children}
    </button>
  );
}

/* ── Sound toggle (used on every screen) ───────────────────────────── */

export function SoundButton() {
  const { isMuted, toggleMute } = useAudio();
  const { say } = useApp();
  return (
    <IconButton
      icon={isMuted ? 'soundOff' : 'soundOn'}
      label={say(isMuted ? 'soundOn' : 'soundOff')}
      aria-pressed={!isMuted}
      onClick={toggleMute}
    />
  );
}

/* ── Stars ───────────────────────────── */

export function Stars({ count, size = 28, animate, label }: { count: number; size?: number; animate?: boolean; label?: string }) {
  return (
    <span className={s.stars} data-animate={animate ? 'true' : undefined} role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      {[1, 2, 3].map(i => (
        <span key={i} className={s.star} data-on={i <= count ? 'true' : 'false'}>
          <Icon name="star" size={size} />
        </span>
      ))}
    </span>
  );
}

/* ── Progress bar ───────────────────────────── */

export function ProgressBar({ value, max, className }: { value: number; max: number; className?: string }) {
  return (
    <div className={[s.progress, className].filter(Boolean).join(' ')} aria-hidden="true">
      <div className={s.progressFill} style={{ width: `${max ? (value / max) * 100 : 0}%` }} />
    </div>
  );
}

export function ChevronBand({ className }: { className?: string }) {
  return <div className={[s.band, className].filter(Boolean).join(' ')} aria-hidden="true" />;
}

/* ── Sheet / dialog ───────────────────────────── */

interface SheetProps {
  open: boolean;
  onClose?: () => void;
  labelledBy: string;
  variant?: 'sheet' | 'dialog';
  children: React.ReactNode;
}

/**
 * Bottom sheet on phones (within thumb reach), centred dialog on wider screens.
 * Focus moves into the panel when it opens and Escape closes it.
 */
export function Sheet({ open, onClose, labelledBy, variant = 'sheet', children }: SheetProps) {
  const panel = useRef<HTMLDivElement>(null);
  const restoreTo = useRef<Element | null>(null);

  useEffect(() => {
    if (!open) return;
    restoreTo.current = document.activeElement;
    const el = panel.current;
    const first = el?.querySelector<HTMLElement>('[data-autofocus], button');
    first?.focus({ preventScroll: true });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onClose) onClose();
      if (e.key !== 'Tab' || !el) return;
      const items = el.querySelectorAll<HTMLElement>('button, [href], [tabindex]:not([tabindex="-1"])');
      if (!items.length) return;
      const firstItem = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === firstItem) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        firstItem.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      (restoreTo.current as HTMLElement | null)?.focus?.({ preventScroll: true });
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className={s.overlay} data-variant={variant} onClick={onClose}>
      <div
        ref={panel}
        className={s.panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        onClick={e => e.stopPropagation()}
      >
        {variant === 'sheet' && <div className={s.handle} aria-hidden="true" />}
        {children}
      </div>
    </div>
  );
}

/* ── Screen top bar: back, title, sound ───────────────────────────── */

export function TopBar({ title, onBack, backIcon = 'back' }: { title?: React.ReactNode; onBack: () => void; backIcon?: IconName }) {
  const { say } = useApp();
  return (
    <header className={s.topBar}>
      <IconButton icon={backIcon} label={say(backIcon === 'home' ? 'home' : 'back')} onClick={onBack} />
      <h1 className={s.topTitle}>{title}</h1>
      <SoundButton />
    </header>
  );
}

/* ── Segmented choice (two or three big options) ───────────────────────────── */

interface ChoiceOption<T extends string> {
  id: T;
  label: React.ReactNode;
  hint?: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export function ChoiceGroup<T extends string>({
  value,
  onChange,
  options,
  labelledBy,
}: {
  value: T;
  onChange: (v: T) => void;
  options: ChoiceOption<T>[];
  labelledBy: string;
}) {
  return (
    <div className={s.choices} role="radiogroup" aria-labelledby={labelledBy}>
      {options.map(o => {
        const selected = o.id === value;
        return (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={selected}
            disabled={o.disabled}
            className={s.choice}
            data-selected={selected}
            onClick={() => onChange(o.id)}
          >
            {o.icon && <span className={s.choiceIcon}>{o.icon}</span>}
            <span className={s.choiceLabel}>{o.label}</span>
            {o.hint && <span className={s.choiceHint}>{o.hint}</span>}
            <span className={s.choiceTick} aria-hidden="true">
              {selected && <Icon name="check" size={18} />}
            </span>
          </button>
        );
      })}
    </div>
  );
}
