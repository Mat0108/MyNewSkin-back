const index = require("../../languages/index");
const fr = require("../../languages/fr.json");
const en = require("../../languages/en.json");
const { expect } = require('chai');
describe("getDictionnaire", () => {
    it("should return the dictionary for the specified language", () => {

        expect(index.getDictionnaire("fr")).to.be.equal(fr);
        expect(index.getDictionnaire("en")).to.be.equal(en);
    });
    it("should return french dictionary if the language is not supported", () => {
        expect(index.getDictionnaire("es")).to.be.equal(fr);
    });
});

describe("checkLanguageExist", () => {
    it("should return the specified language if it exists", () => {
        expect(index.checkLanguageExist("fr")).to.be.equal("fr");
        expect(index.checkLanguageExist("en")).to.be.equal("en");
    });

    it("should return 'fr' if the specified language does not exist", () => {
        expect(index.checkLanguageExist("es")).to.be.equal("fr");
        expect(index.checkLanguageExist("de")).to.be.equal("fr");
    });
});
