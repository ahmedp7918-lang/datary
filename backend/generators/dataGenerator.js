const fieldGenerators = require('./fieldGenerators');

class DataGenerator {
    generate(fields, count = 100, locale = 'en_US', options = {}) {
        const data = [];
        const { seed, nullPercentage = 0, unique = false } = options;

        // Set seed if provided
        if (seed) {
            // Simple seed implementation
            this._seed = seed;
        }

        for (let i = 0; i < count; i++) {
            const row = {};
            fields.forEach(field => {
                // Check if should be null
                if (Math.random() * 100 < nullPercentage) {
                    row[field.name] = null;
                    return;
                }

                // Generate value
                const generator = fieldGenerators[field.type] || fieldGenerators.text;
                row[field.name] = generator(field, i, locale);
            });
            data.push(row);
        }

        // Ensure uniqueness if requested
        if (unique && fields.length === 1) {
            const fieldName = fields[0].name;
            const uniqueValues = new Set();
            data.forEach(row => {
                let attempts = 0;
                while (uniqueValues.has(row[fieldName]) && attempts < 100) {
                    const generator = fieldGenerators[fields[0].type] || fieldGenerators.text;
                    row[fieldName] = generator(fields[0], Date.now() + attempts, locale);
                    attempts++;
                }
                uniqueValues.add(row[fieldName]);
            });
        }

        return data;
    }
}

module.exports = new DataGenerator();