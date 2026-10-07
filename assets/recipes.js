// Oppskrifter. Mengder gjelder 4 porsjoner og skaleres i appen.
// ing: [varenøkkel, mengde, enhet, merknad]. Mengde null = etter smak.
// cat: kylling | storfe | svin | lam | fisk | vegetar
// tags: barn (barnevennlig), glutenfri, laktosefri, fredag (kosemat), helg (tar tid)

export const RECIPES = [
  // ---------- Kylling ----------
  {
    id: 'kylling-karri', name: 'Kyllinggryte med kokos og rød karri', cat: 'kylling', time: 30, tags: ['glutenfri', 'laktosefri'],
    ing: [['kyllingfilet', 600, 'g'], ['kokosmelk', 1, 'boks'], ['karripasta', 2, 'ss'], ['paprika', 2, 'stk'], ['lok', 1, 'stk'], ['ris', 4, 'dl'], ['koriander', null, '', 'til servering'], ['olje', 1, 'ss'], ['salt', null, '']],
    steps: ['Kok risen etter anvisningen på pakken.', 'Skjær kylling og paprika i biter. Hakk løken.', 'Stek løk og karripasta i olje i 1 minutt.', 'Tilsett kyllingen og stek til den får farge.', 'Hell i kokosmelk og paprika. Småkok i 10 minutter.', 'Smak til med salt. Server med ris og koriander.'],
  },
  {
    id: 'tikka-masala', name: 'Kylling tikka masala', cat: 'kylling', time: 30, tags: ['barn', 'glutenfri'],
    ing: [['kyllingfilet', 600, 'g'], ['tikkasaus', 1, 'glass'], ['lok', 1, 'stk'], ['yoghurt', 2, 'dl', 'til servering'], ['ris', 4, 'dl'], ['koriander', null, ''], ['olje', 1, 'ss']],
    steps: ['Kok risen.', 'Skjær kyllingen i biter og hakk løken.', 'Stek løk og kylling i olje til kyllingen er gyllen.', 'Hell i sausen og småkok i 10 minutter.', 'Server med ris, en klatt yoghurt og koriander.'],
  },
  {
    id: 'kylling-wok', name: 'Kyllingwok med nudler', cat: 'kylling', time: 20, tags: ['barn', 'laktosefri'],
    ing: [['kyllingfilet', 500, 'g'], ['nudler', 250, 'g'], ['wokgronnsaker', 600, 'g'], ['soyasaus', 4, 'ss'], ['hvitlok', 2, 'fedd'], ['ingefaer', 1, 'ss', 'revet'], ['olje', 2, 'ss']],
    steps: ['Kok nudlene og skyll dem i kaldt vann.', 'Skjær kyllingen i strimler.', 'Stek kyllingen i olje på høy varme i en wokpanne.', 'Tilsett hvitløk, ingefær og grønnsaker. Stek i 3–4 minutter.', 'Vend inn nudler og soyasaus. Server straks.'],
  },
  {
    id: 'kylling-fajitas', name: 'Kyllingfajitas', cat: 'kylling', time: 25, tags: ['barn', 'fredag'],
    ing: [['kyllingfilet', 600, 'g'], ['tortilla', 8, 'stk'], ['paprika', 2, 'stk'], ['rodlok', 1, 'stk'], ['tacokrydder', 1, 'pose'], ['romme', 3, 'dl'], ['avokado', 2, 'stk'], ['revetost', 150, 'g'], ['olje', 1, 'ss']],
    steps: ['Skjær kylling, paprika og rødløk i strimler.', 'Stek kyllingen i olje. Strø over krydderet.', 'Tilsett grønnsakene og stek til de er møre.', 'Varm tortillaene.', 'Server med rømme, avokado og revet ost.'],
  },
  {
    id: 'ovnskylling-lar', name: 'Ovnsbakte kyllinglår med rotgrønnsaker', cat: 'kylling', time: 50, tags: ['barn', 'glutenfri', 'laktosefri'],
    ing: [['kyllingklubber', 1.2, 'kg'], ['poteter', 800, 'g'], ['gulrot', 4, 'stk'], ['rodlok', 2, 'stk'], ['olivenolje', 3, 'ss'], ['krydder', 2, 'ts', 'paprikapulver'], ['salt', null, ''], ['pepper', null, '']],
    steps: ['Sett ovnen på 220 °C.', 'Del poteter, gulrøtter og løk i biter. Legg alt i en langpanne.', 'Legg kyllingen oppå. Drypp over olje og strø over krydder, salt og pepper.', 'Stek i 40–45 minutter til kyllingen er gjennomstekt.'],
  },
  {
    id: 'kylling-lar-ris', name: 'Sprø kyllinglårfilet med ris og brokkoli', cat: 'kylling', time: 30, tags: ['barn', 'glutenfri', 'laktosefri'],
    ing: [['kyllinglarfilet', 700, 'g'], ['ris', 4, 'dl'], ['brokkoli', 400, 'g'], ['soyasaus', 3, 'ss'], ['hvitlok', 2, 'fedd'], ['olje', 1, 'ss']],
    steps: ['Kok risen.', 'Stek lårfileten i olje på middels varme, 5–6 minutter på hver side.', 'Tilsett hvitløk og soyasaus de siste minuttene. Vend kjøttet i sausen.', 'Damp brokkolien i 4 minutter.', 'Server med ris og brokkoli.'],
  },
  {
    id: 'helstekt-kylling', name: 'Helstekt kylling med poteter og salat', cat: 'kylling', time: 90, tags: ['helg', 'glutenfri', 'laktosefri'],
    ing: [['helkylling', 1, 'stk'], ['poteter', 1, 'kg'], ['sitron', 1, 'stk'], ['hvitlok', 4, 'fedd'], ['salat', 1, 'pose'], ['tomater', 250, 'g'], ['olivenolje', 3, 'ss'], ['salt', null, ''], ['pepper', null, '']],
    steps: ['Sett ovnen på 200 °C.', 'Gni kyllingen med olje, salt og pepper. Legg sitron og hvitløk inni.', 'Del potetene og legg dem rundt kyllingen.', 'Stek i cirka 75 minutter. Kjøttet skal være 75 °C innerst i låret.', 'La kyllingen hvile i 10 minutter. Server med salat og tomater.'],
  },
  {
    id: 'kylling-pasta-pesto', name: 'Pasta med kylling og pesto', cat: 'kylling', time: 20, tags: ['barn'],
    ing: [['pasta', 400, 'g'], ['kyllingfilet', 500, 'g'], ['pesto', 1, 'glass'], ['tomater', 250, 'g'], ['parmesan', 50, 'g'], ['olje', 1, 'ss']],
    steps: ['Kok pastaen.', 'Skjær kyllingen i biter og stek den i olje.', 'Del tomatene i to.', 'Vend pasta, kylling, pesto og tomater sammen.', 'Server med revet parmesan.'],
  },
  {
    id: 'kyllingburger', name: 'Kyllingburger med coleslaw', cat: 'kylling', time: 30, tags: ['barn', 'fredag'],
    ing: [['kyllingkjottdeig', 500, 'g'], ['hamburgerbrod', 4, 'stk'], ['kal', 300, 'g'], ['gulrot', 1, 'stk'], ['majones', 3, 'ss'], ['romme', 1, 'dl'], ['tomater', 2, 'stk'], ['salt', null, ''], ['pepper', null, '']],
    steps: ['Form kjøttdeigen til fire burgere. Krydre med salt og pepper.', 'Stek burgerne i 4–5 minutter på hver side.', 'Coleslaw: Strimle kål og riv gulrot. Bland med majones og rømme.', 'Varm brødene og bygg burgerne med tomat og coleslaw.'],
  },
  {
    id: 'pulled-chicken-taco', name: 'Myke tacos med pulled chicken', cat: 'kylling', time: 15, tags: ['barn', 'fredag'],
    ing: [['pulledchicken', 500, 'g'], ['tortilla', 8, 'stk'], ['mais', 1, 'boks'], ['salat', 1, 'pose'], ['romme', 2, 'dl'], ['revetost', 150, 'g']],
    steps: ['Varm kjøttet etter anvisningen på pakken.', 'Varm tortillaene.', 'Sett frem mais, salat, rømme og ost. Alle lager sin egen taco.'],
  },
  {
    id: 'kyllingsuppe', name: 'Kyllingsuppe med grønnsaker', cat: 'kylling', time: 35, tags: ['barn', 'laktosefri'],
    ing: [['kyllingfilet', 400, 'g'], ['gulrot', 3, 'stk'], ['purre', 1, 'stk'], ['poteter', 400, 'g'], ['buljong', 2, 'terninger'], ['vann', 1.5, 'l'], ['salt', null, ''], ['pepper', null, '']],
    steps: ['Kok opp vann med buljong.', 'Skjær poteter, gulrøtter og purre i biter. Kok i 10 minutter.', 'Skjær kyllingen i små biter og legg den i suppen.', 'Småkok i 10 minutter til kyllingen er gjennomkokt.', 'Smak til med salt og pepper.'],
  },

  // ---------- Kjøttdeig og storfe ----------
  {
    id: 'taco', name: 'Fredagstaco', cat: 'storfe', time: 25, tags: ['barn', 'fredag'],
    ing: [['kjottdeig', 400, 'g'], ['tacokrydder', 1, 'pose'], ['tortilla', 8, 'stk'], ['tacoskjell', 1, 'pk'], ['tacosaus', 1, 'glass'], ['salat', 1, 'pose'], ['tomater', 3, 'stk'], ['agurk', 1, 'stk'], ['mais', 1, 'boks'], ['romme', 3, 'dl'], ['revetost', 200, 'g'], ['avokado', 2, 'stk']],
    steps: ['Brun kjøttdeigen i en stekepanne.', 'Rør inn krydder og vann etter anvisningen. Småkok i 5 minutter.', 'Kutt grønnsakene og sett alt på bordet.', 'Varm tortillaer og tacoskjell. Alle lager sin egen taco.'],
  },
  {
    id: 'spaghetti-bolognese', name: 'Spaghetti bolognese', cat: 'storfe', time: 35, tags: ['barn', 'laktosefri'],
    ing: [['kjottdeig', 400, 'g'], ['pasta', 400, 'g', 'spaghetti'], ['hakkedetomater', 2, 'bokser'], ['tomatpure', 2, 'ss'], ['lok', 1, 'stk'], ['gulrot', 2, 'stk'], ['hvitlok', 2, 'fedd'], ['olje', 1, 'ss'], ['salt', null, ''], ['pepper', null, '']],
    steps: ['Hakk løk, hvitløk og gulrot fint.', 'Stek grønnsakene i olje. Tilsett kjøttdeigen og brun den.', 'Rør inn tomatpuré og hakkede tomater.', 'Småkok i 20 minutter. Smak til med salt og pepper.', 'Kok pastaen og server med sausen.'],
  },
  {
    id: 'lasagne', name: 'Lasagne', cat: 'storfe', time: 75, tags: ['barn', 'helg'],
    ing: [['kjottdeig', 500, 'g'], ['hakkedetomater', 2, 'bokser'], ['lok', 1, 'stk'], ['pasta', 12, 'plater', 'lasagneplater'], ['melk', 6, 'dl'], ['smor', 3, 'ss'], ['mel', 3, 'ss'], ['revetost', 200, 'g'], ['salt', null, ''], ['pepper', null, '']],
    steps: ['Brun kjøttdeig og hakket løk. Tilsett tomatene og småkok i 15 minutter.', 'Hvit saus: Smelt smøret og rør inn melet. Spe med melk og kok i 5 minutter.', 'Sett ovnen på 200 °C.', 'Legg kjøttsaus, plater og hvit saus lagvis i en form. Avslutt med hvit saus og ost.', 'Stek i 35–40 minutter.'],
  },
  {
    id: 'hamburger', name: 'Hjemmelagde hamburgere', cat: 'storfe', time: 25, tags: ['barn', 'fredag'],
    ing: [['burgere', 4, 'stk'], ['hamburgerbrod', 4, 'stk'], ['salat', 1, 'pose'], ['tomater', 2, 'stk'], ['rodlok', 1, 'stk'], ['revetost', 4, 'skiver'], ['majones', null, ''], ['poteter', 800, 'g', 'til båter'], ['olje', 2, 'ss']],
    steps: ['Sett ovnen på 225 °C. Del potetene i båter, vend dem i olje og salt. Stek i 30 minutter.', 'Stek burgerne i 3–4 minutter på hver side. Legg på ost det siste minuttet.', 'Varm brødene.', 'Bygg burgerne med salat, tomat, løk og dressing.'],
  },
  {
    id: 'kjottboller-tomatsaus', name: 'Kjøttboller i tomatsaus med pasta', cat: 'storfe', time: 25, tags: ['barn', 'laktosefri'],
    ing: [['kjottboller', 600, 'g'], ['pastasaus', 1, 'glass'], ['pasta', 400, 'g'], ['parmesan', 50, 'g'], ['olje', 1, 'ss']],
    steps: ['Kok pastaen.', 'Brun kjøttbollene i olje.', 'Hell over pastasausen og småkok i 10 minutter.', 'Server med pasta og revet parmesan.'],
  },
  {
    id: 'kjottboller-brun', name: 'Kjøttboller i brun saus med potetmos', cat: 'storfe', time: 35, tags: ['barn'],
    ing: [['kjottboller', 600, 'g'], ['poteter', 1, 'kg'], ['melk', 2, 'dl'], ['smor', 2, 'ss'], ['erter', 300, 'g'], ['mel', 3, 'ss'], ['buljong', 1, 'terning'], ['vann', 5, 'dl']],
    steps: ['Kok potetene møre. Mos dem med varm melk og smør.', 'Brun melet i en kjele. Spe med vann og buljong til en jevn saus.', 'Legg kjøttbollene i sausen og varm dem i 10 minutter.', 'Kok ertene i 3 minutter. Server alt sammen.'],
  },
  {
    id: 'kjottkaker', name: 'Kjøttkaker i brun saus', cat: 'storfe', time: 45, tags: ['barn'],
    ing: [['kjottkaker', 600, 'g'], ['poteter', 1, 'kg'], ['kal', 400, 'g', 'til kålstuing'], ['melk', 3, 'dl'], ['smor', 2, 'ss'], ['mel', 3, 'ss'], ['buljong', 1, 'terning'], ['vann', 5, 'dl']],
    steps: ['Kok potetene.', 'Brun kjøttkakene i smør. Ta dem ut av pannen.', 'Rør mel i stekefettet. Spe med vann og buljong til saus.', 'Legg kjøttkakene i sausen og småkok i 15 minutter.', 'Kålstuing: Kok strimlet kål i melk i 5 minutter og jevn med litt mel.'],
  },
  {
    id: 'karbonader', name: 'Karbonader med løk', cat: 'storfe', time: 30, tags: ['barn'],
    ing: [['karbonader', 8, 'stk'], ['lok', 3, 'stk'], ['poteter', 1, 'kg'], ['gulrot', 4, 'stk'], ['smor', 2, 'ss'], ['salt', null, ''], ['pepper', null, '']],
    steps: ['Kok poteter og gulrøtter.', 'Skjær løken i skiver og stek den myk i smør. Ta den ut.', 'Stek karbonadene i 3–4 minutter på hver side.', 'Legg løken over karbonadene og server med poteter og gulrøtter.'],
  },
  {
    id: 'karbonadedeig-wok', name: 'Karbonadewok med ris', cat: 'storfe', time: 20, tags: ['barn', 'laktosefri'],
    ing: [['karbonadedeig', 400, 'g'], ['wokgronnsaker', 600, 'g'], ['ris', 4, 'dl'], ['soyasaus', 3, 'ss'], ['sweetsour', 1, 'glass'], ['olje', 1, 'ss']],
    steps: ['Kok risen.', 'Brun karbonadedeigen i olje på høy varme.', 'Tilsett grønnsakene og stek i 4 minutter.', 'Rør inn sausene og varm alt gjennom. Server med ris.'],
  },
  {
    id: 'karbonade-burger', name: 'Karbonadeburger med løk', cat: 'storfe', time: 25, tags: ['barn', 'fredag'],
    ing: [['karbonadedeig', 500, 'g'], ['hamburgerbrod', 4, 'stk'], ['lok', 2, 'stk'], ['salat', 1, 'pose'], ['tomater', 2, 'stk'], ['sennep', null, ''], ['salt', null, ''], ['pepper', null, '']],
    steps: ['Form deigen til fire flate burgere. Krydre med salt og pepper.', 'Stek løk i skiver til den er gyllen.', 'Stek burgerne i 3–4 minutter på hver side.', 'Bygg burgerne med salat, tomat, løk og sennep.'],
  },
  {
    id: 'chili-con-carne', name: 'Chili con carne', cat: 'storfe', time: 40, tags: ['glutenfri', 'laktosefri'],
    ing: [['kjottdeig', 400, 'g'], ['bonner', 2, 'bokser', 'kidneybønner'], ['hakkedetomater', 2, 'bokser'], ['lok', 1, 'stk'], ['paprika', 1, 'stk'], ['chili', 1, 'stk'], ['hvitlok', 2, 'fedd'], ['krydder', 2, 'ts', 'spisskummen'], ['ris', 4, 'dl']],
    steps: ['Hakk løk, paprika, chili og hvitløk.', 'Brun kjøttdeigen med grønnsakene og krydderet.', 'Tilsett tomater og skylte bønner.', 'Småkok i 25 minutter. Server med ris.'],
  },
  {
    id: 'biffwok', name: 'Biffstrimler i wok med nudler', cat: 'storfe', time: 20, tags: ['laktosefri'],
    ing: [['biffstrimler', 500, 'g'], ['nudler', 250, 'g'], ['brokkoli', 300, 'g'], ['paprika', 1, 'stk'], ['soyasaus', 4, 'ss'], ['ingefaer', 1, 'ss'], ['hvitlok', 2, 'fedd'], ['olje', 2, 'ss']],
    steps: ['Kok nudlene.', 'Stek kjøttet raskt i olje på høy varme. Ta det ut.', 'Stek grønnsaker, hvitløk og ingefær i 3 minutter.', 'Legg kjøttet tilbake og vend inn nudler og soyasaus.'],
  },
  {
    id: 'storfegryte', name: 'Høstgryte med storfe', cat: 'storfe', time: 120, tags: ['helg', 'glutenfri', 'laktosefri'],
    ing: [['grytekjott', 800, 'g'], ['rotgronnsaker', 800, 'g'], ['lok', 2, 'stk'], ['tomatpure', 2, 'ss'], ['buljong', 2, 'terninger'], ['vann', 7, 'dl'], ['poteter', 800, 'g'], ['olje', 2, 'ss'], ['salt', null, ''], ['pepper', null, '']],
    steps: ['Brun kjøttet i olje i flere omganger.', 'Tilsett løk og tomatpuré og stek i 2 minutter.', 'Hell på vann og buljong. Småkok under lokk i 1 time.', 'Tilsett rotgrønnsakene og kok i 30 minutter til.', 'Server med kokte poteter.'],
  },

  // ---------- Svin ----------
  {
    id: 'koteletter', name: 'Svinekoteletter med ovnsgrønnsaker', cat: 'svin', time: 40, tags: ['glutenfri', 'laktosefri'],
    ing: [['koteletter', 4, 'stk'], ['poteter', 800, 'g'], ['gulrot', 3, 'stk'], ['rodlok', 2, 'stk'], ['olivenolje', 3, 'ss'], ['salt', null, ''], ['pepper', null, '']],
    steps: ['Sett ovnen på 220 °C. Del poteter, gulrøtter og løk i biter.', 'Vend grønnsakene i olje, salt og pepper. Stek i 30 minutter.', 'Krydre kotelettene og stek dem i 3–4 minutter på hver side.', 'Server med ovnsgrønnsakene.'],
  },
  {
    id: 'svinefilet', name: 'Svinefilet med fløtesaus og sopp', cat: 'svin', time: 40, tags: ['glutenfri'],
    ing: [['svinefilet', 600, 'g'], ['champignon', 250, 'g'], ['flote', 3, 'dl'], ['poteter', 800, 'g'], ['brokkoli', 300, 'g'], ['smor', 2, 'ss'], ['salt', null, ''], ['pepper', null, '']],
    steps: ['Kok potetene.', 'Brun filetene i smør. Stek dem ferdig i ovnen på 175 °C til 65 °C innvendig.', 'Stek soppen i samme panne. Hell på fløte og kok saus.', 'Damp brokkolien. Skjær kjøttet i skiver og server.'],
  },
  {
    id: 'svin-sweet-sour', name: 'Sweet & sour med svinekjøtt', cat: 'svin', time: 25, tags: ['barn', 'laktosefri'],
    ing: [['svinestrimler', 500, 'g'], ['sweetsour', 1, 'glass'], ['paprika', 2, 'stk'], ['lok', 1, 'stk'], ['ris', 4, 'dl'], ['olje', 1, 'ss']],
    steps: ['Kok risen.', 'Stek kjøttet i olje på høy varme.', 'Tilsett løk og paprika i biter. Stek i 3 minutter.', 'Hell i sausen og varm alt gjennom. Server med ris.'],
  },
  {
    id: 'pulled-pork-burger', name: 'Pulled pork-burger', cat: 'svin', time: 20, tags: ['barn', 'fredag'],
    ing: [['pulledpork', 500, 'g'], ['hamburgerbrod', 4, 'stk'], ['kal', 300, 'g'], ['gulrot', 1, 'stk'], ['majones', 3, 'ss'], ['romme', 1, 'dl']],
    steps: ['Varm kjøttet etter anvisningen på pakken.', 'Coleslaw: Strimle kål og riv gulrot. Bland med majones og rømme.', 'Varm brødene. Fyll dem med kjøtt og coleslaw.'],
  },
  {
    id: 'polse-potetstappe', name: 'Pølser med potetmos og erter', cat: 'svin', time: 25, tags: ['barn'],
    ing: [['polser', 600, 'g'], ['poteter', 1, 'kg'], ['erter', 300, 'g'], ['melk', 2, 'dl'], ['smor', 2, 'ss'], ['sennep', null, '']],
    steps: ['Kok potetene møre. Mos dem med varm melk og smør.', 'Varm pølsene i vann som ikke koker, eller stek dem.', 'Kok ertene i 3 minutter.', 'Server med sennep.'],
  },
  {
    id: 'polsegryte', name: 'Pølsegryte med tomat', cat: 'svin', time: 30, tags: ['barn', 'laktosefri'],
    ing: [['polser', 500, 'g'], ['hakkedetomater', 2, 'bokser'], ['lok', 1, 'stk'], ['paprika', 1, 'stk'], ['bonner', 1, 'boks'], ['ris', 4, 'dl'], ['olje', 1, 'ss']],
    steps: ['Kok risen.', 'Skjær pølser, løk og paprika i biter. Stek i olje.', 'Tilsett tomater og bønner. Småkok i 15 minutter.', 'Server med ris.'],
  },
  {
    id: 'carbonara', name: 'Pasta carbonara', cat: 'svin', time: 20, tags: ['barn'],
    ing: [['pasta', 400, 'g', 'spaghetti'], ['bacon', 250, 'g'], ['egg', 3, 'stk'], ['parmesan', 80, 'g'], ['pepper', null, '']],
    steps: ['Kok pastaen. Ta vare på en kopp kokevann.', 'Stek baconet sprøtt.', 'Visp egg og revet parmesan sammen.', 'Ta pannen av varmen. Vend pasta, bacon og eggeblandingen raskt sammen. Spe med kokevann.', 'Server med mye pepper.'],
  },
  {
    id: 'spareribs', name: 'Spareribs i ovn med potetbåter', cat: 'svin', time: 120, tags: ['helg', 'fredag', 'laktosefri'],
    ing: [['spareribs', 1.5, 'kg'], ['poteter', 1, 'kg'], ['kal', 300, 'g'], ['majones', 3, 'ss'], ['olje', 2, 'ss'], ['salt', null, '']],
    steps: ['Sett ovnen på 150 °C. Pakk ribbene i folie og stek i 1,5 time.', 'Del potetene i båter og vend dem i olje og salt.', 'Øk varmen til 225 °C. Stek potetene og ribbene uten folie i 25 minutter.', 'Server med coleslaw av kål og majones.'],
  },
  {
    id: 'baconpasta', name: 'Kremet pasta med bacon og brokkoli', cat: 'svin', time: 20, tags: ['barn'],
    ing: [['pasta', 400, 'g'], ['bacon', 200, 'g'], ['brokkoli', 300, 'g'], ['cremefraiche', 3, 'dl'], ['parmesan', 50, 'g'], ['pepper', null, '']],
    steps: ['Kok pastaen. Legg brokkolien i kjelen de siste 3 minuttene.', 'Stek baconet sprøtt.', 'Rør inn crème fraîche og varm opp.', 'Vend inn pasta og brokkoli. Server med parmesan.'],
  },

  // ---------- Lam ----------
  {
    id: 'farikal', name: 'Fårikål', cat: 'lam', time: 150, tags: ['helg', 'glutenfri', 'laktosefri'],
    ing: [['farikalkjott', 1.5, 'kg'], ['kal', 1.5, 'kg'], ['poteter', 1, 'kg'], ['krydder', 2, 'ss', 'hel pepper'], ['salt', 2, 'ts'], ['vann', 3, 'dl']],
    steps: ['Del kålen i båter.', 'Legg kjøtt og kål lagvis i en stor kjele. Strø salt og pepper mellom lagene.', 'Hell på vann og kok opp.', 'Småkok under lokk i 2–2,5 timer til kjøttet er mørt.', 'Server med kokte poteter.'],
  },
  {
    id: 'lammeskiver', name: 'Lammelårskiver med rotmos', cat: 'lam', time: 45, tags: ['glutenfri'],
    ing: [['lammelar', 800, 'g'], ['rotgronnsaker', 800, 'g'], ['poteter', 400, 'g'], ['smor', 3, 'ss'], ['hvitlok', 2, 'fedd'], ['salt', null, ''], ['pepper', null, '']],
    steps: ['Kok rotgrønnsaker og poteter møre. Mos dem med smør.', 'Krydre kjøttet med salt, pepper og hvitløk.', 'Stek skivene i 2–3 minutter på hver side.', 'Server med rotmosen.'],
  },
  {
    id: 'lammegryte', name: 'Lammegryte med tomat og bønner', cat: 'lam', time: 90, tags: ['helg', 'glutenfri', 'laktosefri'],
    ing: [['farikalkjott', 1, 'kg'], ['hakkedetomater', 2, 'bokser'], ['bonner', 1, 'boks'], ['lok', 2, 'stk'], ['gulrot', 3, 'stk'], ['hvitlok', 3, 'fedd'], ['buljong', 1, 'terning'], ['couscous', 4, 'dl'], ['olje', 2, 'ss']],
    steps: ['Brun kjøttet i olje.', 'Tilsett løk, gulrot og hvitløk.', 'Hell i tomater, buljong og 3 dl vann. Småkok under lokk i 1 time.', 'Tilsett bønnene de siste 10 minuttene.', 'Server med couscous.'],
  },
  {
    id: 'lammewok', name: 'Lammestrimler med paprika og ris', cat: 'lam', time: 25, tags: ['glutenfri', 'laktosefri'],
    ing: [['lammestrimler', 500, 'g'], ['paprika', 2, 'stk'], ['rodlok', 1, 'stk'], ['ris', 4, 'dl'], ['hvitlok', 2, 'fedd'], ['krydder', 2, 'ts', 'spisskummen'], ['olje', 2, 'ss']],
    steps: ['Kok risen.', 'Stek kjøttet raskt på høy varme. Ta det ut.', 'Stek paprika, løk og hvitløk med krydderet.', 'Legg kjøttet tilbake og server med ris.'],
  },

  // ---------- Fisk ----------
  {
    id: 'ovnslaks', name: 'Ovnsbakt laks med poteter og brokkoli', cat: 'fisk', time: 30, tags: ['barn', 'glutenfri', 'laktosefri'],
    ing: [['laks', 600, 'g'], ['poteter', 800, 'g'], ['brokkoli', 400, 'g'], ['sitron', 1, 'stk'], ['olivenolje', 2, 'ss'], ['salt', null, ''], ['pepper', null, '']],
    steps: ['Sett ovnen på 200 °C. Kok potetene.', 'Legg laksen i en form. Drypp over olje og krydre med salt og pepper.', 'Bak laksen i 12–15 minutter.', 'Damp brokkolien. Server med sitronbåter.'],
  },
  {
    id: 'laks-teriyaki', name: 'Laks med soya og sesam, ris og grønnsaker', cat: 'fisk', time: 25, tags: ['laktosefri'],
    ing: [['laks', 600, 'g'], ['ris', 4, 'dl'], ['brokkoli', 300, 'g'], ['gulrot', 2, 'stk'], ['soyasaus', 4, 'ss'], ['sukker', 1, 'ss'], ['ingefaer', 1, 'ts']],
    steps: ['Kok risen.', 'Rør sammen soyasaus, sukker og ingefær.', 'Stek laksen i 3–4 minutter på hver side. Hell over sausen det siste minuttet.', 'Damp brokkoli og gulrøtter. Server med ris.'],
  },
  {
    id: 'laks-pasta', name: 'Kremet pasta med laks og spinat', cat: 'fisk', time: 20, tags: ['barn'],
    ing: [['laks', 400, 'g'], ['pasta', 400, 'g'], ['cremefraiche', 3, 'dl'], ['spinat', 100, 'g'], ['sitron', 1, 'stk'], ['salt', null, ''], ['pepper', null, '']],
    steps: ['Kok pastaen.', 'Skjær laksen i terninger.', 'Varm crème fraîche og legg i laksen. Trekk i 4 minutter.', 'Vend inn spinat, pasta og litt sitronsaft.'],
  },
  {
    id: 'orret', name: 'Stekt ørret med agurksalat', cat: 'fisk', time: 25, tags: ['glutenfri'],
    ing: [['orret', 600, 'g'], ['poteter', 800, 'g'], ['agurk', 1, 'stk'], ['romme', 2, 'dl'], ['eddik', 2, 'ss'], ['sukker', 1, 'ss'], ['smor', 2, 'ss'], ['salt', null, '']],
    steps: ['Kok potetene.', 'Agurksalat: Skjær agurken tynt. Bland med eddik, sukker og litt vann.', 'Stek fisken i smør, 3 minutter på hver side.', 'Server med poteter, agurksalat og rømme.'],
  },
  {
    id: 'torsk', name: 'Torsk med bacon og gulrotstuing', cat: 'fisk', time: 30, tags: ['glutenfri'],
    ing: [['torsk', 600, 'g'], ['bacon', 150, 'g'], ['gulrot', 5, 'stk'], ['poteter', 800, 'g'], ['smor', 2, 'ss'], ['flote', 1, 'dl'], ['salt', null, '']],
    steps: ['Kok potetene.', 'Kok gulrøttene møre. Mos dem grovt med smør og fløte.', 'Stek baconet sprøtt.', 'Salt fisken og stek den i 3 minutter på hver side.', 'Server fisken med bacon, stuing og poteter.'],
  },
  {
    id: 'sei', name: 'Panert sei med remulade', cat: 'fisk', time: 25, tags: ['barn'],
    ing: [['sei', 600, 'g'], ['egg', 1, 'stk'], ['mel', 1, 'dl'], ['poteter', 800, 'g'], ['gulrot', 4, 'stk'], ['majones', 3, 'ss'], ['smor', 2, 'ss'], ['salt', null, '']],
    steps: ['Kok poteter og gulrøtter.', 'Vend fisken i mel, deretter sammenvispet egg og mel igjen.', 'Stek fisken i smør, 3–4 minutter på hver side.', 'Server med grønnsaker og majones eller remulade.'],
  },
  {
    id: 'fiskesuppe', name: 'Bergensk fiskesuppe', cat: 'fisk', time: 35, tags: ['glutenfri'],
    ing: [['fiskesuppefisk', 500, 'g'], ['gulrot', 2, 'stk'], ['purre', 1, 'stk'], ['poteter', 300, 'g'], ['flote', 3, 'dl'], ['buljong', 2, 'terninger', 'fiskebuljong'], ['vann', 1, 'l'], ['romme', 1, 'dl'], ['salt', null, '']],
    steps: ['Kok opp vann med buljong.', 'Skjær gulrot, purre og poteter i små biter. Kok i 10 minutter.', 'Tilsett fløte og fisk. Trekk i 5 minutter uten å koke.', 'Server med en klatt rømme.'],
  },
  {
    id: 'fiskekaker', name: 'Fiskekaker med kokte grønnsaker', cat: 'fisk', time: 25, tags: ['barn'],
    ing: [['fiskekaker', 600, 'g'], ['poteter', 800, 'g'], ['gulrot', 4, 'stk'], ['brokkoli', 300, 'g'], ['smor', 2, 'ss']],
    steps: ['Kok poteter og gulrøtter.', 'Stek fiskekakene i smør, 3 minutter på hver side.', 'Damp brokkolien.', 'Server med smeltet smør.'],
  },
  {
    id: 'fiskepudding', name: 'Fiskepudding med hvit saus', cat: 'fisk', time: 25, tags: ['barn'],
    ing: [['fiskepudding', 1, 'stk'], ['poteter', 800, 'g'], ['gulrot', 4, 'stk'], ['melk', 4, 'dl'], ['smor', 2, 'ss'], ['mel', 2, 'ss'], ['salt', null, '']],
    steps: ['Kok poteter og gulrøtter.', 'Skjær puddingen i skiver og stek dem lett i smør.', 'Hvit saus: Smelt smør, rør inn mel og spe med melk. Kok i 5 minutter.', 'Server alt sammen.'],
  },
  {
    id: 'reketaco', name: 'Taco med scampi', cat: 'fisk', time: 20, tags: ['fredag'],
    ing: [['scampi', 400, 'g'], ['tortilla', 8, 'stk'], ['kal', 200, 'g'], ['avokado', 2, 'stk'], ['romme', 2, 'dl'], ['chili', 1, 'stk'], ['koriander', null, ''], ['sitron', 1, 'stk', 'eller lime'], ['hvitlok', 2, 'fedd'], ['olje', 1, 'ss']],
    steps: ['Stek scampien med hvitløk og chili i 2–3 minutter.', 'Strimle kålen. Mos avokadoen med litt sitronsaft.', 'Varm tortillaene.', 'Fyll lefsene med scampi, kål, avokado, rømme og koriander.'],
  },
  {
    id: 'reker-brod', name: 'Rekefest med loff og majones', cat: 'fisk', time: 10, tags: ['fredag'],
    ing: [['reker', 1, 'kg'], ['brod', 1, 'stk'], ['majones', 1, 'dl'], ['sitron', 1, 'stk'], ['salat', 1, 'pose']],
    steps: ['Pill rekene, eller la alle pille selv ved bordet.', 'Skjær brødet i skiver.', 'Server med majones, sitron og salat.'],
  },
  {
    id: 'tunfiskpasta', name: 'Pasta med tunfisk og tomat', cat: 'fisk', time: 20, tags: ['laktosefri'],
    ing: [['pasta', 400, 'g'], ['tunfisk', 2, 'bokser'], ['hakkedetomater', 1, 'boks'], ['lok', 1, 'stk'], ['hvitlok', 2, 'fedd'], ['olivenolje', 2, 'ss']],
    steps: ['Kok pastaen.', 'Stek hakket løk og hvitløk i olje.', 'Tilsett tomater og la sausen småkoke i 10 minutter.', 'Vend inn tunfisk og pasta.'],
  },

  // ---------- Vegetar ----------
  {
    id: 'falafel', name: 'Falafel i pita med tzatziki', cat: 'vegetar', time: 20, tags: ['fredag'],
    ing: [['falafel', 400, 'g'], ['tortilla', 4, 'stk', 'eller pitabrød'], ['salat', 1, 'pose'], ['tomater', 3, 'stk'], ['agurk', 1, 'stk'], ['rodlok', 1, 'stk'], ['tzatziki', 1, 'beger']],
    steps: ['Varm falafelen i ovnen etter anvisningen.', 'Kutt grønnsakene.', 'Varm brødene og fyll dem med falafel, grønnsaker og tzatziki.'],
  },
  {
    id: 'omelett', name: 'Ovnsomelett med grønnsaker', cat: 'vegetar', time: 35, tags: ['barn', 'glutenfri'],
    ing: [['egg', 8, 'stk'], ['melk', 2, 'dl'], ['paprika', 1, 'stk'], ['champignon', 200, 'g'], ['tomater', 2, 'stk'], ['revetost', 100, 'g'], ['salat', 1, 'pose'], ['salt', null, ''], ['pepper', null, '']],
    steps: ['Sett ovnen på 180 °C.', 'Visp egg, melk, salt og pepper.', 'Kutt grønnsakene og legg dem i en smurt form.', 'Hell over eggeblandingen og strø over ost.', 'Stek i 25 minutter. Server med salat.'],
  },
  {
    id: 'pizza', name: 'Hjemmelaget pizza', cat: 'vegetar', time: 35, tags: ['barn', 'fredag'],
    ing: [['pizzabunn', 2, 'stk'], ['pizzasaus', 1, 'boks'], ['mozzarella', 250, 'g'], ['revetost', 150, 'g'], ['paprika', 1, 'stk'], ['champignon', 150, 'g'], ['rodlok', 1, 'stk']],
    steps: ['Sett ovnen på 250 °C.', 'Kjevle ut bunnen og smør på sausen.', 'Fordel ost og grønnsaker.', 'Stek pizzaen nederst i ovnen i 10–12 minutter.'],
  },
  {
    id: 'pizza-pepperoni', name: 'Pizza med pepperoni', cat: 'svin', time: 30, tags: ['barn', 'fredag'],
    ing: [['pizzabunn', 2, 'stk'], ['pizzasaus', 1, 'boks'], ['pepperoni', 150, 'g'], ['revetost', 250, 'g'], ['mozzarella', 125, 'g']],
    steps: ['Sett ovnen på 250 °C.', 'Smør sausen på bunnene.', 'Fordel ost og pepperoni.', 'Stek i 10–12 minutter.'],
  },
  {
    id: 'pasta-pesto-veg', name: 'Pasta med pesto, tomat og mozzarella', cat: 'vegetar', time: 15, tags: ['barn'],
    ing: [['pasta', 400, 'g'], ['pesto', 1, 'glass'], ['tomater', 300, 'g'], ['mozzarella', 125, 'g'], ['spinat', 65, 'g']],
    steps: ['Kok pastaen.', 'Del tomater og mozzarella i biter.', 'Vend pasta, pesto, spinat, tomater og mozzarella sammen.'],
  },
  {
    id: 'linsesuppe', name: 'Linsesuppe med tomat og kokos', cat: 'vegetar', time: 30, tags: ['glutenfri', 'laktosefri'],
    ing: [['linser', 3, 'dl'], ['hakkedetomater', 1, 'boks'], ['kokosmelk', 1, 'boks'], ['lok', 1, 'stk'], ['gulrot', 2, 'stk'], ['hvitlok', 2, 'fedd'], ['krydder', 2, 'ts', 'karri'], ['buljong', 1, 'terning'], ['vann', 8, 'dl']],
    steps: ['Stek hakket løk, gulrot og hvitløk med karri.', 'Tilsett skylte linser, tomater, kokosmelk, vann og buljong.', 'Småkok i 20 minutter til linsene er møre.', 'Kjør suppen jevn med en stavmikser, eller server den som den er.'],
  },
  {
    id: 'kikertgryte', name: 'Kikertgryte med spinat og ris', cat: 'vegetar', time: 25, tags: ['glutenfri', 'laktosefri'],
    ing: [['kikerter', 2, 'bokser'], ['kokosmelk', 1, 'boks'], ['karripasta', 2, 'ss'], ['spinat', 100, 'g'], ['lok', 1, 'stk'], ['ris', 4, 'dl'], ['olje', 1, 'ss']],
    steps: ['Kok risen.', 'Stek hakket løk og karripasta i olje.', 'Tilsett skylte kikerter og kokosmelk. Småkok i 10 minutter.', 'Vend inn spinaten. Server med ris.'],
  },
  {
    id: 'vegetar-taco', name: 'Vegetartaco med bønner og søtpotet', cat: 'vegetar', time: 35, tags: ['fredag', 'barn'],
    ing: [['sotpotet', 600, 'g'], ['bonner', 1, 'boks', 'svarte bønner'], ['tortilla', 8, 'stk'], ['tacokrydder', 1, 'pose'], ['mais', 1, 'boks'], ['avokado', 2, 'stk'], ['romme', 2, 'dl'], ['revetost', 150, 'g'], ['olje', 2, 'ss']],
    steps: ['Sett ovnen på 220 °C.', 'Skjær søtpoteten i terninger. Vend i olje og tacokrydder. Stek i 25 minutter.', 'Varm bønnene.', 'Fyll lefsene med søtpotet, bønner, mais, avokado, rømme og ost.'],
  },
  {
    id: 'blomkalsuppe', name: 'Kremet blomkålsuppe', cat: 'vegetar', time: 30, tags: [],
    ing: [['blomkal', 1, 'stk'], ['poteter', 300, 'g'], ['lok', 1, 'stk'], ['flote', 2, 'dl'], ['buljong', 2, 'terninger', 'grønnsaksbuljong'], ['vann', 1, 'l'], ['brod', 1, 'stk', 'til servering']],
    steps: ['Kutt blomkål, poteter og løk i biter.', 'Kok grønnsakene i vann med buljong i 15 minutter.', 'Kjør suppen jevn med en stavmikser.', 'Rør inn fløte og smak til. Server med brød.'],
  },
  {
    id: 'grateng', name: 'Brokkoli- og blomkålgrateng', cat: 'vegetar', time: 40, tags: ['barn'],
    ing: [['brokkoli', 400, 'g'], ['blomkal', 1, 'stk'], ['egg', 3, 'stk'], ['melk', 3, 'dl'], ['revetost', 150, 'g'], ['brod', 1, 'stk', 'til servering']],
    steps: ['Sett ovnen på 200 °C.', 'Del grønnsakene i buketter og kok dem i 3 minutter.', 'Legg dem i en form. Visp egg og melk og hell over.', 'Strø over ost og stek i 25 minutter.'],
  },
  {
    id: 'shakshuka', name: 'Shakshuka med brød', cat: 'vegetar', time: 25, tags: ['laktosefri'],
    ing: [['egg', 8, 'stk'], ['hakkedetomater', 2, 'bokser'], ['paprika', 2, 'stk'], ['lok', 1, 'stk'], ['hvitlok', 2, 'fedd'], ['krydder', 2, 'ts', 'spisskummen og paprika'], ['brod', 1, 'stk'], ['olivenolje', 2, 'ss']],
    steps: ['Stek løk, paprika og hvitløk i olje med krydderet.', 'Tilsett tomatene og la sausen småkoke i 10 minutter.', 'Lag små groper og knekk eggene i dem.', 'Legg på lokk og trekk i 6–8 minutter. Server med brød.'],
  },
  {
    id: 'sotpotet-feta', name: 'Ovnsbakt søtpotet med kikerter og feta', cat: 'vegetar', time: 35, tags: ['glutenfri'],
    ing: [['sotpotet', 800, 'g'], ['kikerter', 1, 'boks'], ['feta', 150, 'g'], ['spinat', 65, 'g'], ['rodlok', 1, 'stk'], ['olivenolje', 3, 'ss'], ['krydder', 2, 'ts', 'spisskummen'], ['salt', null, '']],
    steps: ['Sett ovnen på 220 °C.', 'Skjær søtpotet og løk i biter. Vend dem med skylte kikerter, olje, krydder og salt.', 'Stek i 25–30 minutter.', 'Vend inn spinaten og strø over smuldret feta.'],
  },
  {
    id: 'gronnsakswok', name: 'Grønnsakswok med egg og nudler', cat: 'vegetar', time: 20, tags: ['barn', 'laktosefri'],
    ing: [['wokgronnsaker', 800, 'g'], ['nudler', 250, 'g'], ['egg', 4, 'stk'], ['soyasaus', 4, 'ss'], ['hvitlok', 2, 'fedd'], ['ingefaer', 1, 'ss'], ['olje', 2, 'ss']],
    steps: ['Kok nudlene.', 'Stek grønnsaker, hvitløk og ingefær i olje på høy varme i 4 minutter.', 'Skyv grønnsakene til siden. Knekk eggene i pannen og rør dem til eggerøre.', 'Vend inn nudler og soyasaus.'],
  },
  {
    id: 'tomatsuppe', name: 'Tomatsuppe med makaroni og egg', cat: 'vegetar', time: 25, tags: ['barn', 'laktosefri'],
    ing: [['hakkedetomater', 2, 'bokser'], ['lok', 1, 'stk'], ['gulrot', 1, 'stk'], ['pasta', 150, 'g', 'makaroni'], ['egg', 4, 'stk'], ['buljong', 1, 'terning', 'grønnsaksbuljong'], ['vann', 6, 'dl'], ['sukker', 1, 'ts'], ['olje', 1, 'ss']],
    steps: ['Stek hakket løk og gulrot i olje.', 'Tilsett tomater, vann, buljong og sukker. Småkok i 10 minutter og kjør suppen jevn.', 'Kok makaronien i suppen i 8 minutter.', 'Kok eggene i 9 minutter. Server suppen med halve egg.'],
  },
  {
    id: 'vegetar-chili', name: 'Vegetarchili med bønner og mais', cat: 'vegetar', time: 30, tags: ['glutenfri', 'laktosefri'],
    ing: [['bonner', 2, 'bokser'], ['hakkedetomater', 2, 'bokser'], ['paprika', 2, 'stk'], ['mais', 1, 'boks'], ['lok', 1, 'stk'], ['chili', 1, 'stk'], ['hvitlok', 2, 'fedd'], ['krydder', 2, 'ts', 'spisskummen'], ['ris', 4, 'dl'], ['olje', 1, 'ss']],
    steps: ['Kok risen.', 'Stek løk, paprika, chili og hvitløk med krydderet.', 'Tilsett tomater og skylte bønner. Småkok i 15 minutter.', 'Rør inn maisen og server med ris.'],
  },
  {
    id: 'soppasta', name: 'Kremet soppasta med parmesan', cat: 'vegetar', time: 20, tags: [],
    ing: [['pasta', 400, 'g'], ['champignon', 400, 'g'], ['flote', 3, 'dl'], ['parmesan', 60, 'g'], ['hvitlok', 2, 'fedd'], ['smor', 2, 'ss'], ['salt', null, ''], ['pepper', null, '']],
    steps: ['Kok pastaen.', 'Skjær soppen i skiver og stek den gyllen i smør med hvitløk.', 'Hell på fløte og kok sausen litt inn.', 'Vend inn pasta og parmesan. Smak til med salt og pepper.'],
  },
];
