// Database esercizi completo estratto dalla scheda
export const exerciseData = {
    // Riscaldamento
    bike: {
        name: 'Bike/Tapirulan',
        focus: 'Cardio a basso impatto, riscaldamento',
        come: 'Pedalare sulla cyclette a intensità moderata mantenendo una frequenza cardiaca costante.',
        tecnica: 'Respirazione regolare, postura corretta sulla sella',
        note: 'Riscaldamento',
        duration: '12\'',
        image: '/assets/images/exercises/bike.jpg'
    },
    circonduzione: {
        name: 'Circonduzione Braccia',
        focus: 'Mobilità spalle',
        come: 'In piedi, ruotare le braccia descrivendo ampi cerchi, prima in avanti poi indietro.',
        tecnica: 'Movimenti ampi e controllati, non forzare',
        note: '',
        image: '/assets/images/exercises/circonduzione.jpg'
    },
    mobilita: {
        name: 'Mobilità Spalle e Polsi',
        focus: 'Preparazione articolazioni',
        come: 'Eseguire rotazioni delle spalle e dei polsi in tutte le direzioni.',
        tecnica: 'Movimenti lenti e controllati',
        note: '',
        image: '/assets/images/exercises/mobilita.jpg'
    },

    // Fisioterapia Allenamento A
    heelraises: {
        name: 'SL Heel Raises con Step',
        series: '3×10 + 15" per lato',
        carico: 'Manubrio 8 KG',
        recupero: 'SS (Superserie con boxbridge)',
        focus: 'Polpacci e stabilità della caviglia',
        come: 'In piedi su uno step, solleva il tallone sulla punta del piede (un piede alla volta). Il ginocchio deve rimanere dritto. Tieni un manubrio in mano per equilibrio e carico.',
        tecnica: 'Movimento lento e controllato, pausa in alto',
        note: 'Sollevamento sulla punta, ginocchio dritto',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2ifIblAU8-vymQNpYc1DtQKv_4SivDwwtbw&s',
        fisio: true
    },
    boxbridge: {
        name: 'SL Box Bridge',
        series: '3×5+10"+5 per lato',
        carico: '-',
        recupero: '1\'',
        focus: 'Glutei, core, stabilità unilaterale',
        come: 'Sdraiato supino, un piede appoggiato su un box/step, l\'altro sollevato. Solleva i fianchi contraendo i glutei.',
        tecnica: '"Alza bene il sedere" - contrai fortemente i glutei in alto',
        note: 'Alza bene il sedere',
        image: 'https://escapefitness.com/wps/us/wp-content/uploads/sites/3/2021/12/Escape-Fitness-Plyometric-Box-Exercises-Single-Leg-Glute-Bridge.jpg',
        fisio: true
    },
    hipthrust: {
        name: 'Hip Thrust',
        series: '3×12',
        carico: '30 KG',
        recupero: 'SS (Superserie con Side Walk)',
        focus: 'Glutei, forza posteriore catena',
        come: 'Schiena appoggiata alla panca, bilanciere sui fianchi. Spingi i fianchi verso l\'alto contraendo i glutei.',
        tecnica: 'Pausa di 2 secondi nella posizione alta, controllo del movimento',
        note: 'Stai 2" su ad ogni ripetizione',
        image: 'https://hips.hearstapps.com/hmg-prod/images/barbell-hip-thrust-6549fb67257af.png?resize=980:*',
        fisio: true
    },
    sidewalk: {
        name: 'Side Walk',
        series: '3×6-6/4-4/2-2',
        carico: 'Elastico sui piedi',
        recupero: '1\'',
        focus: 'Glutei medi, stabilità dell\'anca',
        come: 'Elastico intorno alle caviglie, cammina lateralmente mantenendo tensione costante. Non trascinare i piedi.',
        tecnica: 'Elastico sempre in tensione, passi controllati',
        note: 'Non strisciare il piede, elastico sempre in tensione',
        image: 'https://www.functionaltrainingschool.com/wp-content/uploads/2020/07/Mini-band-side-walk.jpg',
        fisio: true
    },
    elvis: {
        name: 'Elvis in Equilibrio su un Piede',
        series: '2×10 per lato',
        carico: 'Tappetino piegato',
        recupero: 'No rest',
        focus: 'Equilibrio e stabilità',
        come: 'In equilibrio su un piede, eseguire movimenti controllati.',
        tecnica: 'Esecuzione lenta',
        note: 'Tappetino piegato',
        image: '/assets/images/exercises/elvis.jpg',
        fisio: true
    },

    // Upper Body Push
    pancapiana: {
        name: 'Panca Piana Manubri',
        series: '4×8',
        carico: 'Progressivo',
        recupero: '1\'30"',
        focus: 'Pettorali, spalle anteriori, tricipiti',
        come: 'Sdraiato su panca, manubri in mano, abbassa i pesi verso il petto e spingi verso l\'alto.',
        tecnica: 'Controllo eccentrico, fermo 1" al petto, non far rimbalzare',
        note: 'Concentrati sul controllo eccentrico, fermo al petto 1"',
        image: 'https://articoli.nonsolofitness.it/resources/originals/7309abb1ee89afc90ef8acf9ad101094.jpg'
    },
    croci: {
        name: 'Croci Panca Inclinata 32°',
        series: '3×20 iso 2"',
        carico: 'Manubri',
        recupero: '2\'',
        focus: 'Pettorali (parte alta), definizione',
        come: 'Su panca inclinata, braccia aperte con manubri, abbassa lateralmente e richiudi sopra il petto.',
        tecnica: 'Pausa isometrica 2", poi subito push-up senza pausa',
        note: 'Superset: esaurimento croci → push-up immediati',
        image: 'https://www.muscoli.info/Media/MuscoliInfo/Immagini/Esercizi/croci-con-manubri-su-panca-inclinata.jpg'
    },
    militarypress: {
        name: 'Military Press Manubri',
        series: '3×10',
        carico: 'Progressivo',
        recupero: '1\'30"',
        focus: 'Spalle (deltoidi), core',
        come: 'In piedi o seduto, manubri all\'altezza spalle, spingi verso l\'alto sopra la testa.',
        tecnica: 'Core attivo, non inarcare la schiena, movimento verticale',
        note: 'Core attivo, non inarcare la schiena',
        image: 'https://www.muscoli.info/Media/MuscoliInfo/Immagini/Esercizi/lento-con-manubri.jpg'
    },
    alzatelaterali: {
        name: 'Alzate Laterali',
        series: '3×12',
        carico: 'Manubri leggeri',
        recupero: '1\'',
        focus: 'Deltoidi laterali',
        come: 'In piedi, alza i manubri lateralmente fino all\'altezza delle spalle.',
        tecnica: 'Focus forma, non carico',
        note: 'Focus forma, non carico',
        image: 'https://www.my-personaltrainer.it/2023/01/12/alzate-laterali-orig.jpeg'
    },
    pushdown: {
        name: 'Push Down Corda',
        series: '3×12',
        carico: 'Cavo',
        recupero: '1\'30"',
        focus: 'Tricipiti',
        come: 'Al cavo, corda in mano, spingi verso il basso estendendo i tricipiti. Separa la corda in fondo.',
        tecnica: 'Gomiti fissi ai fianchi, contrazione finale',
        note: 'Tricipiti',
        image: 'https://www.projectinvictus.it/wp-content/uploads/2018/02/Macchine-2.0.png'
    },
    dips: {
        name: 'Dips tra Sedie',
        series: '3× max',
        carico: 'Corpo libero',
        recupero: '1\'30"',
        focus: 'Tricipiti, pettorali',
        come: 'Tra due sedie, abbassa il corpo flettendo i gomiti e risali.',
        tecnica: 'Controllo del movimento, non forzare se dà fastidio alla spalla',
        note: 'Se non dà fastidio alla spalla',
        image: 'https://www.muscoli.info/Media/MuscoliInfo/Immagini/Esercizi/distensioni-o-dip-alle-parallele-della-sedia-del-capitano.jpg'
    },

    // Fisioterapia Allenamento B
    catcow: {
        name: 'Cat-Cow',
        focus: 'Mobilità colonna vertebrale',
        come: 'A quattro zampe, alterna la posizione della schiena tra arcuata (cat) e insellata (cow).',
        tecnica: 'Movimenti lenti e controllati',
        note: '',
        image: 'https://www.alessioferlito.it/wp-content/uploads/2023/07/Cat-cow-3-1024x576.png'
    },
    deadbug: {
        name: 'Dead Bug',
        focus: 'Core, stabilità',
        come: 'Supino, braccia e gambe in alto. Abbassa alternativamente braccio e gamba opposti.',
        tecnica: 'Mantieni la schiena aderente al pavimento',
        note: '',
        image: '/assets/images/exercises/deadbug.gif',
        video: 'https://www.youtube.com/watch?v=g_BYB0R-4Ws'
    },
    plankestensione: {
        name: 'Plank + Estensione Anca Alternata',
        series: '4×45"',
        carico: '-',
        recupero: 'SS (Superserie con L-Sit)',
        focus: 'Core, glutei, stabilità',
        come: 'Posizione plank, alterna l\'estensione di una gamba verso l\'alto mantenendo il core stabile.',
        tecnica: 'Non ruotare il bacino, movimento controllato',
        note: '',
        image: 'https://www.spine-center.it/images/contenuti/news/il-plank-come-esercizio-terapeutico-in-campo-riabilitativo.jpg',
        fisio: true
    },
    lsit: {
        name: 'L-Sit',
        series: '4×45"',
        carico: '-',
        recupero: '45"',
        focus: 'Core, forza funzionale',
        come: 'Seduto per terra, gambe distese, solleva tutto il corpo con le braccia. Ginocchia in massima estensione, piedi a martello.',
        tecnica: 'Non mollare mai, gambe che non si toccano',
        note: 'Ginocchia in massima estensione, non mollare mai, piedi a martello e gambe che non si toccano',
        image: 'https://www.projectinvictus.it/wp-content/uploads/2023/07/17-scaled.jpg',
        fisio: true
    },
    squattempo: {
        name: 'Squat Tempo',
        series: '3×8',
        carico: '20 KG',
        recupero: 'SS (Superserie con Wall Sit)',
        focus: 'Quadricipiti, controllo',
        come: 'Squat eseguito con tempo controllato: 3" in discesa, 3" fermo in basso, 3" in salita.',
        tecnica: '3" a scendere, 3" fermo iso, 3" a salire',
        note: '3" a scendere, 3" fermo iso, 3" a salire',
        image: 'https://www.sustainablebb.com/wp-content/uploads/2023/12/1-1024x819.jpg',
        fisio: true
    },
    wallsit: {
        name: 'Wall Sit',
        series: '3×40"',
        carico: '-',
        recupero: '2\'',
        focus: 'Quadricipiti, resistenza muscolare',
        come: 'Schiena contro il muro, scivola giù fino a cosce parallele al pavimento (90° alle ginocchia). Mantieni la posizione.',
        tecnica: 'Schiena sempre contro il muro, distribuzione peso sui talloni',
        note: '',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2GX0zHkq463-ra0ocvD9z_foahJgR_mBArQ&s',
        fisio: true
    },
    affondo: {
        name: 'Affondo Statico con Disco sopra la Testa',
        series: '3×10 per lato',
        carico: 'Disco 5 KG',
        recupero: '2\'',
        focus: 'Gambe, core, stabilità',
        come: 'Posizione di affondo statico, disco sollevato sopra la testa.',
        tecnica: 'Vedi video, occhio agli angoli',
        note: 'Vedi video, occhio agli angoli',
        image: 'https://static.vecteezy.com/ti/vettori-gratis/p1/8424324-uomo-che-fa-affondo-con-bilanciere-piatto-illustrazione-isolato-su-sfondo-bianco-vettoriale.jpg',
        fisio: true
    },

    // Upper Body Pull
    trazioni: {
        name: 'Lat Machine',
        series: '4x10',
        carico: '25kg',
        recupero: '1\'',
        focus: 'Dorsali, bicipiti, grip strength',
        come: 'seduto alla lat machine, tira il corpo/peso verso l\'alto.',
        tecnica: 'Discesa lenta 3 secondi, retrazione scapole',
        note: 'Discesa lenta 3 secondi (come suggerito dai PT). Se non riesci: Lat Machine 4×10',
        image: 'https://s3assets.skimble.com/assets/1825601/image_full.jpg'
    },
    latmachine: {
        name: 'Lat Machine',
        series: '4x10',
        carico: '25kg',
        recupero: '1\'',
        focus: 'Dorsali, bicipiti, grip strength',
        come: 'seduto alla lat machine, tira il corpo/peso verso l\'alto.',
        tecnica: 'Discesa lenta 3 secondi, retrazione scapole',
        note: 'Discesa lenta 3 secondi (come suggerito dai PT). Se non riesci: Lat Machine 4×10',
        image: 'https://s3assets.skimble.com/assets/1825601/image_full.jpg'
    },
    pulley: {
        name: 'Pulley/Rematore Cavo',
        series: '3×12',
        carico: 'Cavo',
        recupero: '1\'',
        focus: 'Schiena, dorsali',
        come: 'Seduto al cavo, tira verso il petto mantenendo la schiena dritta.',
        tecnica: 'Schiena, focus retrazione scapole',
        note: 'Schiena, focus retrazione scapole',
        image: 'https://www.abcallenamento.it/wp-content/uploads/2021/10/seated-cable-row-middle-back-1.600x420.73982.jpg'
    },
    curlpanca: {
        name: 'Curl Panca 59° Manubri',
        series: '3×10',
        carico: 'Manubri',
        recupero: '2\'',
        focus: 'Bicipiti',
        come: 'Su panca inclinata a 59°, esegui curl con manubri.',
        tecnica: 'Movimento controllato',
        note: 'Bicipiti',
        image: 'https://www.muscoli.info/Media/MuscoliInfo/Immagini/Esercizi/curl-con-manubri-a-presa-supina-su-panca-inclinata.jpg'
    },
    hammercurl: {
        name: 'Hammer Curl',
        series: '3×10 iso 2"',
        carico: 'Manubri',
        recupero: '2\'',
        focus: 'Bicipiti, avambracci',
        come: 'Manubri con presa neutra (palmi verso interno), fletti i gomiti portando i pesi verso le spalle.',
        tecnica: 'Pausa isometrica 2", movimento controllato',
        note: 'Bicipiti e avambracci',
        image: 'https://www.my-personaltrainer.it/2023/01/04/hammer-curl_900x760.jpeg'
    },
    curlpolsi: {
        name: 'Curl Polsi',
        series: '3×15',
        carico: 'Manubri',
        recupero: '1\'',
        focus: 'Avambracci, grip strength',
        come: 'Seduto, avambracci appoggiati alle cosce, fletti i polsi verso l\'alto tenendo i manubri.',
        tecnica: 'Solo movimento dei polsi, controllo eccentrico',
        note: 'Specifico avambracci (molto importante per te)',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYupNbpO5s8rTraJvHNHNcVg3cTsoYZhL0XQ&s'
    },
    reversecurl: {
        name: 'Reverse Curl',
        series: '3×12',
        carico: 'Manubri',
        recupero: '1\'',
        focus: 'Avambracci',
        come: 'Curl con presa prona (dorso della mano verso l\'alto).',
        tecnica: 'Movimento controllato',
        note: 'Flessori avambracci',
        image: 'https://www.lyfta.app/_next/image?url=https%3A%2F%2Flyfta.app%2Fimages%2Fexercises%2F03681101.png&w=640&q=80'
    },
    farmerswalk: {
        name: 'Farmer\'s Walk',
        series: '2×30-45 metri (o 3×)',
        carico: 'Manubri pesanti',
        recupero: '2\'',
        focus: 'Avambracci, grip strength, core',
        come: 'Manubri pesanti in mano, cammina mantenendo postura eretta per la distanza/tempo prestabilito.',
        tecnica: 'Postura perfetta, spalle indietro, passi controllati',
        note: 'Fondamentale per presa e avambracci',
        image: 'https://www.healthyway.it/wp-content/uploads/2024/06/grip-training-allenamento-1024x683.jpg'
    },

    // Addominali
    vup: {
        name: 'V-up',
        focus: 'Core, addominali superiori e inferiori',
        come: 'Sdraiato supino, solleva simultaneamente gambe e busto formando una V.',
        tecnica: 'Movimento controllato, espira in contrazione',
        note: 'App Tabata Timer - 20" lavoro / 10" riposo',
        image: 'https://i.ytimg.com/vi/7UVgs18Y1P4/maxresdefault.jpg'
    },
    crunch: {
        name: 'Crunch',
        focus: 'Addominali',
        come: 'Sdraiato supino, solleva le spalle da terra contraendo gli addominali.',
        tecnica: 'Non tirare il collo, focus sulla contrazione',
        note: 'App Tabata Timer - 20" lavoro / 10" riposo',
        image: 'https://www.muscoli.info/Media/MuscoliInfo/Immagini/Esercizi/crunch-a-terra.jpg'
    },
    biciclette: {
        name: 'Biciclette',
        focus: 'Addominali obliqui',
        come: 'Supino, alterna gomito-ginocchio opposti simulando la pedalata.',
        tecnica: 'Movimento controllato, torsione del busto',
        note: 'App Tabata Timer - 20" lavoro / 10" riposo',
        image: 'https://www.muscoli.info/Media/MuscoliInfo/Immagini/Esercizi/crunch-a-bicicletta.jpg'
    },
    plank: {
        name: 'Plank',
        focus: 'Core, stabilità',
        come: 'Posizione prona sugli avambracci, corpo in linea retta dalla testa ai piedi.',
        tecnica: 'Core attivo, non far cedere i fianchi',
        note: 'Mantieni la posizione',
        image: 'https://www.posturabenessere.com/resources/big/717de221a388659d4e1ff6e192c12350.jpg.webp'
    },
    hollowhold: {
        name: 'Hollow Hold',
        series: '3×30"',
        recupero: '1\'',
        focus: 'Core',
        come: 'Supino, solleva spalle e gambe da terra, schiena aderente al pavimento.',
        tecnica: 'Schiena sempre a contatto con il pavimento',
        note: '',
        image: 'https://www.calistenia.net/wp-content/uploads/2017/03/Hollow-Body-Hold.gif'
    },
    reversecrunch: {
        name: 'Reverse Crunch',
        series: '3×15',
        recupero: '1\'',
        focus: 'Addominali bassi',
        come: 'Supino, porta le ginocchia al petto sollevando il bacino.',
        tecnica: 'Movimento controllato, non usare lo slancio',
        note: '',
        image: 'https://articoli.nonsolofitness.it/resources/originals/0d04b469007373803f32db2b92dc7a66.jpg'
    },
    planklaterale: {
        name: 'Plank Laterale',
        series: '2×30" per lato',
        recupero: '1\'',
        focus: 'Core, obliqui',
        come: 'Sul fianco, corpo in linea dall\'avambraccio ai piedi.',
        tecnica: 'Mantieni il corpo dritto, non far cedere i fianchi',
        note: '',
        image: 'https://i.ytimg.com/vi/SzKsA7HdzKc/maxresdefault.jpg'
    },

    // Allenamento C
    ellittica: {
        name: 'Ellittica',
        focus: 'Cardio total body',
        come: 'Cardio a basso impatto su macchina ellittica.',
        tecnica: 'Movimento fluido, intensità moderata',
        note: 'Se disponibile',
        image: '/assets/images/exercises/ellittica.jpg'
    },
    alzatecavo: {
        name: 'Alzate Laterali Cavo Mono',
        series: '3×15',
        carico: 'Cavo',
        recupero: '1\'',
        focus: 'Deltoidi laterali',
        come: 'Al cavo basso, un braccio alla volta, solleva lateralmente.',
        tecnica: 'Movimento controllato',
        note: '',
        image: 'https://www.muscoli.info/Media/MuscoliInfo/Immagini/Esercizi/alzate-laterali-ai-cavi.jpg'
    },
    aperture90: {
        name: 'Aperture 90° Deltoidi Posteriori',
        series: '3×15',
        carico: 'Manubri',
        recupero: '1\'',
        focus: 'Deltoidi posteriori',
        come: 'Busto inclinato a 90°, apri le braccia lateralmente con manubri.',
        tecnica: 'Focus sulla contrazione dei deltoidi posteriori',
        note: '',
        image: 'https://www.my-personaltrainer.it/2023/01/12/croci-inverse_crop_resize.jpeg'
    },
    burpees: {
        name: 'Burpees',
        series: '3×30"',
        carico: 'Corpo libero',
        recupero: '30"',
        focus: 'Cardio total body, esplosività',
        come: 'Dalla posizione eretta: scendi in squat, appoggia le mani a terra, salta indietro in plank, esegui un push-up (opzionale), riporta i piedi vicino alle mani e salta in alto con le braccia sopra la testa.',
        tecnica: 'Movimento fluido e continuo, esplosione nel salto finale, atterraggio controllato',
        note: 'Mantieni il ritmo costante, adatta l\'intensità al tuo livello',
        image: 'https://www.pietropaganini.it/web/wp-content/uploads/2017/07/burpee-1.jpg'
    },
    russiantwist: {
        name: 'Russian Twist',
        series: '4×20 totali',
        carico: 'Opzionale disco/manubrio',
        recupero: '30"',
        focus: 'Addominali obliqui',
        come: 'Seduto, busto inclinato indietro, ruota il busto lateralmente.',
        tecnica: 'Movimento controllato, espira in torsione',
        note: '',
        image: 'https://cdn.prod.website-files.com/6214dbeb0bc91b35790477f3/6682d4e842714376c5cde25b_0e861ef1-8313-494d-88d5-512daf305285.webp'
    },
    hollowrock: {
        name: 'Hollow Rock',
        series: '4× tempo massimo',
        carico: '-',
        recupero: '30"',
        focus: 'Core',
        come: 'Posizione hollow hold, dondola avanti e indietro.',
        tecnica: 'Mantieni la forma hollow, movimento piccolo',
        note: '',
        image: 'https://i.ytimg.com/vi/jOjWxZsiJFE/maxresdefault.jpg'
    },

    // Allenamento 1A - Variant Push Exercises
    chestpressbilanciere: {
        name: 'Panca Piana bilanciere',
        series: '4×8',
        carico: 'Progressivo',
        recupero: '2\'',
        focus: 'Pettorali, tricipiti, spalle anteriori',
        come: 'Sdraiato su panca, bilanciere impugnato. Abbassa verso il petto e spingi verso l\'alto.',
        tecnica: 'Controllo eccentrico, fermo 1" al petto, spinta esplosiva. Bilanciere più stabile dei manubri',
        note: 'Controllo massima qualità, focus forza',
        image: '/assets/images/exercises/chestpressbilanciere.gif'
    },
    dipsparallele: {
        name: 'Dips Parallele Zavorrate',
        series: '3×8-10',
        carico: 'Peso corporeo/zavorra progressiva',
        recupero: '2\'',
        focus: 'Tricipiti, pettorali inferiori',
        come: 'Alle parallele, corpo sospeso. Scendi profondo flettendo gomiti, risali estendendo.',
        tecnica: 'Discesa 3 sec, risalita esplosiva ma controllata. Non forzare se dà fastidio alla spalla',
        note: 'Controllo profondo, massimo range. Se fastidio spalle, usa panca assistita',
        image: 'https://pplx-res.cloudinary.com/image/upload/v1754821138/pplx_project_search_images/1b0e172de8b4e010e6291376b41998d0679164b2.png'
    },
    arnoldpress: {
        name: 'Arnold Press',
        series: '3×10',
        carico: 'Manubri progressivi',
        recupero: '1\'30"',
        focus: 'Spalle (tutti i fasci), tricipiti',
        come: 'Seduto o in piedi, manubri altezza spalle palmi verso corpo. Ruota i polsi mentre spingi verso l\'alto.',
        tecnica: 'Inizia con palmi verso il corpo, finisci con palmi in avanti. Rotazione fluida, pausa 1" in alto',
        note: 'Rotazione completa, stimolo deltoide anteriore/mediale. Core attivo',
        image: '/assets/images/exercises/arnoldpress.gif'
    },
    alzatefrontalibilanciere: {
        name: 'Alzate Frontali Bilanciere',
        series: '3×12',
        carico: 'Bilanciere EZ o dritto leggero',
        recupero: '1\'',
        focus: 'Deltoidi anteriori',
        come: 'In piedi, bilanciere davanti alle cosce. Solleva davanti fino altezza spalle.',
        tecnica: 'Non superare altezza spalle, evitare oscillazioni del busto. 2 sec su, 1 sec pausa, 2 sec giù',
        note: 'Lento e controllato, senza slancio. Focus isolamento deltoidi anteriori',
        image: '/assets/images/exercises/alzatefrontalibilanciere.gif'
    },
    skullcrushers: {
        name: 'Skullcrushers EZ',
        series: '3×12',
        carico: 'Bilanciere EZ',
        recupero: '2\'',
        focus: 'Tricipiti (capo lungo e laterale)',
        come: 'Sdraiato su panca, bilanciere sopra il petto. Fletti solo avambracci verso fronte, estendi.',
        tecnica: 'Gomiti fissi, movimento solo dell\'avambraccio. Non muovere le spalle, isolamento puro tricipiti',
        note: 'Estensione completa, gomiti fissi. Controllo eccentrico fondamentale',
        image: '/assets/images/exercises/skullcrushers.gif'
    },
    pushupdiamond: {
        name: 'Push-Up Diamond',
        series: '3×max (8-15)',
        carico: 'Corpo libero',
        recupero: '1\'30"',
        focus: 'Tricipiti, pettorali interni',
        come: 'Posizione plank, mani a diamante sotto il petto. Scendi al petto, spingi su.',
        tecnica: 'Se troppo difficile, appoggia le ginocchia o fai su panca inclinata. 2 sec giù, 1 sec pausa, 2 sec su',
        note: 'Contrazione massima tricipiti, movimento lento e controllato',
        image: '/assets/images/exercises/pushupdiamond.gif'
    },

    // Allenamento 2A - Variant Pull Exercises
    trazionisupina: {
        name: 'Trazioni Presa Supina',
        series: '4×6-10',
        carico: 'Corpo libero/zavorra progressiva',
        recupero: '2\'',
        focus: 'Schiena (gran dorsale), bicipiti',
        come: 'Appeso alla sbarra con presa supina (palmi verso di te), larghezza spalle. Tira su fino mento sopra sbarra.',
        tecnica: '2 sec su, 1 sec pausa, 3 sec giù. Focus controllo e scapole, full ROM',
        note: 'Se necessario usa elastico assistenza. Alternativa: lat machine presa supina 4×8-10',
        image: '/assets/images/exercises/trazionisupina.gif'
    },
    rematorebilanciere: {
        name: 'Rematore Bilanciere',
        series: '3×10',
        carico: 'Bilanciere progressivo',
        recupero: '2\'',
        focus: 'Dorso (romboidi, trapezio medio), bicipiti',
        come: 'In piedi, busto inclinato 45°, bilanciere in mano con presa pronata larghezza spalle. Tira verso ombelico, spremi scapole.',
        tecnica: 'Non usare slancio, movimento inizia dalle scapole. Scapole indietro, pausa 1", controllo eccentrico',
        note: 'Presa pronata, controllo scapole. Busto a 45°, core attivo',
        image: '/assets/images/exercises/rematorebilanciere.gif'
    },
    curlbilanciere: {
        name: 'Curl Bilanciere EZ',
        series: '3×10',
        carico: 'Bilanciere EZ progressivo',
        recupero: '1\'40"',
        focus: 'Bicipiti (entrambi i capi)',
        come: 'In piedi, bilanciere EZ davanti con presa supina. Fletti avambracci verso spalle.',
        tecnica: 'Gomiti fermi, movimento solo dell\'avambraccio. 2 sec su, 1 sec contrazione, 3 sec giù',
        note: 'Fermo 1s in contrazione, senza slancio. Gomiti fissi ai fianchi',
        image: 'https://pplx-res.cloudinary.com/image/upload/v1760550964/pplx_project_search_images/314ef31222566c563dc4e11c4025b2fc3dfd4063.png'
    },
    curlpancainclinata: {
        name: 'Curl Manubri Panca Inclinata',
        series: '2×10',
        carico: 'Manubri moderati',
        recupero: '1\'40"',
        focus: 'Bicipiti (enfasi capo lungo)',
        come: 'Seduto su panca inclinata 30-45°, manubri in mano. Curl con braccia lungo i fianchi.',
        tecnica: 'Lascia che il peso tiri il braccio in basso per massimo stretch. Stretch completo in basso, contrazione in alto',
        note: 'Panca a 30-45°, enfasi stretch bicipiti. Alternato o simultaneo',
        image: 'https://pplx-res.cloudinary.com/image/upload/v1760550982/pplx_project_search_images/735a18712d4c9df10bcb2f45aa7183b2c7605061.png'
    },
    reversecurlbilanciere: {
        name: 'Reverse Curl Bilanciere',
        series: '2×12',
        carico: 'Bilanciere più leggero del curl normale',
        recupero: '1\'30"',
        focus: 'Avambracci, brachioradiale',
        come: 'Come curl normale ma con presa prona (palmi verso basso).',
        tecnica: 'Carico più leggero del curl normale, focus sulla presa. Movimento lento, focus avambracci',
        note: 'Enfasi avambracci, presa prona. Movimento controllato',
        image: 'https://pplx-res.cloudinary.com/image/upload/v1755875771/pplx_project_search_images/1ffed2311ad55745f99ebe9df6b9ebf994d308b2.png'
    },
    zottmancurl: {
        name: 'Zottman Curl',
        series: '2×10',
        carico: 'Manubri leggeri-moderati',
        recupero: '1\'30"',
        focus: 'Bicipiti, avambracci',
        come: 'Sali con presa supina (normale curl). In alto ruota in presa prona. Scendi lento con presa prona.',
        tecnica: 'Movimento combinato: bicipiti in salita, avambracci in discesa',
        note: 'Rotazione polso in negativo. Su con supina, giù con prona',
        image: '/assets/images/exercises/zottmancurl.gif'
    },

    // Nuovi esercizi - Ottimizzazione Spalla Safe + Ipertrofia
    landminepress: {
        name: 'Landmine Press',
        series: '3×12',
        carico: 'Bilanciere progressivo',
        recupero: '60"',
        focus: 'Deltoidi anteriori, parte alta petto',
        come: 'Bilanciere fissato a terra con landmine o angolo. Spingi verso l\'alto con traiettoria diagonale naturale.',
        tecnica: 'Angolo naturale di spinta riduce stress sulla spalla. Controllo eccentrico, spinta esplosiva.',
        note: 'SICURO per spalla - alternativa Alzate Frontali Bilanciere',
        image: 'https://www.inspireusafoundation.org/wp-content/uploads/2022/03/landmine-press.gif'
    },
    shoulderpressinclinata: {
        name: 'Shoulder Press Manubri Inclinata 70°',
        series: '3×10',
        carico: 'Manubri progressivi',
        recupero: '90"',
        focus: 'Deltoidi (tutti i fasci), tricipiti',
        come: 'Su panca inclinata 70°, manubri altezza spalle con presa neutra. Spingi verso alto senza massima estensione.',
        tecnica: 'Presa neutra (palmi fronte a fronte) più sicura. ROM limitato a 170° flessione. Core attivo.',
        note: 'SICURO per lesione spalla - sostituisce Arnold Press. Inclinazione riduce stress overhead',
        image: 'https://homeworkouts.org/wp-content/uploads/anim-incline-shoulder-press.gif'
    },
    crocicavibassi: {
        name: 'Croci ai Cavi Bassi',
        series: '3×15',
        carico: 'Cavi',
        recupero: '90"',
        focus: 'Pettorali alti, definizione',
        come: 'Cavi bassi, impugnature in mano. Movimento dal basso verso alto (come abbracciare), mani si incontrano al centro.',
        tecnica: 'Gomiti leggermente flessi 15-20°. Scapole addotte. Tensione costante, pausa 1" in contrazione.',
        note: 'SICURO per spalla - sostituisce Croci Panca Inclinata. Controllo ROM, no iperestensione',
        image: 'https://newlife.com.cy/wp-content/uploads/2019/11/standing-low-cable-crossover_chest.gif'
    },
    curlconcentrato: {
        name: 'Curl Concentrato',
        series: '3×12-15',
        carico: 'Manubrio moderato',
        recupero: '60"',
        focus: 'Bicipiti (isolamento massimo)',
        come: 'Seduto, braccio appoggiato interno coscia. Curl con un manubrio alla volta, focus contrazione picco.',
        tecnica: 'Braccio fermo contro coscia impedisce compensi. Supinazione completa, pausa 2" in contrazione.',
        note: 'MIGLIOR esercizio bicipiti per attivazione EMG (97% - Studio ACE). Connessione mente-muscolo ottimale',
        image: 'https://homeworkouts.org/wp-content/uploads/anim-dumbbell-concentration-curl.gif'
    },
    curlmanubri: {
        name: 'Curl Manubri Alternati',
        series: '2×12',
        carico: 'Manubri moderati',
        recupero: '60"',
        focus: 'Bicipiti',
        come: 'In piedi o seduto, curl alternato con manubri. Supinazione durante salita.',
        tecnica: 'Gomiti fissi, movimento controllato. 2 sec su, 1 sec pausa, 2 sec giù.',
        note: 'Esecuzione lenta e controllata. Focus qualità movimento.',
        image: 'https://thumbs.gfycat.com/AgonizingAmusingArmadillo-max-1mb.gif'
    },
    crunchcavi: {
        name: 'Crunch ai Cavi Alti con Peso',
        series: '4×10-12',
        carico: 'Cavo progressivo',
        recupero: '90"',
        focus: 'Addominali (retto addominale), ipertrofia',
        come: 'Cavo alto, corda dietro testa/collo. Inginocchiato, fletti busto verso basso contraendo addominali.',
        tecnica: 'Movimento dalla contrazione addominale, non dalle braccia. Espirazione forzata in contrazione.',
        note: 'SOVRACCARICO progressivo per ipertrofia addominali. Range 8-12 reps ottimale.',
        image: 'https://www.inspireusafoundation.org/wp-content/uploads/2022/02/cable-crunch.gif'
    },
    abwheel: {
        name: 'Ab Wheel / Roll Out Bilanciere',
        series: '4×8-10',
        carico: 'Corpo libero o bilanciere',
        recupero: '90"',
        focus: 'Core completo, addominali, stabilità',
        come: 'Dalle ginocchia, rotola avanti estendendo corpo, mantieni core attivo. Torna indietro controllato.',
        tecnica: 'Core sempre in tensione, non lasciare cedere schiena. Se troppo difficile: ROM parziale.',
        note: 'Esercizio avanzato. MASSIMO stimolo core. Ipertrofia addominali + forza funzionale.',
        image: 'https://homeworkouts.org/wp-content/uploads/anim-ab-wheel-rollout.gif'
    },
    legraise: {
        name: 'Leg Raise Appeso',
        series: '4×10-12',
        carico: 'Corpo libero',
        recupero: '60"',
        focus: 'Addominali bassi, ileopsoas',
        come: 'Appeso a sbarra, gambe tese o leggermente flesse. Solleva gambe fino parallelo o 90°.',
        tecnica: 'Movimento controllato, no slancio. Retroversione bacino, espira in salita.',
        note: 'Focus addominali bassi. Se troppo difficile: ginocchia piegate (knee raises).',
        image: 'https://homeworkouts.org/wp-content/uploads/anim-hanging-leg-raise.gif'
    },
    crunchdeclinata: {
        name: 'Crunch Panca Declinata con Peso',
        series: '4×12-15',
        carico: 'Disco o manubrio',
        recupero: '90"',
        focus: 'Addominali (retto), ipertrofia',
        come: 'Su panca declinata, piedi bloccati. Tieni peso al petto, crunch controllato.',
        tecnica: 'Non tirare collo. Movimento da contrazione addominale. Pausa 1" in contrazione.',
        note: 'SOVRACCARICO progressivo per ipertrofia. Ottimo per volume addominali.',
        image: 'https://www.inspireusafoundation.org/wp-content/uploads/2022/02/weighted-decline-sit-up.gif'
    },
    mountainclimbers: {
        name: 'Mountain Climbers',
        series: '3×20',
        carico: 'Corpo libero',
        recupero: '45"',
        focus: 'Core dinamico, cardio, addominali',
        come: 'Posizione plank, porta ginocchia alternate verso petto in modo dinamico.',
        tecnica: 'Core sempre attivo, ritmo sostenuto ma controllato. Respirazione regolare.',
        note: 'Esercizio dinamico. Combina core + cardio. 20 reps = 10 per lato.',
        image: 'https://homeworkouts.org/wp-content/uploads/anim-mountain-climbers.gif'
    },
    cablecrossover: {
        name: 'Cable Crossover Posizione Media',
        series: '3×15',
        carico: 'Cavi',
        recupero: '60"',
        focus: 'Pettorali (definizione), parte centrale',
        come: 'Cavi altezza spalle, impugnature in mano. Movimento verso centro come abbracciare.',
        tecnica: 'Gomiti leggermente flessi. Tensione costante. Pausa 1" in contrazione centrale.',
        note: 'Ottimo per definizione petto. Alternativa sicura per spalla. Focus contrazione.',
        image: 'https://homeworkouts.org/wp-content/uploads/anim-mid-cable-crossover.gif'
    },
    pushuppresastretta: {
        name: 'Push-Up Presa Stretta',
        series: '3×12-15',
        carico: 'Corpo libero',
        recupero: '60"',
        focus: 'Pettorali interni, tricipiti',
        come: 'Push-up con mani più strette della larghezza spalle. Gomiti vicini al corpo.',
        tecnica: 'Discesa controllata 2-3 sec, spinta esplosiva. Core attivo, corpo in linea.',
        note: 'Presa stretta enfatizza tricipiti + petto interno. Se difficile: su ginocchia.',
        image: 'https://homeworkouts.org/wp-content/uploads/anim-diamond-push-up.gif'
    }
};

// Helper function per ottenere i dettagli di un esercizio
export function getExerciseDetail(exerciseId) {
    return exerciseData[exerciseId] || null;
}

// Helper function per filtrare esercizi per categoria
export function filterExercisesByCategory(category) {
    const categories = {
        fisio: Object.keys(exerciseData).filter(key => exerciseData[key].fisio),
        riscaldamento: ['bike', 'circonduzione', 'mobilita'],
        push: ['pancapiana', 'croci', 'militarypress', 'alzatelaterali', 'pushdown', 'dips'],
        pull: ['latmachine', 'pulley', 'curlpanca', 'hammercurl', 'curlpolsi', 'reversecurl', 'farmerswalk'],
        core: ['vup', 'crunch', 'biciclette', 'plank', 'hollowhold', 'reversecrunch', 'planklaterale', 'russiantwist', 'hollowrock']
    };

    return categories[category] || [];
}
