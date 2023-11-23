exports.ErrorMessage = (res,error,message)=>{
    if(process.env.ENV_TYPE == "prod"){
        return res.json({message:message})
    }else{
        return res.json(error)
    }
}
exports.DiagnosticData = [
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
]