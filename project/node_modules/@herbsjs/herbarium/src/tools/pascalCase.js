const toPascalCase = (text) => {
    if (text === null || text === undefined) {
        return ''
    }

    const alphanumericText = text.replace(/[^a-zA-Z0-9 ]/gi, '')

    if (!alphanumericText.trim()) {
        return ''
    }

    return alphanumericText
        .trim()
        .split(' ')
        .reduce((pascalCaseText, [firstLetter, ...remainingLetters]) => {
            const upperCaseFirstLetter = firstLetter.toUpperCase()
            const restOfTheWord = remainingLetters.join('')

            return `${pascalCaseText}${upperCaseFirstLetter}${restOfTheWord}`
        }, '')
}

module.exports = toPascalCase
