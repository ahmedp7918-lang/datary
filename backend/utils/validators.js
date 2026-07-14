const validFieldTypes = [
    'name', 'email', 'phone', 'address', 'country', 'city', 
    'company', 'number', 'date', 'boolean', 'uuid', 'url', 
    'ip', 'price', 'custom'
];

function validateGenerationRequest(data) {
    const errors = [];

    // Validate fields
    if (!data.fields || !Array.isArray(data.fields) || data.fields.length === 0) {
        errors.push('At least one field is required');
    } else {
        data.fields.forEach((field, index) => {
            if (!field.name || typeof field.name !== 'string' || field.name.trim() === '') {
                errors.push(`Field ${index + 1}: Name is required`);
            }
            if (!field.type || !validFieldTypes.includes(field.type)) {
                errors.push(`Field ${index + 1}: Invalid type "${field.type}"`);
            }
            if (field.name && field.name.length > 100) {
                errors.push(`Field ${index + 1}: Name too long (max 100 characters)`);
            }
        });
    }

    // Validate count
    if (data.count) {
        const count = parseInt(data.count);
        if (isNaN(count) || count < 1 || count > 100000) {
            errors.push('Count must be between 1 and 100,000');
        }
    }

    // Validate format
    const validFormats = ['json', 'jsonl', 'csv', 'sql', 'xml', 'yaml', 'html', 'markdown'];
    if (data.format && !validFormats.includes(data.format.toLowerCase())) {
        errors.push(`Invalid format. Supported: ${validFormats.join(', ')}`);
    }

    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

function validateTemplateRequest(data) {
    const errors = [];

    if (!data.name || typeof data.name !== 'string' || data.name.trim() === '') {
        errors.push('Template name is required');
    }

    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

module.exports = {
    validateGenerationRequest,
    validateTemplateRequest,
    validFieldTypes
};