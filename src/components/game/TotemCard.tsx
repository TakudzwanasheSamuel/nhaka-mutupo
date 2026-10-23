"use client";

import { memo } from 'react';
import { CardState } from '@/constants/totems';
import { Icon } from '@/components/kit';
import s from './TotemCard.module.css';

interface Props {
  card: CardState;
  index: number;
  width: number;
  wobble: boolean;
  label: string;
  name: string;
  image: string | null;
  /** Picture name shown under the word on name cards. */
  subName: string | null;
  onFlip: (index: number) => void;
}

function wordSize(name: string, width: number) {
  const fit = (width - 14) / (name.length * 0.58);
  return Math.round(Math.max(14, Math.min(fit, width * 0.25, 26)));
}

export const TotemCard = memo(function TotemCard({ card, index, width, wobble, label, name, image, subName, onFlip }: Props) {
  const faceUp = card.isFlipped || card.isMatched;
  const showName = card.face === 'picture' && width >= 76;
  const nameSize = Math.round(Math.max(15, Math.min(width * 0.19, 20)));

  return (
    <button
      type="button"
      className={s.card}
      style={{ width, height: width / 0.8 }}
      data-up={faceUp}
      data-matched={card.isMatched}
      data-wobble={wobble}
      aria-label={label}
      aria-disabled={faceUp}
      onClick={() => onFlip(index)}
    >
      <span className={s.inner}>
        <span className={`${s.face} ${s.back}`} aria-hidden="true">
          <span className={s.backFrame} />
          <span className={s.backBand} />
        </span>

        <span className={`${s.face} ${s.front}`} data-face={card.face} aria-hidden="true">
          {card.face === 'picture' ? (
            <>
              {image && <img className={s.art} src={image} alt="" draggable={false} />}
              {showName && (
                <span className={s.name} style={{ fontSize: nameSize }}>
                  {name}
                </span>
              )}
            </>
          ) : (
            <span className={s.word}>
              <span style={{ fontSize: wordSize(name, width) }}>{name}</span>
              {subName && width >= 76 && <span className={s.wordSub}>{subName}</span>}
            </span>
          )}
        </span>
      </span>

      {card.isMatched && (
        <span className={s.tick} aria-hidden="true">
          <Icon name="check" size={Math.max(14, Math.round(width * 0.2))} />
        </span>
      )}
    </button>
  );
});
