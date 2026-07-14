const dataGenerator = require('../generators/dataGenerator');
const formatters = require('../generators/formatters');
const { validateGenerationRequest } = require('../utils/validators');

exports.generateData = async (req, res, next) => {
    try {
        const { fields, count, format, locale, options = {} } = req.body;

        // Validate request
        const validation = validateGenerationRequest(req.body);
        if (!validation.isValid) {
            return res.status(400).json({ error: validation.errors });
        }

        // Generate data
        const data = dataGenerator.generate(fields, count, locale, options);

        // Format data
        const formatted = formatters.format(data, format, options);

        // Generate metadata
        const metadata = {
            totalRows: data.length,
            fields: fields,
            format: format,
            generatedAt: new Date().toISOString(),
            size: Buffer.byteLength(formatted, 'utf8')
        };

        res.json({
            success: true,
            data: formatted,
            metadata: metadata,
            preview: data.slice(0, 10)
        });

    } catch (error) {
        next(error);
    }
};

exports.previewData = async (req, res, next) => {
    try {
        const { fields, count = 10, locale } = req.body;

        const validation = validateGenerationRequest(req.body);
        if (!validation.isValid) {
            return res.status(400).json({ error: validation.errors });
        }

        const data = dataGenerator.generate(fields, Math.min(count, 10), locale);
        
        res.json({
            success: true,
            preview: data
        });

    } catch (error) {
        next(error);
    }
};

exports.validateSchema = async (req, res, next) => {
    try {
        const { fields } = req.body;
        
        const validation = validateGenerationRequest(req.body);
        if (!validation.isValid) {
            return res.status(400).json({ error: validation.errors });
        }

        res.json({
            success: true,
            message: 'Schema is valid',
            fields: fields
        });

    } catch (error) {
        next(error);
    }
};