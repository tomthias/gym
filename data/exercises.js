// Database esercizi completo estratto dalla scheda
export const exerciseData = {
    // Riscaldamento
    bike: {
        name: 'Bike/Tapirulan',
        focus: 'Cardio a basso impatto, riscaldamento',
        come: 'Pedalare sulla cyclette a intensità moderata mantenendo una frequenza cardiaca costante.',
        tecnica: 'Respirazione regolare, postura corretta sulla sella',
        note: 'Riscaldamento',
        duration: '12\''
    },
    circonduzione: {
        name: 'Circonduzione Braccia',
        focus: 'Mobilità spalle',
        come: 'In piedi, ruotare le braccia descrivendo ampi cerchi, prima in avanti poi indietro.',
        tecnica: 'Movimenti ampi e controllati, non forzare',
        note: ''
    },
    mobilita: {
        name: 'Mobilità Spalle e Polsi',
        focus: 'Preparazione articolazioni',
        come: 'Eseguire rotazioni delle spalle e dei polsi in tutte le direzioni.',
        tecnica: 'Movimenti lenti e controllati',
        note: ''
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
        note: 'Se disponibile'
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
