const HTML_TAG_PATTERN = /<\/?[a-z][\s\S]*>/i

function escapeHtml(value: string) {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
}

export function normalizeRichTextInput(value: unknown) {
    if (typeof value !== 'string') {
        return ''
    }

    const normalizedValue = value.replace(/\r\n/g, '\n').trim()
    if (!normalizedValue) {
        return ''
    }

    if (HTML_TAG_PATTERN.test(normalizedValue)) {
        return normalizedValue
    }

    return normalizedValue
        .split(/\n{2,}/)
        .map(paragraph => `<p>${escapeHtml(paragraph).replace(/\n/g, '<br />')}</p>`)
        .join('')
}