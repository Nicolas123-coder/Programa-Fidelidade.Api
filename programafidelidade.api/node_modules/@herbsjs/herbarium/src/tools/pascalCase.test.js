const toPascalCase = require('./pascalCase')
const assert = require('assert')

describe('pascalCase', () => {
    it('should return empty string when the text is null', () => {
        const result = toPascalCase(null)
        assert.equal(result, '')
    })

    it('should return empty string when the text is undefined', () => {
        const result = toPascalCase(undefined)
        assert.equal(result, '')
    })

    it('should remove non alphanumeric characters from the text', () => {
        const letters = 'abcdefghijklmnopqrstuvwxyz'
        const upperCaseLetters = letters.toUpperCase()
        const numbers = '0123456789'
        const nonAlphanumericChacaters = '!@#$%^&*()_+[]\\|:>.,<?/'

        const alphanumericText = `${numbers}${letters}${upperCaseLetters}`

        const text = `${alphanumericText}${nonAlphanumericChacaters}`

        const result = toPascalCase(text)
        assert.equal(result, alphanumericText)
    })

    it('should return empty string when the text has no alphanumeric characters', () => {
        const nonAlphanumericChacaters = '!@#$%^  &*(   )_+[]\\|  :>.,<?/  '
        const result = toPascalCase(nonAlphanumericChacaters)
        assert.equal(result, '')
    })

    it('should make the first character uppercase', () => {
        const text = 'text'
        const [firstLetter] = toPascalCase(text)
        assert.equal(firstLetter, 'T')
    })

    it('should make every character after a `space` uppercase', () => {
        const text = 'text with spaces'
        const result = toPascalCase(text)
        assert.equal(result, 'TextWithSpaces')
    })
})
