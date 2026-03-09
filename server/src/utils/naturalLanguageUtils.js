"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateNgrams = void 0;
const wink_lemmatizer_1 = __importDefault(require("wink-lemmatizer"));
// Generate a cleaned list of alphanumeric, lowercase monograms and bigrams from an unsanitised query string
const generateNgrams = (query) => {
    // clean the query string
    const cleaned = query.trim().normalize("NFD") // decompose accented characters
        .replace(/[\u0300-\u036f]/g, "") // remove accent marks
        .replace(/[^a-zA-Z0-9\s]/g, "") // keep alphanumeric + whitespace only
        .toLowerCase(); // convert to lowercase
    // split the cleaned string into monograms
    let monograms = cleaned.split(' ');
    // remove stopwords
    const STOPWORDS = new Set(["the", "a", "an", "in", "on", "at", "to", "for", "of", "and", "or", "near", "about", "but", "how", "are"]);
    monograms = monograms.filter(monogram => !STOPWORDS.has(monogram));
    // generate bigrams from monograms
    const bigrams = [];
    for (let i = 0; i < monograms.length - 1; i++) {
        bigrams.push(`${monograms[i]} ${monograms[i + 1]}`);
    }
    // generate lemmatized monograms
    const monogramSet = new Set(monograms); // set for duplicate checking
    for (const monogram of monograms) {
        const lemmas = [
            wink_lemmatizer_1.default.noun(monogram),
            wink_lemmatizer_1.default.adjective(monogram),
            wink_lemmatizer_1.default.verb(monogram)
        ];
        for (const lemma of lemmas) {
            if (!monogramSet.has(lemma)) {
                monogramSet.add(lemma);
                monograms.push(lemma);
            }
        }
    }
    // final list of ngrams
    return monograms.concat(bigrams);
};
exports.generateNgrams = generateNgrams;
