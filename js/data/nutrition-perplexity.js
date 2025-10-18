// Piano Nutrizionale Completo - Analisi Perplexity 2024-2025
// Basato su piano_nutrizionale_completo.json
// Evidence-based per ipertrofia bicipiti + definizione
// NO banana, NO affettati, NO carciofi, legumi solo hummus

export const perplexityNutritionPlan = {
    cliente_info: {
        eta: 34,
        peso_kg: 75,
        altezza_cm: 173,
        obiettivi: [
            "Ipertrofia bicipiti (priorità massima)",
            "Ipertrofia addominali/core",
            "Riduzione grasso pettorale (pseudoginecomastia)",
            "Salute spalla (lesione tendinea + clavicola)"
        ],
        restrizioni: [
            "NO banane",
            "NO affettati",
            "NO carciofi",
            "NO legumi interi (OK hummus)"
        ]
    },

    fasi: {
        cutting: {
            durata_settimane: "12-14",
            target_calorico: 2300,
            macros: {
                proteine_g: 165,
                carboidrati_g: 255,
                grassi_g: 75
            }
        },
        lean_bulk: {
            durata_settimane: "8-10",
            target_calorico: 3250,
            macros: {
                proteine_g: 150,
                carboidrati_g: 395,
                grassi_g: 75
            }
        }
    },

    // COLAZIONI - 35P / 55C / 15F ≈ 500 kcal
    colazioni: {
        description: "35P / 55C / 15F ≈ 500 kcal",
        recipes: [
            {
                id: "col-001",
                name: "Porridge Proteico con Mirtilli e Whey",
                difficulty: "facile",
                time: 8,
                category: "dolce",
                categoria_giorno: ["workout_intenso", "riposo"],
                tags: ["proteico", "energia-duratura", "pre-workout"],
                ingredients: [
                    "60g fiocchi d'avena",
                    "200ml latte parzialmente scremato",
                    "30g proteine whey (vaniglia o neutro)",
                    "80g mirtilli freschi",
                    "5g burro di arachidi",
                    "1 cucchiaino miele (opzionale)"
                ],
                steps: [
                    "Scalda il latte in un pentolino a fuoco medio",
                    "Aggiungi l'avena e cuoci mescolando per 5-6 minuti",
                    "Trasferisci in una bowl e lascia intiepidire 2 minuti",
                    "Aggiungi le proteine whey e mescola bene",
                    "Guarnisci con mirtilli e burro di arachidi"
                ],
                macros: {
                    protein: "35g",
                    carbs: "58g",
                    fats: "14g",
                    calories: "505 kcal"
                },
                tips: "Puoi preparare overnight oats: avena + latte in frigo la sera prima, aggiungi whey al mattino"
            },
            {
                id: "col-002",
                name: "Yogurt Greco Bowl con Granola e Frutti Rossi",
                difficulty: "facilissimo",
                time: 3,
                category: "dolce",
                categoria_giorno: ["workout_leggero", "riposo"],
                tags: ["velocissimo", "proteico", "antiossidante"],
                ingredients: [
                    "200g yogurt greco 0% grassi",
                    "50g granola integrale",
                    "80g frutti di bosco misti (no fragole se stagione)",
                    "30g proteine whey",
                    "10g mandorle a lamelle",
                    "1 cucchiaino miele"
                ],
                steps: [
                    "Versa lo yogurt greco in una bowl capiente",
                    "Aggiungi le proteine whey e mescola fino a completa integrazione",
                    "Aggiungi granola e frutti di bosco",
                    "Guarnisci con mandorle e miele"
                ],
                macros: {
                    protein: "38g",
                    carbs: "52g",
                    fats: "12g",
                    calories: "485 kcal"
                },
                tips: "Sostituisci frutti di bosco con mela o pera a cubetti se non disponibili"
            },
            {
                id: "col-003",
                name: "Toast Integrale con Uova Strapazzate e Avocado",
                difficulty: "facile",
                time: 10,
                category: "salato",
                categoria_giorno: ["workout_intenso"],
                tags: ["salato", "proteico", "grassi-sani"],
                ingredients: [
                    "2 fette pane integrale (70g)",
                    "2 uova intere + 80g albume",
                    "1/2 avocado medio (60g)",
                    "5g olio EVO",
                    "Sale, pepe, curcuma q.b.",
                    "Pomodorini 50g (opzionale)"
                ],
                steps: [
                    "Tosta il pane integrale",
                    "In una padella antiaderente, scalda l'olio",
                    "Sbatti uova e albume con sale, pepe e curcuma",
                    "Cuoci le uova mescolando delicatamente per 3-4 minuti",
                    "Schiaccia l'avocado sul pane tostato",
                    "Completa con le uova strapazzate e pomodorini"
                ],
                macros: {
                    protein: "32g",
                    carbs: "48g",
                    fats: "18g",
                    calories: "490 kcal"
                },
                tips: "Aggiungi spinaci freschi alle uova per aumentare micronutrienti"
            },
            {
                id: "col-004",
                name: "Pancakes Proteici con Composta di Mele",
                difficulty: "media",
                time: 15,
                category: "dolce",
                categoria_giorno: ["workout_intenso"],
                tags: ["dolce", "proteico", "pre-workout"],
                ingredients: [
                    "40g farina d'avena",
                    "30g proteine whey",
                    "2 uova intere",
                    "100ml latte",
                    "1 mela media tagliata a cubetti",
                    "Cannella q.b.",
                    "5g burro o olio cocco per cottura"
                ],
                steps: [
                    "Frulla avena, whey, uova e latte fino a ottenere un composto liscio",
                    "Cuoci la mela in padella con cannella per 5 min",
                    "In padella antiaderente, versa porzioni di impasto",
                    "Cuoci 2-3 min per lato fino a doratura",
                    "Servi con composta di mele sopra"
                ],
                macros: {
                    protein: "36g",
                    carbs: "54g",
                    fats: "15g",
                    calories: "510 kcal"
                },
                tips: "Prepara l'impasto la sera prima per risparmiare tempo al mattino"
            },
            {
                id: "col-005",
                name: "Skyr Bowl con Riso Soffiato e Burro Mandorle",
                difficulty: "facilissimo",
                time: 3,
                category: "dolce",
                categoria_giorno: ["workout_leggero", "riposo"],
                tags: ["velocissimo", "proteico", "croccante"],
                ingredients: [
                    "200g skyr naturale",
                    "30g riso soffiato",
                    "15g burro di mandorle",
                    "10g miele",
                    "10g semi di chia",
                    "80g mirtilli o lamponi"
                ],
                steps: [
                    "Versa lo skyr in una bowl",
                    "Aggiungi riso soffiato e frutti di bosco",
                    "Distribuisci burro di mandorle a cucchiaiate",
                    "Cospargi con semi di chia",
                    "Completa con filo di miele"
                ],
                macros: {
                    protein: "33g",
                    carbs: "55g",
                    fats: "13g",
                    calories: "485 kcal"
                },
                tips: "Lo skyr ha più proteine dello yogurt greco e texture più densa"
            },
            {
                id: "col-006",
                name: "Omelette Proteica con Spinaci e Feta",
                difficulty: "facile",
                time: 10,
                category: "salato",
                categoria_giorno: ["workout_intenso"],
                tags: ["salato", "proteico", "basso-carb"],
                ingredients: [
                    "3 uova intere + 100g albume",
                    "50g feta a cubetti",
                    "100g spinaci freschi",
                    "60g pane integrale",
                    "5g olio EVO",
                    "Aglio, sale, pepe q.b."
                ],
                steps: [
                    "Sbatti uova e albume con sale e pepe",
                    "In padella, rosola spinaci con aglio per 2 min",
                    "Versa il composto di uova, cuoci 3-4 min",
                    "Aggiungi feta, piega a metà l'omelette",
                    "Servi con pane integrale tostato"
                ],
                macros: {
                    protein: "38g",
                    carbs: "42g",
                    fats: "18g",
                    calories: "500 kcal"
                },
                tips: "Sostituisci feta con mozzarella light per ridurre sale"
            }
        ]
    },

    // SPUNTINI MATTINA - 25P / 30C / 10F ≈ 300 kcal
    spuntini_mattina: {
        description: "25P / 30C / 10F ≈ 300 kcal",
        recipes: [
            {
                id: "spm-001",
                name: "Gallette di Riso con Tonno e Hummus",
                difficulty: "facilissimo",
                time: 3,
                category: "salato",
                categoria_giorno: ["tutti"],
                tags: ["velocissimo", "proteico", "pratico"],
                ingredients: [
                    "3 gallette di riso integrale",
                    "60g tonno al naturale sgocciolato",
                    "30g hummus di ceci",
                    "Carote julienne 50g",
                    "Limone e prezzemolo q.b."
                ],
                steps: [
                    "Spalma hummus sulle gallette",
                    "Disponi il tonno sgocciolato sopra",
                    "Aggiungi carote julienne",
                    "Spremi limone e aggiungi prezzemolo"
                ],
                macros: {
                    protein: "24g",
                    carbs: "32g",
                    fats: "8g",
                    calories: "295 kcal"
                },
                tips: "Prepara porzioni di tonno+hummus in contenitori per tutta la settimana"
            },
            {
                id: "spm-002",
                name: "Shake Proteico con Frutta Secca",
                difficulty: "facilissimo",
                time: 2,
                category: "liquido",
                categoria_giorno: ["tutti"],
                tags: ["velocissimo", "liquido", "post-cardio"],
                ingredients: [
                    "30g proteine whey",
                    "250ml latte parzialmente scremato",
                    "15g mandorle",
                    "5g miele",
                    "Cannella q.b."
                ],
                steps: [
                    "Versa latte e proteine nello shaker",
                    "Aggiungi miele e cannella",
                    "Shaka vigorosamente per 20 secondi",
                    "Servi con mandorle a parte da masticare"
                ],
                macros: {
                    protein: "28g",
                    carbs: "26g",
                    fats: "12g",
                    calories: "330 kcal"
                },
                tips: "Usa latte freddo per shake più fresco e schiumoso"
            },
            {
                id: "spm-003",
                name: "Pane Integrale con Salmone Affumicato e Philadelphia Light",
                difficulty: "facilissimo",
                time: 5,
                category: "salato",
                categoria_giorno: ["tutti"],
                tags: ["veloce", "omega-3", "salato"],
                ingredients: [
                    "50g pane integrale",
                    "30g Philadelphia light",
                    "50g salmone affumicato",
                    "Cetriolo a fettine",
                    "Aneto fresco",
                    "Limone"
                ],
                steps: [
                    "Spalma Philadelphia sul pane",
                    "Disponi salmone affumicato",
                    "Aggiungi cetriolo a fettine",
                    "Guarnisci con aneto e succo di limone"
                ],
                macros: {
                    protein: "22g",
                    carbs: "28g",
                    fats: "10g",
                    calories: "290 kcal"
                },
                tips: "Ottima fonte di omega-3 per recupero tendini"
            },
            {
                id: "spm-004",
                name: "Yogurt Greco con Noci e Mirtilli",
                difficulty: "facilissimo",
                time: 2,
                category: "dolce",
                categoria_giorno: ["tutti"],
                tags: ["velocissimo", "antiossidante", "proteico"],
                ingredients: [
                    "150g yogurt greco 0%",
                    "15g noci tritate",
                    "80g mirtilli",
                    "5g miele",
                    "Cannella q.b."
                ],
                steps: [
                    "Versa yogurt in una bowl",
                    "Aggiungi mirtilli e noci",
                    "Cospargi con cannella",
                    "Completa con miele"
                ],
                macros: {
                    protein: "20g",
                    carbs: "30g",
                    fats: "10g",
                    calories: "290 kcal"
                },
                tips: "Mirtilli: alto contenuto antiossidanti per recupero muscolare"
            },
            {
                id: "spm-005",
                name: "Barretta Proteica Fatta in Casa",
                difficulty: "media",
                time: 30,
                category: "meal-prep",
                categoria_giorno: ["tutti"],
                tags: ["meal-prep", "portatile", "energetica"],
                ingredients: [
                    "50g proteine whey",
                    "80g fiocchi d'avena",
                    "30g burro di mandorle",
                    "20g miele",
                    "30g gocce cioccolato fondente",
                    "50ml latte"
                ],
                steps: [
                    "Mescola tutti gli ingredienti in una bowl",
                    "Versa in una teglia 20x20 foderata",
                    "Pressa bene con le mani",
                    "Refrigera 2 ore",
                    "Taglia in 6 barrette"
                ],
                macros: {
                    protein: "22g (per barretta)",
                    carbs: "28g",
                    fats: "9g",
                    calories: "280 kcal"
                },
                tips: "Prepara 6 barrette domenica per tutta la settimana"
            }
        ]
    },

    // PRANZI - 40P / 70C / 20F ≈ 650 kcal
    pranzi: {
        description: "40P / 70C / 20F ≈ 650 kcal",
        recipes: [
            {
                id: "prz-001",
                name: "Riso Basmati con Pollo al Curry e Verdure",
                difficulty: "facile",
                time: 25,
                category: "completo",
                categoria_giorno: ["workout_intenso"],
                tags: ["completo", "energia", "speziato"],
                ingredients: [
                    "80g riso basmati (peso crudo)",
                    "150g petto di pollo",
                    "200g mix verdure (zucchine, peperoni, broccoli)",
                    "10g olio EVO",
                    "Curry in polvere, curcuma",
                    "Latte di cocco 30ml",
                    "Aglio, sale, pepe"
                ],
                steps: [
                    "Cuoci il riso basmati seguendo istruzioni (12-15 min)",
                    "Taglia il pollo a cubetti e marinalo con curry e curcuma",
                    "In padella con olio, cuoci pollo 5-6 min per lato",
                    "Aggiungi verdure tagliate e saltale 5 min",
                    "Aggiungi latte di cocco, mescola bene",
                    "Servi pollo e verdure su letto di riso"
                ],
                macros: {
                    protein: "42g",
                    carbs: "72g",
                    fats: "18g",
                    calories: "640 kcal"
                },
                tips: "Prepara pollo per 2-3 giorni e conserva in frigo"
            },
            {
                id: "prz-002",
                name: "Pasta Integrale con Tonno, Pomodorini e Olive",
                difficulty: "facile",
                time: 15,
                category: "mediterraneo",
                categoria_giorno: ["workout_intenso", "scialpinismo"],
                tags: ["veloce", "mediterraneo", "omega-3"],
                ingredients: [
                    "100g pasta integrale (penne o fusilli)",
                    "120g tonno al naturale",
                    "150g pomodorini ciliegino",
                    "30g olive nere",
                    "10g olio EVO",
                    "Aglio, basilico, peperoncino",
                    "30g parmigiano grattugiato"
                ],
                steps: [
                    "Cuoci la pasta in acqua salata",
                    "In padella, rosola aglio e peperoncino con olio",
                    "Aggiungi pomodorini tagliati a metà, cuoci 5 min",
                    "Aggiungi tonno sgocciolato e olive",
                    "Scola pasta al dente, mescola con sugo",
                    "Completa con parmigiano e basilico"
                ],
                macros: {
                    protein: "38g",
                    carbs: "75g",
                    fats: "20g",
                    calories: "655 kcal"
                },
                tips: "Ottimo per carb-loading pre-scialpinismo"
            },
            {
                id: "prz-003",
                name: "Quinoa Bowl con Salmone alla Griglia e Avocado",
                difficulty: "media",
                time: 30,
                category: "bowl",
                categoria_giorno: ["workout_intenso", "riposo"],
                tags: ["completo", "grassi-sani", "antiinfiammatorio"],
                ingredients: [
                    "80g quinoa (peso crudo)",
                    "130g filetto di salmone",
                    "1/2 avocado (60g)",
                    "100g spinaci baby",
                    "50g edamame sgusciati",
                    "10g olio EVO",
                    "Limone, sesamo, sale, pepe"
                ],
                steps: [
                    "Cuoci quinoa in acqua 1:2 per 15 minuti",
                    "Griglia o cuoci salmone in padella 4 min per lato",
                    "In bowl: quinoa come base",
                    "Disponi salmone, avocado a fette, spinaci, edamame",
                    "Condisci con olio, limone, sesamo"
                ],
                macros: {
                    protein: "40g",
                    carbs: "68g",
                    fats: "22g",
                    calories: "650 kcal"
                },
                tips: "Salmone: omega-3 ottimo per recupero tendini e riduzione infiammazione"
            },
            {
                id: "prz-004",
                name: "Wrap Integrale con Tacchino, Hummus e Verdure Grigliate",
                difficulty: "facile",
                time: 15,
                category: "wrap",
                categoria_giorno: ["tutti"],
                tags: ["veloce", "pratico", "completo"],
                ingredients: [
                    "1 piadina integrale (80g)",
                    "120g fesa di tacchino a fette",
                    "50g hummus",
                    "Zucchine e peperoni grigliati 100g",
                    "Insalata mista 50g",
                    "10g olio EVO"
                ],
                steps: [
                    "Scalda leggermente la piadina",
                    "Spalma hummus su tutta la superficie",
                    "Disponi tacchino, verdure grigliate e insalata",
                    "Arrotola stretto e taglia a metà"
                ],
                macros: {
                    protein: "38g",
                    carbs: "70g",
                    fats: "18g",
                    calories: "630 kcal"
                },
                tips: "Prepara verdure grigliate in batch domenica"
            },
            {
                id: "prz-005",
                name: "Risotto ai Funghi con Petto di Pollo",
                difficulty: "media",
                time: 35,
                category: "comfort-food",
                categoria_giorno: ["riposo"],
                tags: ["comfort-food", "completo", "cremoso"],
                ingredients: [
                    "80g riso carnaroli",
                    "140g petto di pollo",
                    "150g funghi misti",
                    "400ml brodo vegetale",
                    "15g parmigiano",
                    "10g olio EVO",
                    "Cipolla, vino bianco, prezzemolo"
                ],
                steps: [
                    "Tosta il riso con cipolla tritata",
                    "Aggiungi vino bianco, lascia evaporare",
                    "Aggiungi brodo un mestolo alla volta mescolando",
                    "A metà cottura aggiungi funghi saltati",
                    "Griglia pollo separatamente",
                    "Manteca risotto con parmigiano",
                    "Servi con pollo affettato sopra"
                ],
                macros: {
                    protein: "40g",
                    carbs: "72g",
                    fats: "18g",
                    calories: "640 kcal"
                },
                tips: "Risotto richiede attenzione ma risultato ottimo"
            },
            {
                id: "prz-006",
                name: "Couscous Integrale con Gamberi e Verdure al Vapore",
                difficulty: "facile",
                time: 20,
                category: "leggero",
                categoria_giorno: ["workout_intenso"],
                tags: ["leggero", "proteico", "veloce"],
                ingredients: [
                    "80g couscous integrale",
                    "150g gamberi sgusciati",
                    "200g verdure miste (carote, broccoli, cavolfiore)",
                    "10g olio EVO",
                    "Limone, aglio, prezzemolo",
                    "Curcuma, paprika"
                ],
                steps: [
                    "Prepara couscous con acqua bollente 1:1, copri 5 min",
                    "Cuoci verdure al vapore 8 min",
                    "Salta gamberi in padella con aglio e spezie 3-4 min",
                    "Sgrana couscous con forchetta",
                    "Mescola tutto, condisci con olio e limone"
                ],
                macros: {
                    protein: "38g",
                    carbs: "68g",
                    fats: "16g",
                    calories: "610 kcal"
                },
                tips: "Gamberi: proteine magre ad alto valore biologico"
            }
        ]
    },

    // SPUNTINI PRE-WORKOUT - 25P / 50C / 10F ≈ 400 kcal (60-90 min prima)
    spuntini_pre_workout: {
        description: "25P / 50C / 10F ≈ 400 kcal (60-90 min prima)",
        recipes: [
            {
                id: "pre-001",
                name: "Toast con Albume e Miele",
                difficulty: "facile",
                time: 8,
                category: "pre-workout",
                categoria_giorno: ["workout_intenso"],
                tags: ["veloce", "energia-rapida", "digeribile"],
                ingredients: [
                    "2 fette pane bianco (60g)",
                    "100g albume (da brick o 3 albumi)",
                    "10g miele",
                    "Cannella q.b."
                ],
                steps: [
                    "Tosta leggermente il pane",
                    "Cuoci l'albume in padella antiaderente stile frittata",
                    "Disponi albume sul pane",
                    "Aggiungi miele e cannella"
                ],
                macros: {
                    protein: "24g",
                    carbs: "52g",
                    fats: "2g",
                    calories: "320 kcal"
                },
                timing: "60-90 min pre-workout",
                tips: "Pane bianco: più digeribile del integrale pre-allenamento"
            },
            {
                id: "pre-002",
                name: "Riso Soffiato con Whey e Mela",
                difficulty: "facilissimo",
                time: 3,
                category: "pre-workout",
                categoria_giorno: ["workout_intenso"],
                tags: ["velocissimo", "basso-grassi", "energia"],
                ingredients: [
                    "30g riso soffiato",
                    "30g proteine whey",
                    "1 mela media (150g)",
                    "10g mandorle",
                    "150ml acqua o latte vegetale"
                ],
                steps: [
                    "Prepara shake con whey e liquido",
                    "Versa riso soffiato in bowl",
                    "Aggiungi shake sopra",
                    "Taglia mela a cubetti e aggiungi con mandorle"
                ],
                macros: {
                    protein: "28g",
                    carbs: "48g",
                    fats: "8g",
                    calories: "380 kcal"
                },
                timing: "60 min pre-workout",
                tips: "Evita grassi eccessivi pre-workout per digestione rapida"
            },
            {
                id: "pre-003",
                name: "Pancake Veloce con Marmellata",
                difficulty: "facile",
                time: 10,
                category: "pre-workout",
                categoria_giorno: ["workout_intenso"],
                tags: ["dolce", "carboidrati", "energetico"],
                ingredients: [
                    "1 uovo intero + 50g albume",
                    "30g farina d'avena",
                    "20g proteine whey",
                    "30g marmellata",
                    "5g olio cocco per cottura"
                ],
                steps: [
                    "Frulla tutti gli ingredienti tranne marmellata",
                    "Cuoci in padella 2-3 min per lato",
                    "Spalma marmellata sopra"
                ],
                macros: {
                    protein: "26g",
                    carbs: "46g",
                    fats: "10g",
                    calories: "390 kcal"
                },
                timing: "75-90 min pre-workout",
                tips: "Pancake: ottimo compromesso carbo/proteine"
            },
            {
                id: "pre-004",
                name: "Gallette con Miele e Burro Mandorle",
                difficulty: "facilissimo",
                time: 2,
                category: "pre-workout",
                categoria_giorno: ["tutti"],
                tags: ["velocissimo", "pratico", "energetico"],
                ingredients: [
                    "3 gallette riso",
                    "15g burro di mandorle",
                    "15g miele",
                    "20g proteine whey (shake a parte)",
                    "Cannella"
                ],
                steps: [
                    "Spalma burro di mandorle sulle gallette",
                    "Aggiungi miele sopra",
                    "Cospargi cannella",
                    "Prepara shake whey con acqua a parte"
                ],
                macros: {
                    protein: "24g",
                    carbs: "50g",
                    fats: "12g",
                    calories: "415 kcal"
                },
                timing: "45-60 min pre-workout",
                tips: "Pratico da portare in palestra"
            }
        ]
    },

    // SPUNTINI POST-WORKOUT - 35P / 65C / 5F ≈ 450 kcal (entro 2h)
    spuntini_post_workout: {
        description: "35P / 65C / 5F ≈ 450 kcal (entro 2h post-allenamento)",
        recipes: [
            {
                id: "post-001",
                name: "Shake Proteico Recovery con Mela e Riso Soffiato",
                difficulty: "facilissimo",
                time: 2,
                category: "post-workout",
                categoria_giorno: ["tutti"],
                tags: ["velocissimo", "finestra-anabolica", "recovery"],
                ingredients: [
                    "40g proteine whey",
                    "1 mela media",
                    "30g riso soffiato",
                    "5g miele",
                    "250ml acqua"
                ],
                steps: [
                    "Prepara shake con whey e acqua",
                    "Mangia mela e riso soffiato insieme allo shake",
                    "Aggiungi miele al shake per dolcezza"
                ],
                macros: {
                    protein: "36g",
                    carbs: "62g",
                    fats: "2g",
                    calories: "410 kcal"
                },
                timing: "Entro 30 min post-workout",
                tips: "Carboidrati ad alto IG per ripristino glicogeno rapido"
            },
            {
                id: "post-002",
                name: "Patate Dolci con Merluzzo",
                difficulty: "facile",
                time: 25,
                category: "post-workout",
                categoria_giorno: ["workout_intenso"],
                tags: ["completo", "recovery", "micronutrienti"],
                ingredients: [
                    "200g patate dolci",
                    "150g filetto di merluzzo",
                    "5g olio EVO",
                    "Limone, prezzemolo",
                    "Sale, pepe, paprika"
                ],
                steps: [
                    "Cuoci patate dolci al vapore o microonde 15 min",
                    "Cuoci merluzzo in padella con olio 4 min per lato",
                    "Schiaccia leggermente patate",
                    "Servi merluzzo su patate con limone"
                ],
                macros: {
                    protein: "34g",
                    carbs: "68g",
                    fats: "4g",
                    calories: "450 kcal"
                },
                timing: "Entro 60-90 min post-workout",
                tips: "Patate dolci: carboidrati complessi + betacarotene"
            },
            {
                id: "post-003",
                name: "Riso Bianco con Pollo e Salsa Teriyaki",
                difficulty: "facile",
                time: 20,
                category: "post-workout",
                categoria_giorno: ["workout_intenso"],
                tags: ["recovery", "proteico", "gustoso"],
                ingredients: [
                    "80g riso bianco (peso crudo)",
                    "140g petto di pollo",
                    "20ml salsa teriyaki",
                    "Verdure al vapore 100g",
                    "Sesamo"
                ],
                steps: [
                    "Cuoci riso bianco",
                    "Taglia pollo a strisce e cuoci in padella",
                    "Aggiungi salsa teriyaki al pollo",
                    "Cuoci verdure al vapore",
                    "Servi tutto insieme con sesamo"
                ],
                macros: {
                    protein: "38g",
                    carbs: "70g",
                    fats: "6g",
                    calories: "485 kcal"
                },
                timing: "Entro 2h post-workout",
                tips: "Riso bianco ha IG più alto = recovery glicogeno ottimale"
            },
            {
                id: "post-004",
                name: "Smoothie Proteico Recovery (NO Banana)",
                difficulty: "facilissimo",
                time: 3,
                category: "post-workout",
                categoria_giorno: ["tutti"],
                tags: ["velocissimo", "liquido", "recovery"],
                ingredients: [
                    "40g proteine whey",
                    "150g fragole (o frutti bosco)",
                    "200ml latte scremato",
                    "30g farina d'avena istantanea",
                    "10g miele"
                ],
                steps: [
                    "Frulla tutti gli ingredienti",
                    "Aggiungi ghiaccio se desideri",
                    "Frulla fino a consistenza liscia"
                ],
                macros: {
                    protein: "36g",
                    carbs: "58g",
                    fats: "4g",
                    calories: "420 kcal"
                },
                timing: "Entro 30 min post-workout",
                tips: "Alternativa liquida per chi ha poco appetito post-allenamento"
            }
        ]
    },

    // CENE - 35P / 20C / 20F ≈ 400 kcal
    cene: {
        description: "35P / 20C / 20F ≈ 400 kcal",
        recipes: [
            {
                id: "cen-001",
                name: "Salmone al Forno con Verdure Grigliate",
                difficulty: "facile",
                time: 25,
                category: "pesce",
                categoria_giorno: ["tutti"],
                tags: ["omega-3", "antiinfiammatorio", "completo"],
                ingredients: [
                    "150g filetto di salmone",
                    "200g verdure miste (zucchine, melanzane, peperoni)",
                    "50g pane integrale",
                    "10g olio EVO",
                    "Limone, rosmarino, aglio"
                ],
                steps: [
                    "Preriscalda forno a 180°C",
                    "Condisci salmone con olio, limone, rosmarino",
                    "Taglia verdure e condisci",
                    "Inforna tutto per 18-20 min",
                    "Servi con pane integrale"
                ],
                macros: {
                    protein: "36g",
                    carbs: "22g",
                    fats: "20g",
                    calories: "415 kcal"
                },
                timing: "Post-workout serale ideale",
                tips: "Salmone 2-3x/sett per omega-3 e recupero tendini"
            },
            {
                id: "cen-002",
                name: "Omelette 3 Uova con Verdure e Avocado",
                difficulty: "facile",
                time: 10,
                category: "uova",
                categoria_giorno: ["tutti"],
                tags: ["veloce", "proteico", "grassi-sani"],
                ingredients: [
                    "3 uova intere",
                    "100g spinaci + pomodorini",
                    "1/2 avocado (60g)",
                    "40g pane integrale",
                    "5g olio EVO"
                ],
                steps: [
                    "Sbatti le uova con sale e pepe",
                    "Salta spinaci in padella 2 min",
                    "Versa uova, cuoci 3-4 min",
                    "Piega a metà, servi con avocado e pane"
                ],
                macros: {
                    protein: "30g",
                    carbs: "24g",
                    fats: "22g",
                    calories: "420 kcal"
                },
                timing: "Cena veloce post-allenamento tardivo",
                tips: "Preparazione 10 min ideale se finisci alle 21:00"
            },
            {
                id: "cen-003",
                name: "Tacchino alla Piastra con Insalata e Quinoa",
                difficulty: "facile",
                time: 20,
                category: "carne-bianca",
                categoria_giorno: ["tutti"],
                tags: ["leggero", "completo", "digeribile"],
                ingredients: [
                    "150g fesa di tacchino",
                    "40g quinoa (peso crudo)",
                    "150g insalata mista",
                    "Pomodorini 50g",
                    "10g olio EVO",
                    "Limone, aceto balsamico"
                ],
                steps: [
                    "Cuoci quinoa in acqua 15 min",
                    "Griglia tacchino con spezie 4 min per lato",
                    "Prepara insalata con pomodorini",
                    "Condisci con olio e limone",
                    "Servi tacchino su letto di quinoa e insalata"
                ],
                macros: {
                    protein: "38g",
                    carbs: "26g",
                    fats: "14g",
                    calories: "390 kcal"
                },
                timing: "Cena leggera giorni riposo",
                tips: "Tacchino: proteine magre ideali per sintesi notturna"
            },
            {
                id: "cen-004",
                name: "Merluzzo al Cartoccio con Patate",
                difficulty: "media",
                time: 30,
                category: "pesce",
                categoria_giorno: ["tutti"],
                tags: ["leggero", "microonde-friendly", "omega-3"],
                ingredients: [
                    "160g filetto di merluzzo",
                    "150g patate",
                    "100g pomodorini",
                    "Olive 20g",
                    "10g olio EVO",
                    "Prezzemolo, aglio, limone"
                ],
                steps: [
                    "Taglia patate a fette sottili",
                    "Disponi su carta forno: patate, merluzzo, pomodorini, olive",
                    "Condisci con olio, aglio, prezzemolo",
                    "Chiudi cartoccio, inforna 25 min a 180°C"
                ],
                macros: {
                    protein: "34g",
                    carbs: "28g",
                    fats: "16g",
                    calories: "400 kcal"
                },
                timing: "Cena completa bilanciata",
                tips: "Cartoccio mantiene umidità e sapore"
            },
            {
                id: "cen-005",
                name: "Polpette di Manzo con Verdure al Vapore",
                difficulty: "media",
                time: 25,
                category: "carne-rossa",
                categoria_giorno: ["workout_intenso"],
                tags: ["proteico", "ferro", "comfort-food"],
                ingredients: [
                    "150g macinato di manzo magro (5% grassi)",
                    "1 uovo",
                    "20g pangrattato",
                    "200g verdure al vapore",
                    "50g riso basmati",
                    "5g olio EVO"
                ],
                steps: [
                    "Mescola manzo, uovo, pangrattato, spezie",
                    "Forma 4-5 polpette",
                    "Cuoci in padella o forno 12-15 min",
                    "Cuoci verdure al vapore e riso",
                    "Servi polpette con verdure e riso"
                ],
                macros: {
                    protein: "40g",
                    carbs: "26g",
                    fats: "18g",
                    calories: "440 kcal"
                },
                timing: "Post-workout cena completa",
                tips: "Manzo: fonte ferro per trasporto ossigeno e performance"
            },
            {
                id: "cen-006",
                name: "Gamberoni con Zoodles (Zucchine Noodles)",
                difficulty: "facile",
                time: 15,
                category: "pesce",
                categoria_giorno: ["cutting", "riposo"],
                tags: ["low-carb", "veloce", "leggero"],
                ingredients: [
                    "180g gamberoni sgusciati",
                    "300g zucchine (spiralizzate)",
                    "Pomodorini 80g",
                    "Aglio, peperoncino",
                    "10g olio EVO",
                    "40g pane integrale"
                ],
                steps: [
                    "Spiralizza zucchine (o comprale pronte)",
                    "Rosola aglio e peperoncino",
                    "Aggiungi gamberoni, cuoci 3-4 min",
                    "Aggiungi zoodles e pomodorini, salta 3 min",
                    "Servi con pane integrale"
                ],
                macros: {
                    protein: "36g",
                    carbs: "24g",
                    fats: "14g",
                    calories: "370 kcal"
                },
                timing: "Cena leggera ideale fase cutting",
                tips: "Zoodles: sostituto pasta basso-carb"
            }
        ]
    },

    // SPUNTINI SERALI - 20P / 10C / 15F ≈ 250 kcal (proteine lente)
    spuntini_serali: {
        description: "20P / 10C / 15F ≈ 250 kcal (proteine lente)",
        recipes: [
            {
                id: "ser-001",
                name: "Skyr con Noci",
                difficulty: "facilissimo",
                time: 1,
                category: "proteico",
                categoria_giorno: ["tutti"],
                tags: ["velocissimo", "caseina", "sintesi-notturna"],
                ingredients: [
                    "200g skyr naturale",
                    "10g noci",
                    "Cannella q.b."
                ],
                steps: [
                    "Versa skyr in bowl",
                    "Aggiungi noci tritate",
                    "Cospargi cannella"
                ],
                macros: {
                    protein: "22g",
                    carbs: "8g",
                    fats: "8g",
                    calories: "200 kcal"
                },
                timing: "30-60 min prima di dormire",
                tips: "Skyr: proteine a lento rilascio per sintesi notturna"
            },
            {
                id: "ser-002",
                name: "Caseina Shake con Burro di Arachidi",
                difficulty: "facilissimo",
                time: 2,
                category: "proteico",
                categoria_giorno: ["tutti"],
                tags: ["velocissimo", "proteine-lente", "saziante"],
                ingredients: [
                    "30g caseina micellare",
                    "10g burro di arachidi",
                    "200ml latte scremato",
                    "Cannella"
                ],
                steps: [
                    "Versa tutto nello shaker",
                    "Shaka vigorosamente",
                    "Bevi lentamente"
                ],
                macros: {
                    protein: "28g",
                    carbs: "12g",
                    fats: "10g",
                    calories: "250 kcal"
                },
                timing: "Prima di dormire",
                tips: "Caseina rilascia aminoacidi per 7-8 ore"
            },
            {
                id: "ser-003",
                name: "Ricotta con Mirtilli e Mandorle",
                difficulty: "facilissimo",
                time: 2,
                category: "proteico",
                categoria_giorno: ["tutti"],
                tags: ["veloce", "antiossidante", "proteico"],
                ingredients: [
                    "100g ricotta vaccina",
                    "50g mirtilli",
                    "10g mandorle",
                    "5g miele"
                ],
                steps: [
                    "Disponi ricotta in bowl",
                    "Aggiungi mirtilli e mandorle",
                    "Completa con filo di miele"
                ],
                macros: {
                    protein: "18g",
                    carbs: "14g",
                    fats: "12g",
                    calories: "240 kcal"
                },
                timing: "Spuntino serale leggero",
                tips: "Ricotta: mix proteine veloci e lente"
            },
            {
                id: "ser-004",
                name: "Uova Sode con Avocado",
                difficulty: "facile",
                time: 10,
                category: "proteico",
                categoria_giorno: ["tutti"],
                tags: ["proteico", "grassi-sani", "saziante"],
                ingredients: [
                    "2 uova sode",
                    "1/2 avocado (60g)",
                    "Sale, pepe, limone"
                ],
                steps: [
                    "Cuoci uova in acqua bollente 8 min",
                    "Raffredda sotto acqua fredda",
                    "Taglia avocado a fette",
                    "Servi con limone e sale"
                ],
                macros: {
                    protein: "16g",
                    carbs: "6g",
                    fats: "18g",
                    calories: "250 kcal"
                },
                timing: "Spuntino serale saziante",
                tips: "Grassi sani aiutano sonno profondo"
            }
        ]
    }
};

// Helper function per ottenere ricette da una categoria
export function getPerplexityRecipes(category) {
    return perplexityNutritionPlan[category]?.recipes || [];
}

// Helper function per filtrare ricette per categoria giorno
export function filterRecipesByDay(recipes, dayType) {
    return recipes.filter(recipe => {
        if (!recipe.categoria_giorno) return true;
        return recipe.categoria_giorno.includes(dayType) || recipe.categoria_giorno.includes("tutti");
    });
}

// Helper function per calcolare totali giornalieri
export function calculateDailyTotals(selectedRecipes) {
    return selectedRecipes.reduce((totals, recipe) => {
        const macros = recipe.macros;
        return {
            protein: totals.protein + parseInt(macros.protein),
            carbs: totals.carbs + parseInt(macros.carbs),
            fats: totals.fats + parseInt(macros.fats),
            calories: totals.calories + parseInt(macros.calories)
        };
    }, { protein: 0, carbs: 0, fats: 0, calories: 0 });
}
