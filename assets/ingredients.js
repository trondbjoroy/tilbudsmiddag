// Varekatalog. Hver vare har et mønster som finner den i tilbudsavisene.
// w = vekt i poengberegningen (råvaren middagen bygger på teller mest).
// pantry = basisvare de fleste har hjemme. Den letes ikke etter i tilbud.

const B = '(?<![a-zæøåé])'; // ordgrense før
const E = '(?![a-zæøåé])'; // ordgrense etter
const re = (s) => new RegExp(s, 'i');

export const INGREDIENTS = {
  // Kylling
  kyllingfilet: { name: 'Kyllingfilet', w: 3, match: re('kyllingfilet|kyllingbryst|^prior strimler'), not: re('skivet|pepper|nuggets|pålegg')  },
  kyllinglarfilet: { name: 'Kyllinglårfilet', w: 3, match: re('lårfilet'), not: re('lam') },
  kyllingklubber: { name: 'Kyllingklubber/-lår', w: 3, match: re('kyllingklubbe|kyllinglår|lollipopvinger') },
  helkylling: { name: 'Hel kylling', w: 3, match: re('hel (land)?kylling') },
  kyllingkjottdeig: { name: 'Kyllingkjøttdeig', w: 3, match: re('kyllingkjøttdeig|kjøttdeig kylling') },
  pulledchicken: { name: 'Pulled chicken', w: 3, match: re('pulled chicken') },

  // Storfe og blandet
  kjottdeig: { name: 'Kjøttdeig', w: 3, match: re(`${B}kjøttdeig`), not: re('svin|kylling') },
  karbonadedeig: { name: 'Karbonadedeig', w: 3, match: re('karbonadedeig') },
  karbonader: { name: 'Karbonader', w: 3, match: re(`karbonader${E}`) },
  kjottboller: { name: 'Kjøttboller', w: 3, match: re('kjøttboller|kjøttkaker-/boller'), not: re('tomatsaus') },
  kjottkaker: { name: 'Kjøttkaker', w: 3, match: re('kjøttkaker|stekte kaker') },
  biffstrimler: { name: 'Biffstrimler', w: 3, match: re('biffstrimler|storfestrimler') },
  grytekjott: { name: 'Grytekjøtt av storfe', w: 3, match: re('grytekjøtt') },
  burgere: { name: 'Hamburgere', w: 3, match: re('burger'), not: re('brød|donut|fisk|kylling|bowl|spicy') },

  // Svin
  svinekjottdeig: { name: 'Svinekjøttdeig', w: 3, match: re('svinekjøttdeig|kjøttdeig (av )?svin') },
  svinestrimler: { name: 'Svinestrimler', w: 3, match: re('strimlet svinekjøtt|svinestrimler') },
  koteletter: { name: 'Svinekoteletter', w: 3, match: re('kotelett'), not: re('lam') },
  svinefilet: { name: 'Svinefilet', w: 3, match: re('ytrefilet|indrefilet') },
  pulledpork: { name: 'Pulled pork', w: 3, match: re('pulled pork') },
  spareribs: { name: 'Spareribs', w: 3, match: re('spareribs') },
  bacon: { name: 'Bacon', w: 2, match: re('bacon'), not: re('tubeost|smårett|omelett') },
  polser: { name: 'Pølser', w: 3, match: re('pølse|wiener|falukorv|bratwurst'), not: re('brød|ridderheims|pekan') },

  // Lam
  farikalkjott: { name: 'Fårikålkjøtt', w: 3, match: re('fårikål'), not: re('poteter') },
  lammelar: { name: 'Lammelår/lammestek', w: 3, match: re('lammelår|lammebog|lammestek|lammeskank'), not: re('frikass') },
  lammestrimler: { name: 'Lammestrimler', w: 3, match: re('lam ?strimler') },

  // Fisk og sjømat
  laks: { name: 'Laksefilet', w: 3, match: re(`${B}laks`), not: re('pålegg|poke|røkt|terninger') },
  orret: { name: 'Ørretfilet', w: 3, match: re('ørret') },
  torsk: { name: 'Torskefilet', w: 3, match: re('torskefilet') },
  sei: { name: 'Seifilet', w: 3, match: re('seifilet') },
  fiskesuppefisk: { name: 'Fisketerninger (laks/torsk/sei)', w: 3, match: re('terninger'), and: re('laks|torsk|sei') },
  fiskekaker: { name: 'Fiskekaker', w: 3, match: re('fiskeka|fiskeburger|hysekaker') },
  fiskepudding: { name: 'Fiskepudding', w: 3, match: re('fiskepudding') },
  reker: { name: 'Reker', w: 3, match: re(`${B}reker${E}`), not: re('salat') },
  scampi: { name: 'Scampi', w: 3, match: re('scampi') },
  tunfisk: { name: 'Tunfisk på boks', w: 2, match: re('tunfisk'), not: re('dressing') },

  // Vegetar-proteiner
  egg: { name: 'Egg', w: 2, match: re(`${B}(frokost|gårds)?egg${E}|egg \\d+ ?pk|egg frittgående`) },
  falafel: { name: 'Falafel', w: 3, match: re('falafel') },
  kikerter: { name: 'Kikerter', w: 2, match: re('kikerter') },
  linser: { name: 'Røde linser', w: 2, match: re('linser') },
  bonner: { name: 'Bønner på boks', w: 1, match: re(`${B}(s&w )?bønner${E}`), not: re('ali |kaffe') },

  // Grønnsaker og frukt
  poteter: { name: 'Poteter', w: 1, match: re(`${B}(gule |delikatesse)?potet(er)?${E}|potet(er)? løs ?vekt|delikatessepoteter`), not: re('stappe|chips|gull|frikass|m/poteter') },
  sotpotet: { name: 'Søtpotet', w: 1, match: re('søtpotet') },
  gulrot: { name: 'Gulrøtter', w: 1, match: re('gulrot|gulrøtter') },
  lok: { name: 'Løk', w: 0.5, match: re(`${B}(gul )?løk${E}|løkpose|rød/gul løk|salatløk`), not: re('omelett') },
  rodlok: { name: 'Rødløk', w: 0.5, match: re('rødløk') },
  brokkoli: { name: 'Brokkoli', w: 1, match: re('brokkoli') },
  blomkal: { name: 'Blomkål', w: 1, match: re('blomkål') },
  kal: { name: 'Hodekål/spisskål', w: 1, match: re(`(spiss|hode)?kål${E}`), not: re('blomkål|rosenkål|fårikål') },
  rotgronnsaker: { name: 'Rotgrønnsaker', w: 1, match: re('rotgrønnsaker|lapskausblanding') },
  tomater: { name: 'Tomater', w: 1, match: re('tomater|klasetomat'), not: re('hakkede|snack|bønner') },
  hakkedetomater: { name: 'Hakkede tomater', w: 0.5, match: re('hakkede tomater') },
  paprika: { name: 'Paprika', w: 1, match: re('paprika'), not: re('chips|potetgull|pringles|omelett|krydder') },
  salat: { name: 'Salat', w: 0.5, match: re(`salat-?miks|isbergsalat|crispi|spiseklar salat|salatbar|favorittsalat|${B}salat${E}`), not: re('italiensk|reke|potet|kylling') },
  champignon: { name: 'Sjampinjong', w: 1, match: re('champignon|sjampinjong') },
  avokado: { name: 'Avokado', w: 1, match: re('avo[ck]ado') },
  agurk: { name: 'Agurk', w: 0.5, match: re('agurk') },
  mais: { name: 'Mais', w: 0.5, match: re(`maiskorn|${B}mais${E}`), not: re('maiskaker|skumpinner') },
  chili: { name: 'Rød chili', w: 0.3, match: re('rød chili') },
  koriander: { name: 'Fersk koriander', w: 0.3, match: re('koriander') },
  erter: { name: 'Erter', w: 0.5, match: re(`erter${E}`), not: re('kikerter') },
  squash: { name: 'Squash', w: 1, match: re('squash') },
  spinat: { name: 'Spinat', w: 0.5, match: re('spinat') },
  purre: { name: 'Purreløk', w: 0.5, match: re(`purre(løk)?${E}`), not: re('tomat') },
  sitron: { name: 'Sitron', w: 0.3, match: re(`${B}sitron(er)?${E}`), not: re('grønnsaker') },
  wokgronnsaker: { name: 'Wokgrønnsaker', w: 1, match: re('wokgrønnsaker|findus wok') },

  // Karbohydrater og brød
  pasta: { name: 'Pasta', w: 1, match: re('spaghetti|penne|fettuccine|tagliatelle|tortiglioni|gigli|pappardelle|rana pasta|coop pasta|makaroni'), not: re('saus|bowl|arrabbiata|salat') },
  ris: { name: 'Ris', w: 0.5, match: re(`${B}(jasmin|basmati)?ris${E}`), not: re('grøt') },
  nudler: { name: 'Nudler', w: 0.5, match: re('nudler') },
  couscous: { name: 'Couscous', w: 0.5, match: re('couscous') },
  tortilla: { name: 'Tortillalefser', w: 1, match: re('tortilla(lefse|r)?|rullelefse'), not: re('chips|cheese') },
  tacoskjell: { name: 'Tacoskjell', w: 0.5, match: re('taco ?shells|tacoskjell') },
  hamburgerbrod: { name: 'Hamburgerbrød', w: 0.5, match: re('burgerbrød') },
  polsebrod: { name: 'Pølsebrød/lomper', w: 0.5, match: re('pølse-?/?burgerbrød|pølsebrød|lomper') },
  pizzabunn: { name: 'Pizzabunn/-deig', w: 1, match: re('pizzabunn|pizzadeig') },
  brod: { name: 'Brød', w: 0.3, match: re('focaccia|landbrød|bondebrød|loff|ciabatta') },

  // Meieri
  revetost: { name: 'Revet ost', w: 0.5, match: re('revet'), not: re('parmesan|apetina|dressing|tunfisk') },
  mozzarella: { name: 'Mozzarella', w: 0.5, match: re('mozzarella'), not: re('ristorante|pizza') },
  parmesan: { name: 'Parmesan', w: 0.5, match: re('parmesan|parmigiano') },
  feta: { name: 'Fetaost', w: 0.5, match: re('apetina|feta'), not: re('snack') },
  cremefraiche: { name: 'Crème fraîche', w: 0.5, match: re('cr[eè]me fra[iî]che') },
  romme: { name: 'Rømme', w: 0.5, match: re('rømme') },
  flote: { name: 'Matfløte', w: 0.5, match: re(`${B}(mat|krem)?fløte${E}`) },
  melk: { name: 'Melk', w: 0.3, match: re('lettmelk|tine melk|helmelk') },
  yoghurt: { name: 'Yoghurt naturell', w: 0.3, match: re('gresk yoghurt|yoghurt naturell') },

  // Sauser og smak
  pastasaus: { name: 'Pastasaus', w: 0.5, match: re('pastasaus|basilicata|dolmio') },
  pesto: { name: 'Pesto', w: 0.5, match: re('pesto') },
  pizzasaus: { name: 'Pizzasaus', w: 0.5, match: re('pizzasaus') },
  pepperoni: { name: 'Pepperoni', w: 1, match: re('pepperoni'), not: re('rustica') },
  tomatpure: { name: 'Tomatpuré', w: 0.3, match: re('tomatpur') },
  kokosmelk: { name: 'Kokosmelk', w: 0.5, match: re('coconut milk|kokosmelk') },
  karripasta: { name: 'Rød karripasta', w: 0.5, match: re('curry paste|karripasta') },
  tikkasaus: { name: 'Tikka masala-saus', w: 0.5, match: re('tikka masala|tandoori'), not: re('turmat') },
  sweetsour: { name: 'Sweet & sour-saus', w: 0.5, match: re('sweet ?& ?sour|sweet n sour'), not: re('gryte') },
  tacosaus: { name: 'Tacosaus', w: 0.3, match: re('tacosaus') },
  tacokrydder: { name: 'Tacokrydder', w: 0.3, match: re('tacokrydder|taco spice|spice mix') },
  soyasaus: { name: 'Soyasaus', w: 0.3, match: re('soyasaus') },
  sriracha: { name: 'Sriracha', w: 0.3, match: re('sriracha'), not: re('ost') },
  majones: { name: 'Majones', w: 0.3, match: re('majones') },
  sennep: { name: 'Sennep', w: 0.3, match: re('sennep') },
  tzatziki: { name: 'Tzatziki', w: 0.3, match: re('tzatziki') },
  kebabsaus: { name: 'Kebabsaus', w: 0.3, match: re('kebabsaus') },

  // Basisvarer
  salt: { name: 'Salt', pantry: true },
  pepper: { name: 'Pepper', pantry: true },
  olje: { name: 'Olje', pantry: true },
  olivenolje: { name: 'Olivenolje', pantry: true },
  smor: { name: 'Smør', pantry: true },
  mel: { name: 'Hvetemel', pantry: true },
  sukker: { name: 'Sukker', pantry: true },
  hvitlok: { name: 'Hvitløk', pantry: true },
  ingefaer: { name: 'Ingefær', pantry: true },
  buljong: { name: 'Buljong', pantry: true },
  krydder: { name: 'Krydder', pantry: true },
  eddik: { name: 'Eddik', pantry: true },
  vann: { name: 'Vann', pantry: true },
};
