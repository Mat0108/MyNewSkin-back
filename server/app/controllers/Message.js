exports.ErrorMessage = (res,error,message)=>{
    if(process.env.ENV_TYPE == "prod"){
        return res.json({message:message})
    }else{
        return res.json(error)
    }
}
exports.DiagnosticData = {
	"fr":[
		{
			"image":"/images/Diagnostic/diagnostic1.png",
			"title":"Quelle est votre plus grande préoccupation ?",
			"reponses":[
				"Boutons",
				"Points noirs",
				"Pores dilatés",
				"Rougeurs",
				"Teint terne",
				"Poches & cernes",
				"Rides & ridules"
			],
			"type":"simple",
			"width":"w-[200px]",
			"rounded":""
		},
		{
			"image":"/images/Diagnostic/diagnostic3.png",
			"title":"Quelles sont vos préoccupations principales en matière de soins de la peau ?",
			"reponses":[
				"Hydratation",
				"Contrôle de l'excès de sébum",
				"Réduction des imperfections",
				"Anti-âge",
				"Protection solaire",
				"Éclaircissement du teint",
				"Autre"
			],
			"type":"multi",
			"width":"w-[350px]",
			"rounded":""
		},
		{
			"image":"/images/Diagnostic/diagnostic3.png",
			"title":"Quels produits de soins de la peau utilisez vous régulièrement ?",
			"reponses":[
				"Nettoyant",
				"Tonique ou lotion",
				"Sérum",
				"Crème hydratante",
				"Écran solaire",
				"Masque Solaire",
				"Exfoliant",
				"Aucun produit"
			],
			"type":"multi",
			"width":"w-[220px]",
			"rounded":""
		},
		{
			"image":"/images/Diagnostic/diagnostic4.png",
			"title":"Aidez-nous à comprendre ce manque d’éclat.",
			"reponses":[
				"Je fume et / ou je vis dans un environnement pollué",
				"J'ai un grain de peau irrégulier",
				"Ma peau est en manque de soleil"
			],
			"type":"multi",
			"width":"w-full",
			"rounded":""
		},
		{
			"image":"/images/Diagnostic/diagnostic5.png",
			"title":"Vous vous définissez comme ...",
			"reponses":[
				"Une femme",
				"Un homme",
				"Non-binaire",
				"Je ne souhaite pas me definir"
			],
			"type":"multi",
			"width":"w-[330px]",
			"rounded":""
		}
	],
	"en":[
		{
			"image":"/images/Diagnostic/diagnostic1.png",
			"title":"What is your biggest concern?",
			"reponses":[
				"Blemishes",
				"Blackheads",
				"Enlarged pores",
				"Redness",
				"Dull complexion",
				"Bags & dark circles",
				"Wrinkles & fine lines"
			],
			"type":"simple",
			"width":"w-[250px]",
			"rounded":""
		},
		{
			"image":"/images/Diagnostic/diagnostic2.png",
			"title":"What are your main skin care concerns?",
			"reponses":[
				"Hydration",
				"Excess sebum control",
				"Imperfection reduction",
				"Anti-aging",
				"Sun protection",
				"Skin brightening",
				"Other"
			],
			"type":"multi",
			"width":"w-[350px]",
			"rounded":""
		},
		{
			"image":"/images/Diagnostic/diagnostic3.png",
			"title":"What skin care products do you regularly use?",
			"reponses":[
				"Cleanser",
				"Toner or lotion",
				"Serum",
				"Moisturizer",
				"Sunscreen",
				"Sunscreen mask",
				"Exfoliant",
				"No product"
			],
			"type":"multi",
			"width":"w-[220px]",
			"rounded":""
		},
		{
			"image":"/images/Diagnostic/diagnostic4.png",
			"title":"Help us understand this lack of radiance.",
			"reponses":[
				"I smoke and/or live in a polluted environment",
				"I have uneven skin texture",
				"My skin lacks sunlight"
			],
			"type":"multi",
			"width":"w-full",
			"rounded":""
		},
		{
			"image":"/images/Diagnostic/diagnostic5.png",
			"title":"You define yourself as ...",
			"reponses":[
				"A woman",
				"A man",
				"Non-binary",
				"I prefer not to define myself"
			],
			"type":"simple",
			"width":"w-[330px]",
			"rounded":""
		}
	]
	
}