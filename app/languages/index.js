const fr = require("./fr.json");
const en = require("./en.json");
const languages = {
    "value": ["fr", "en"],
    "fr": fr,
    "en": en
}
exports.getDictionnaire = (language) => {
    if (languages["value"].includes(language)) {
        return languages[language];
    } else {
        return languages["fr"];
    }
}
exports.checkLanguageExist = (language) =>{
    if (languages["value"].includes(language)) {
        return language;
    } else {
        return "fr";
    }
}