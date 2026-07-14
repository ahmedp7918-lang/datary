const { Parser } = require('json2csv');
const XLSX = require('xlsx');
const yaml = require('js-yaml');
const xml2js = require('xml2js');

class Formatter {
    format(data, format, options = {}) {
        switch(format.toLowerCase()) {
            case 'json':
                return this.toJSON(data, options);
            case 'jsonl':
                return this.toJSONL(data);
            case 'csv':
                return this.toCSV(data, options);
            case 'sql':
                return this.toSQL(data, options);
            case 'xml':
                return this.toXML(data, options);
            case 'yaml':
                return this.toYAML(data);
            case 'html':
                return this.toHTML(data);
            case 'markdown':
                return this.toMarkdown(data);
            default:
                return this.toJSON(data, options);
        }
    }

    toJSON(data, options = {}) {
        return JSON.stringify(data, null, options.pretty ? 2 : 0);
    }

    toJSONL(data) {
        return data.map(row => JSON.stringify(row)).join('\n');
    }

    toCSV(data, options = {}) {
        if (data.length === 0) return '';
        try {
            const parser = new Parser({
                fields: Object.keys(data[0]),
                delimiter: options.delimiter || ','
            });
            return parser.parse(data);
        } catch (error) {
            console.error('CSV parsing error:', error);
            return '';
        }
    }

    toSQL(data, options = {}) {
        if (data.length === 0) return '-- No data';
        
        const tableName = options.tableName || 'dataset';
        const columns = Object.keys(data[0]);
        const columnDefs = columns.map(col => `"${col}"`).join(', ');
        
        const values = data.map(row => {
            const vals = columns.map(col => {
                const val = row[col];
                if (val === null || val === undefined) return 'NULL';
                if (typeof val === 'string') return `'${val.replace(/'/g, "''")}'`;
                if (typeof val === 'boolean') return val ? '1' : '0';
                if (typeof val === 'object') return `'${JSON.stringify(val).replace(/'/g, "''")}'`;
                return String(val);
            });
            return `  (${vals.join(', ')})`;
        }).join(',\n');
        
        return `INSERT INTO "${tableName}" (${columnDefs}) VALUES\n${values};`;
    }

    toXML(data, options = {}) {
        const builder = new xml2js.Builder({
            rootName: options.rootName || 'dataset',
            renderOpts: { pretty: true }
        });
        const obj = { record: data };
        return builder.buildObject(obj);
    }

    toYAML(data) {
        return yaml.dump(data, { indent: 2 });
    }

    toHTML(data) {
        if (data.length === 0) return '<p>No data available</p>';
        
        const headers = Object.keys(data[0]);
        let html = '<table border="1" style="border-collapse: collapse; width: 100%;">\n';
        html += '  <thead>\n    <tr>\n';
        headers.forEach(h => {
            html += `      <th style="padding: 8px; background: #1e293b; color: #f1f5f9;">${h}</th>\n`;
        });
        html += '    </tr>\n  </thead>\n  <tbody>\n';
        
        data.slice(0, 20).forEach(row => {
            html += '    <tr>\n';
            headers.forEach(h => {
                html += `      <td style="padding: 8px; border: 1px solid #334155;">${row[h] || ''}</td>\n`;
            });
            html += '    </tr>\n';
        });
        
        if (data.length > 20) {
            html += `    <tr><td colspan="${headers.length}" style="text-align: center; padding: 8px;">... and ${data.length - 20} more rows</td></tr>\n`;
        }
        
        html += '  </tbody>\n</table>';
        return html;
    }

    toMarkdown(data) {
        if (data.length === 0) return '*No data available*';
        
        const headers = Object.keys(data[0]);
        let markdown = '| ' + headers.join(' | ') + ' |\n';
        markdown += '|' + headers.map(() => '---').join('|') + '|\n';
        
        data.slice(0, 20).forEach(row => {
            markdown += '| ' + headers.map(h => row[h] || '').join(' | ') + ' |\n';
        });
        
        if (data.length > 20) {
            markdown += `\n*... and ${data.length - 20} more rows*`;
        }
        
        return markdown;
    }
}

module.exports = new Formatter();