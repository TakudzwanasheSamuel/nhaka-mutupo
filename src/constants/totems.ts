/**
 * @fileOverview Definitive collection of 20 African Totems (Mitupo) with cultural praise snippets.
 */

export interface Totem {
  id: string;
  name: string;
  animal: string;
  image: string;
  nhetembo: string;
}

export const TOTEMS: Totem[] = [
  {
    id: 'lion',
    name: 'Shumba',
    animal: 'Lion',
    image: 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEyIDJDMiAyIDIgMTIgMiAxMmMwIDYgNSA3IDcgN2gxM2MwLTYtNS03LTctN3oiIGZpbGw9ImN1cnJlbnRDbGxvciIvPjxwYXRoIGQ9Ik0xMiA0YzAgMy0yIDQtMiA0czIgNCAyIDRzMi0xIDItNHMtMi00LTItNHoiIGZpbGw9IndoaXRlIi8+PC9zdmc+',
    nhetembo: "Maita wekwaMhazi, Shumba yeChiroro.\nZvaonekwa vari munyika yeChidziwa."
  },
  {
    id: 'elephant',
    name: 'Nzou',
    animal: 'Elephant',
    image: 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEyIDJjLTUgMC05IDQtOSAxMHM0IDEwIDkgMTBzOS00IDktMTBTMTcgMiAxMiAyem0wIDE0Yy0yIDAtNC0yLTQtNHMyIDItNCA0cy00IDItNCA0eiIgZmlsbD0iY3VycmVudENsbG9yIi8+PC9zdmc+',
    nhetembo: "Maita Samanyanga, Nzou inobva kumakore.\nZvaonekwa Mukonoweshuro, muzinda wehondo."
  },
  {
    id: 'eland',
    name: 'Mhofu',
    animal: 'Eland',
    image: 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEyIDJjLTUgMC05IDQtOSAxMHM0IDkgOSA5czktNCA5LTlTMiAyIDEyIDJ6bTAgMTVjLTIuOCAwLTUtMi4yLTUtNXMyLjItNSA1LTUuNS0yLjggMC01IDIgNS01IDUgNS0yLjIgNS01eiIgZmlsbD0iY3VycmVudENsbG9yIi8+PC9zdmc+',
    nhetembo: "Maita Mhofu yeDube, wekwaSeke.\nZvaonekwa mhuka huru isingadyiwi mumba."
  },
  {
    id: 'zebra',
    name: 'Mbizi',
    animal: 'Zebra',
    image: 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTQgNGgxNnYxNkg0eiIgZmlsbD0iY3VycmVudENsbG9yIi8+PHBhdGggZD0iTTQgOGgxNnYySDR6TTQgMTJoMTZ2Mkg0ek00IDE2aDE2djJINHoiIGZpbGw9IndoaXRlIi8+PC9zdmc+',
    nhetembo: "Maita Mazvimbakupa, Mbizi yapinda mumba.\nZvaonekwa vari kwaChihota, vane mavara anenge denga."
  },
  {
    id: 'monkey',
    name: 'Shoko',
    animal: 'Vervet Monkey',
    image: 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEyIDJhNiA2IDAgMSAwIDAgMTIgNiA2IDAgMCAwIDAtMTJ6IiBmaWxsPSJjdXJyZW50Q2xsb3IiLz48L3N2Zz4=',
    nhetembo: "Maita Mukanya, Soko yeMaringa.\nZvaonekwa Chirongo, mudyi wematunduru."
  },
  {
    id: 'crocodile',
    name: 'Ngwena',
    animal: 'Crocodile',
    image: 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTIgMTJoMjB2MmgtMjB6bTAtNGgyMHYyaC0yMHptMC00aDIwdjJoLTIweiIgZmlsbD0iY3VycmVudENsbG9yIi8+PC9zdmc+',
    nhetembo: "Maita Ngwena, ishe weziva guru.\nZvaonekwa vari muZambezi, vane ganda risingabvumi mapfumo."
  },
  {
    id: 'buffalo',
    name: 'Nyati',
    animal: 'Buffalo',
    image: 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTQgNGgxNmMwIDAgMCAxNi04IDE2cy04LTE2LTgtMTZ6IiBmaWxsPSJjdXJyZW50Q2xsb3IiLz48L3N2Zz4=',
    nhetembo: "Maita Nyati, wekwaChimbangu.\nZvaonekwa mhuka inotyisa, ine simba rinozura miti."
  },
  {
    id: 'rhino',
    name: 'Chipembere',
    animal: 'Rhino',
    image: 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTQgMTJoNnY2SDR6bTggMGg0djZIMTJ6bTgtNGgydjZIMjB6TTIgMTRoMnY0SDJ6IiBmaWxsPSJjdXJyZW50Q2xsb3IiLz48L3N2Zz4=',
    nhetembo: "Maita wekwaMakarati, Chipembere.\nZvaonekwa mutumbi mukuru, wakapfeka nhumbi dzesimbi."
  },
  {
    id: 'cheetah',
    name: 'Dindingwe',
    animal: 'Cheetah',
    image: 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEyIDJhMTAgMTAgMCAxIDAgMCAyMCAxMCAxMCAwIDAgMCAwLTIwek04IDhhMiAyIDAgMSAxIDQgMCAyIDIgMCAwIDEgLTQgMHptOCA0YTIgMiAwIDEgMSA0IDAgMiAyIDAgMCAxIC00IDB6bS00IDhhMiAyIDAgMSAxIDQgMCAyIDIgMCAwIDEgLTQgMHoiIGZpbGw9ImN1cnJlbnRDbGxvciIvPjwvc3ZnPg==',
    nhetembo: "Maita Dindingwe, mumhanyi wegomba.\nZvaonekwa mheni yepasi, inobata nemvura."
  },
  {
    id: 'leopard',
    name: 'Ingwe',
    animal: 'Leopard',
    image: 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEyIDJhMTAgMTAgMCAxIDAgMCAyMCAxMCAxMCAwIDAgMCAwLTIwem0tNiA2aDR2NGgtNHptOCA4aDR2NGgtNHptLTIgLTRoNHY0aC00eiIgZmlsbD0iY3VycmVudENsbG9yIi8+PC9zdmc+',
    nhetembo: "Maita Ingwe, munyuku wekupfira.\nZvaonekwa vari muuswa, vane mavara anofadza meso."
  },
  {
    id: 'giraffe',
    name: 'Twiza',
    animal: 'Giraffe',
    image: 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEwIDJoNHYxNGgtNHpNMTAgMThoNHY0aC00eiIgZmlsbD0iY3VycmVudENsbG9yIi8+PC9zdmc+',
    nhetembo: "Maita Twiza, wekwaNenzou.\nZvaonekwa mutsipa murefu, unoona kure kwazvo."
  },
  {
    id: 'ostrich',
    name: 'Mhou',
    animal: 'Ostrich',
    image: 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEyIDhhNCA0IDAgMSAwIDAgIDggNCA0IDAgMCAwIDAgLTh6IiBmaWxsPSJjdXJyZW50Q2xsb3IiLz48L3N2Zz4=',
    nhetembo: "Maita Mhou, shiri huru yepasi.\nZvaonekwa nhano dzenhema, mheni isina kutinhira."
  },
  {
    id: 'hyena',
    name: 'Bere',
    animal: 'Hyena',
    image: 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEyIDJsLTggOGgxNnoiIGZpbGw9ImN1cnJlbnRDbGxvciIvPjwvc3ZnPg==',
    nhetembo: "Maita Bere, mudyi wezvisina huku.\nZvaonekwa vari muusiku, maseka-maseka asingapere."
  },
  {
    id: 'tortoise',
    name: 'Hamba',
    animal: 'Tortoise',
    image: 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEyIDRhMTAgMTAgMCAwIDAgMCAyMCAxMCAxMCAwIDAgMCAwLTIwem0tNiA2aDR2NGgtNHptOCA0aDR2NGgtNHptLTIgLTRoNHY0aC00eiIgZmlsbD0iY3VycmVudENsbG9yIi8+PC9zdmc+',
    nhetembo: "Maita Hamba, mutakura imba.\nZvaonekwa vari pasi pegwenzi, murwere asingafi."
  },
  {
    id: 'eagle',
    name: 'Chapungu',
    animal: 'Eagle',
    image: 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEyIDJsLTkgOWgxOGwtOS05eiIgZmlsbD0iY3VycmVudENsbG9yIi8+PC9zdmc+',
    nhetembo: "Maita Chapungu, chizuva chegore.\nZvaonekwa vari mudenga, muoni wezvakavanzika."
  },
  {
    id: 'snake',
    name: 'Nyoka',
    animal: 'Python',
    image: 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTIgMTJhMiAyIDAgMSAwIDAgNHoiIGZpbGw9ImN1cnJlbnRDbGxvciIvPjwvc3ZnPg==',
    nhetembo: "Maita Nyoka, soko yeBero.\nZvaonekwa vari muuswa, ishe ane uturu unouraya."
  },
  {
    id: 'warthog',
    name: 'Njiri',
    animal: 'Warthog',
    image: 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTQgOGg0djhoLTR6bTggMGg0djhoLTR6IiBmaWxsPSJjdXJyZW50Q2xsb3IiLz48L3N2Zz4=',
    nhetembo: "Maita Njiri, mbeva yechi duku.\nZvaonekwa vari mumatombo, mhuka isina manyepo."
  },
  {
    id: 'hippo',
    name: 'Mvuu',
    animal: 'Hippo',
    image: 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEyIDRjLTQgMC04IDMtOCA4czQgOCA4IDhzOC0zIDgtOC00LTgtOC04eiIgZmlsbD0iY3VycmVudENsbG9yIi8+PC9zdmc+',
    nhetembo: "Maita Mvuu, chipanda chemvura.\nZvaonekwa muRwizi, mutumbi mukuru unofuridza mvura."
  },
  {
    id: 'baboon',
    name: 'Gudo',
    animal: 'Baboon',
    image: 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTUgN2gxNHYxMEg1em0yIDJoMTB2Nkg3eiIgZmlsbD0iY3VycmVudENsbG9yIi8+PC9zdmc+',
    nhetembo: "Maita Gudo, wekwaBero.\nZvaonekwa vari mumatombo, vari kudya nzungu."
  },
  {
    id: 'porcupine',
    name: 'Nungu',
    animal: 'Porcupine',
    image: 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTIgMTJoNHY4SDJ6bTYtNGg0djEySDh6bTYtNGg0djE2aC00em02IDhoNHY4aC00eiIgZmlsbD0iY3VycmVudENsbG9yIi8+PC9zdmc+',
    nhetembo: "Maita Nungu, munhu akapfeka miseve.\nZvaonekwa vari muusiku, kudzivirira hupenyu."
  }
];

export interface CardState {
  id: string;
  totemId: string;
  isFlipped: boolean;
  isMatched: boolean;
}

/**
 * Generates a shuffled deck of cards based on difficulty.
 * Uses Fisher-Yates algorithm for unbiased shuffling.
 */
export function getGameDeck(gridSize: number): CardState[] {
  const totalPairs = gridSize / 2;
  const selectedTotems = TOTEMS.slice(0, totalPairs);
  
  const cards: CardState[] = [];
  
  selectedTotems.forEach((totem) => {
    // Pair 1
    cards.push({
      id: `${totem.id}-1`,
      totemId: totem.id,
      isFlipped: false,
      isMatched: false,
    });
    // Pair 2
    cards.push({
      id: `${totem.id}-2`,
      totemId: totem.id,
      isFlipped: false,
      isMatched: false,
    });
  });

  // Fisher-Yates Shuffle
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }

  return cards;
}
