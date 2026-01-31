// Palette moderne et chaleureuse
const violetPrune = '#3A235A';
const violetPruneDark = '#2E1A47';
const beigeCreme = '#F6E6D8';
const beigeCremeLight = '#F3D1C8';
const corailDoux = '#F08A5D';
const lilas = '#B8A1D9';
const jaunePastel = '#F6D186';

export default {
  light: {
    text: violetPruneDark,
    background: beigeCreme,
    tint: corailDoux,
    tabIconDefault: '#8A7A9F',
    tabIconSelected: corailDoux,
    card: beigeCremeLight,
    accent: lilas,
    highlight: jaunePastel,
  },
  dark: {
    text: beigeCreme,
    background: violetPruneDark,
    tint: corailDoux,
    tabIconDefault: '#6B5B7F',
    tabIconSelected: corailDoux,
    card: violetPrune,
    accent: lilas,
    highlight: jaunePastel,
  },
};
