export const checkValidity = (value, rules) => {
    let isValid = false;
    const validationResults = [];
    if (rules.required) {
        validationResults.push(value.trim() !== '');
    }

    if (rules.minLength !== undefined && rules.minLength !== null) {
        validationResults.push(value.trim().length >= rules.minLength)
    }

    if (rules.maxLength !== undefined && rules.maxLength !== null) {
        validationResults.push(value.trim().length <= rules.maxLength)
    }

    if (rules.isEmail) {
        const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
        validationResults.push(pattern.test(value.trim()))
    }

    if (rules.isNumeric) {
        const pattern = /^\d+$/;
        validationResults.push(pattern.test(value.trim()))
    }

    isValid = validationResults.every(val => val === true)
    return isValid;
}

export const editorTheme = (defaultEditorTheme) => {
    let theme = localStorage.getItem('editorTheme')
    let defaultTheme = {
        value: defaultEditorTheme,
        label: defaultEditorTheme.replaceAll("_", " ")
    }
    if (!theme) {
        return defaultTheme
    }
    try {
        return JSON.parse(theme)
    } catch {
        return defaultTheme
    }
}
