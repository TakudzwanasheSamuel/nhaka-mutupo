
export interface Totem {
  id: string;
  name: string;
  svg: string;
  snippet: string;
}

export const TOTEMS: Totem[] = [
  {
    id: 'lion',
    name: 'Shumba (Lion)',
    snippet: 'Maita wekwaMhazi, Shumba yeChiroro.',
    svg: 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEyIDJDMiAyIDIgMTIgMiAxMmMwIDYgNSA3IDcgN2gxM2MwLTYtNS03LTctN3oiIGZpbGw9ImN1cnJlbnRDbGxvciIvPjxwYXRoIGQ9Ik0xMiA0YzAgMy0yIDQtMiA0czIgNCAyIDRzMi0xIDItNHMtMi00LTItNHoiIGZpbGw9IndoaXRlIi8+PC9zdmc+'
  },
  {
    id: 'elephant',
    name: 'Nzou (Elephant)',
    snippet: 'Maita Samanyanga, Nzou inobva kumakore.',
    svg: 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEyIDJjLTUgMC05IDQtOSAxMHM0IDEwIDkgMTBzOS00IDktMTBTMTcgMiAxMiAyem0wIDE0Yy0yIDAtNC0yLTQtNHMyIDItNCA0cy00IDItNCA0eiIgZmlsbD0iY3VycmVudENsbG9yIi8+PC9zdmc+'
  },
  {
    id: 'zebra',
    name: 'Mbizi (Zebra)',
    snippet: 'Maita Mazvimbakupa, Mbizi yapinda mumba.',
    svg: 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTQgNGgxNnYxNkg0eiIgZmlsbD0iY3VycmVudENsbG9yIi8+PHBhdGggZD0iTTQgOGgxNnYySDR6TTQgMTJoMTZ2Mkg0ek00IDE2aDE2djJINHoiIGZpbGw9IndoaXRlIi8+PC9zdmc+'
  },
  {
    id: 'rhino',
    name: 'Chipembere (Rhino)',
    snippet: 'Maita wekwaMakarati, Chipembere chine simba.',
    svg: 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTQgMTJoNnY2SDR6bTggMGg0djZIMTJ6bTgtNGgydjZIMjB6TTIgMTRoMnY0SDJ6IiBmaWxsPSJjdXJyZW50Q2xsb3IiLz48L3N2Zz4='
  },
  {
    id: 'giraffe',
    name: 'Twiza (Giraffe)',
    snippet: 'Maita Twiza, mrefu kule kule.',
    svg: 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEwIDJoNHYxNGgtNHpNMTAgMThoNHY0aC00eiIgZmlsbD0iY3VycmVudENsbG9yIi8+PC9zdmc+'
  },
  {
    id: 'buffalo',
    name: 'Nyati (Buffalo)',
    snippet: 'Maita Nyati, muzinda wehondo.',
    svg: 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTQgNGgxNmMwIDAgMCAxNi04IDE2cy04LTE2LTgtMTZ6IiBmaWxsPSJjdXJyZW50Q2xsb3IiLz48L3N2Zz4='
  },
  {
    id: 'cheetah',
    name: 'Dindingwe (Cheetah)',
    snippet: 'Maita Dindingwe, mumhanyi wegomba.',
    svg: 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEyIDJhMTAgMTAgMCAxIDAgMCAyMCAxMCAxMCAwIDAgMCAwLTIwek04IDhhMiAyIDAgMSAxIDQgMCAyIDIgMCAwIDEgLTQgMHptOCA0YTIgMiAwIDEgMSA0IDAgMiAyIDAgMCAxIC00IDB6bS00IDhhMiAyIDAgMSAxIDQgMCAyIDIgMCAwIDEgLTQgMHoiIGZpbGw9ImN1cnJlbnRDbGxvciIvPjwvc3ZnPg=='
  },
  {
    id: 'leopard',
    name: 'Ingwe (Leopard)',
    snippet: 'Maita Ingwe, munyuku wekupfira.',
    svg: 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEyIDJhMTAgMTAgMCAxIDAgMCAyMCAxMCAxMCAwIDAgMCAwLTIwem0tNiA2aDR2NGgtNHptOCA4aDR2NGgtNHptLTIgLTRoNHY0aC00eiIgZmlsbD0iY3VycmVudENsbG9yIi8+PC9zdmc+'
  },
  {
    id: 'crocodile',
    name: 'Garwe (Crocodile)',
    snippet: 'Maita Garwe, ishe weziva.',
    svg: 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTIgMTJoMjB2MmgtMjB6bTAtNGgyMHYyaC0yMHptMC00aDIwdjJoLTIweiIgZmlsbD0iY3VycmVudENsbG9yIi8+PC9zdmc+'
  },
  {
    id: 'hippo',
    name: 'Mvuu (Hippo)',
    snippet: 'Maita Mvuu, chipanda chemvura.',
    svg: 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEyIDRjLTQgMC04IDMtOCA4czQgOCA4IDhzOC0zIDgtOC00LTgtOC04eiIgZmlsbD0iY3VycmVudENsbG9yIi8+PC9zdmc+'
  },
  {
    id: 'gorilla',
    name: 'Soko (Gorilla)',
    snippet: 'Maita Soko, Mukanya weMaringa.',
    svg: 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEyIDJhNiA2IDAgMCAwLTYgNnY0aDEydjQtNmgtNnYtNGg2Vjh6IiBmaWxsPSJjdXJyZW50Q2xsb3IiLz48L3N2Zz4='
  },
  {
    id: 'falcon',
    name: 'Chapungu (Eagle)',
    snippet: 'Maita Chapungu, chizuva chegore.',
    svg: 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEyIDJsLTkgOWgxOGwtOS05eiIgZmlsbD0iY3VycmVudENsbG9yIi8+PC9zdmc+'
  },
  {
    id: 'tortoise',
    name: 'Hamba (Tortoise)',
    snippet: 'Maita Hamba, mutakura imba.',
    svg: 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEyIDRhMTAgMTAgMCAwIDAgMCAyMCAxMCAxMCAwIDAgMCAwLTIwem0tNiA2aDR2NGgtNHptOCA0aDR2NGgtNHptLTIgLTRoNHY0aC00eiIgZmlsbD0iY3VycmVudENsbG9yIi8+PC9zdmc+'
  },
  {
    id: 'hyena',
    name: 'Bere (Hyena)',
    snippet: 'Maita Bere, mudyi wezvisina huku.',
    svg: 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEyIDJsLTggOGgxNnoiIGZpbGw9ImN1cnJlbnRDbGxvciIvPjwvc3ZnPg=='
  },
  {
    id: 'mamba',
    name: 'Nyoka (Snake)',
    snippet: 'Maita Nyoka, nyuchi dzinoruma.',
    svg: 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTIgMTJhMiAyIDAgMSAwIDAgNHoiIGZpbGw9ImN1cnJlbnRDbGxvciIvPjwvc3ZnPg=='
  },
  {
    id: 'ostrich',
    name: 'Mhou (Ostrich)',
    snippet: 'Maita Mhou, shiri isingabhururuki.',
    svg: 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEyIDhhNCA0IDAgMSAwIDAgIDggNCA0IDAgMCAwIDAgLTh6IiBmaWxsPSJjdXJyZW50Q2xsb3IiLz48L3N2Zz4='
  },
  {
    id: 'warthog',
    name: 'Njiri (Warthog)',
    snippet: 'Maita Njiri, mbeva yechi duku.',
    svg: 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTQgOGg0djhoLTR6bTggMGg0djhoLTR6IiBmaWxsPSJjdXJyZW50Q2xsb3IiLz48L3N2Zz4='
  },
  {
    id: 'eland',
    name: 'Mhofu (Eland)',
    snippet: 'Maita Mhofu, Mhofu yeDube.',
    svg: 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEyIDJjLTUgMC05IDQtOSAxMHM0IDkgOSA5czktNCA5LTlTMiAyIDEyIDJ6bTAgMTVjLTIuOCAwLTUtMi4yLTUtNXMyLjItNSA1LTUuNS0yLjggMC01IDIgNS01IDUgNS0yLjIgNS01eiIgZmlsbD0iY3VycmVudENsbG9yIi8+PC9zdmc+'
  },
  {
    id: 'monkey',
    name: 'Tsoko (Monkey)',
    snippet: 'Maita Tsoko, chivara chemuti.',
    svg: 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEyIDJhNiA2IDAgMSAwIDAgMTIgNiA2IDAgMCAwIDAtMTJ6IiBmaWxsPSJjdXJyZW50Q2xsb3IiLz48L3N2Zz4='
  },
  {
    id: 'baboon',
    name: 'Gudo (Baboon)',
    snippet: 'Maita Gudo, soko yeBero.',
    svg: 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTUgN2gxNHYxMEg1em0yIDJoMTB2Nkg3eiIgZmlsbD0iY3VycmVudENsbG9yIi8+PC9zdmc+'
  }
];
