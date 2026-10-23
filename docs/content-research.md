# Content research: starting data for cultural review

This summarises the research behind `src/content/totems.json`. Nothing in it is marked verified. Every entry starts as "waiting for review" or "unresolved" until a cultural reviewer checks it on the admin side, as the brief requires.

## Method

Each pairing of a totem with an animal or symbol was checked against the sources listed in `src/content/sources.json`. Where two or more independent sources agree, the entry is marked waiting for review. Where sources disagree, or only one informal source exists, the disagreement is written in the entry's research notes, and the entry is either kept waiting with a warning or marked unresolved so it stays out of scored play.

Totems, praise names (zvidawo), equivalent names in other languages and surnames are recorded separately, as the brief asks. For example, Mukanya is its own entry of kind "praise name" linked to Soko, and Sibanda is recorded as the isiNdebele equivalent of Shumba rather than a separate totem.

## Coverage

| Community | What was found | Confidence |
| --- | --- | --- |
| ChiShona | Main mitupo, their animals or symbols, and praise names for men and women | Good: academic, newspaper and community reference sources agree on most pairings |
| isiNdebele | Equivalent clan names (izibongo) for most ChiShona totems, for example Sibanda, Ndlovu, Ncube, Mpofu, Dube, Nyathi, Ngwenya, Maphosa, Ngulube, Nkomo, Tshuma | Fair: one cultural website lists clans and totems; the Herald notes that many Ndebele izibongo come from ancestors' names rather than animals |
| Kalanga | Mpofu (eland), Ghudo (baboon), Tembo, Shoko, Zhou, Tshuma | Fair: Wikipedia only, needs a Kalanga reviewer |
| Nambya | The Hwange dynasty's Soko (monkey) totem, earlier Moyo | Fair: one history blog |
| Venda | Ndou (elephant) and Maḓavha (warthog) clans | Low: inferred from clan names only |
| Tonga | Seven clan names with possible animals | Low: reader comments only, some contradicting each other; all marked unresolved |

The brief asks for coverage to grow through reviewed additions. The admin side lets reviewers add entries for any community.

## Points that need a reviewer's decision

**Mukanya and Soko.** The brief requires Mukanya to match the baboon. One source explains Mukanya as the galloping steps of a baboon climbing a mountain. Two community reference sites list Mukanya as a praise name of Soko and identify Soko as the vervet monkey. A survey of over 1,000 people found most Soko families name the vervet monkey and a few the baboon. In the data, Soko accepts both pictures, Mukanya accepts the baboon, and the monkey is never shown as a wrong answer for Mukanya. A reviewer needs to settle this and write the explanation children will see.

**Dziva.** Sources link Dziva to the fish, the hippo and the fish eagle, and one describes it as a pool or water lineage. Following the brief, it has no single animal and is marked unresolved. It appears in Learn the totems (once verified) as "a deep pool" with the different associations explained.

**Shava and Mhofu.** Both are the eland. Wikipedia calls Shava a variant of Mhofu. They are separate entries linked to each other.

**Hungwe and Shiri.** Hungwe is the fish eagle in most sources, while Mapira and Mazambara call it the Great Zimbabwe Bird. Shiri (bird) is kept as a general bird picture because the brief says to name a species only when verified. Other birds are never wrong answers for either.

**Beta.** Some sources say ants, others the flying termite (ishwa). The picture shows a flying termite.

**Humba.** Sources say wild pig, pig or warthog. The picture shows a warthog.

**Gwai.** The sheep is well supported, but Gwai families in Manicaland are reported to name the tortoise (kamba). Kamba has its own entry and the tortoise is never a wrong answer for Gwai.

**Gudo.** Kalanga Ghudo (baboon) is documented, but a separate ChiShona Gudo totem is not. A reviewer should decide whether it stands alone or belongs under Soko.

**Totems from the first version of the app.** Mbudzi, Dindingwe, Chapungu, Nyoka, Huku and Hanga had no source naming them as mitupo. They are marked unresolved with a note. Gwayana was removed because it means lamb; Hanga (guinea fowl) took its picture. Mhuka was removed because it means "animal" rather than a totem.

**Praise poems.** Most praise poems were carried over from the first version of the app, and their origin was not recorded. Each is marked with that source so a reviewer can confirm, correct or remove it. Four short openings (Soko, Hungwe, Tembo, Dziva) come from Kwaunobva.

**ChiShona interface text and picture names.** These were drafted for the redesign and need a fluent speaker to check them (`src/lib/i18n.ts` and the `nameSn` field in `src/content/pictures.json`).

## Sources

1. Mapira, J. and Mazambara, P. (2013). Indigenous knowledge systems and their implications for sustainable development in Zimbabwe. *Journal of Sustainable Development in Africa*, 15(5), 90 to 106.
2. Mugovera, G. (2023). How our totems came about, purposes. *The Herald* (Manica Post).
3. *The Herald*. Totems as identity and inheritance: what is in your mutupo?
4. Kwaunobva. Mitupo pages. https://kwaunobva.com/mitupo/
5. Chivara. Soko (Tsoko) mutupo.
6. ZimbOriginal. Mutupo: 6 interesting things you should know about Shona totems, praise names and poetry.
7. ZimbOriginal. Mutupo survey: insights from over 1,000 people.
8. Wikipedia. Shava Totem; Kalanga people; Venda people; Sibanda; Ndlovu.
9. BeingAfrican. Clans and totems in Ndebele culture.
10. Zimbabwe Profiles. Zimbabwean totems and what they mean.
11. Nkenne. Shona totems (mitupo): how animal symbols shape identity and guide marriage.
12. Zvangu. The Mbada (leopard) totem.
13. Totem Network (2019). Ncube / Soko totem: what they represent.
14. Zimtribes. History of the VaNambya people of Hwange District.
15. Zimtribes. Tonga groups (reader comments).

Full links are in `src/content/sources.json` and on the Sources tab of the admin side.
