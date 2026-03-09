import lemmatizer from 'wink-lemmatizer'

// Generate a cleaned list of alphanumeric, lowercase monograms and bigrams from an unsanitised query string
export const generateNgrams = (query: string) => {
    // clean the query string
    const cleaned = query.trim().normalize("NFD")  // decompose accented characters
        .replace(/[\u0300-\u036f]/g, "")  // remove accent marks
        .replace(/[^a-zA-Z0-9\s]/g, "")   // keep alphanumeric + whitespace only
        .toLowerCase() // convert to lowercase

    // split the cleaned string into monograms
    let monograms = cleaned.split(' ')

    // remove stopwords
    const STOPWORDS = new Set(["the", "a", "an", "in", "on", "at", "to", "for", "of", "and", "or", "near", "about", "but", "how", "are"]);
    monograms = monograms.filter(monogram => !STOPWORDS.has(monogram));

    // generate bigrams from monograms
    const bigrams: string[] = [];
    for (let i = 0; i < monograms.length - 1; i++) {
        bigrams.push(`${monograms[i]} ${monograms[i + 1]}`);
    }

    // generate lemmatized monograms
    const monogramSet = new Set(monograms) // set for duplicate checking
    for (const monogram of monograms) {
        const lemmas = [
            lemmatizer.noun(monogram),
            lemmatizer.adjective(monogram),
            lemmatizer.verb(monogram)
        ]
        for (const lemma of lemmas) {
            if (!monogramSet.has(lemma)) {
                monogramSet.add(lemma)
                monograms.push(lemma)
            }
        }
    }


    // final list of ngrams
    return monograms.concat(bigrams)
}