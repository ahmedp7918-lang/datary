// ============================================================
//  DATARY - Frontend Logic
// ============================================================

(function() {
    'use strict';

    // ---------- State ----------
    const state = {
        fields: [
            { name: 'id', type: 'uuid' },
            { name: 'full_name', type: 'name' },
            { name: 'email', type: 'email' }
        ],
        isGenerating: false,
        countdownInterval: null,
        isUnlocked: false,
        generatedData: null,
        currentFormat: 'json'
    };

    // ---------- DOM Refs ----------
    const $ = (sel) => document.querySelector(sel);
    const $$ = (sel) => document.querySelectorAll(sel);

    const fieldNameInput = $('#field-name');
    const fieldTypeSelect = $('#field-type');
    const addFieldBtn = $('#add-field-btn');
    const fieldsList = $('#fields-list');
    const generateBtn = $('#generate-btn');
    const clearFieldsBtn = $('#clear-fields-btn');
    const rowCountInput = $('#row-count');
    const localeSelect = $('#locale-select');
    const formatSelect = $('#format-select');
    const resultBox = $('#result-box');
    const countdownEl = $('#countdown');
    const downloadBtn = $('#download-btn');
    const copyBtn = $('#copy-btn');
    const codeEditor = $('#code-editor');
    const codeContent = $('#code-content');
    const codeLang = $('#code-lang');
    const codeCopyBtn = $('#code-copy-btn');
    const advancedToggle = $('#advanced-toggle');
    const advancedPanel = $('#advanced-panel');
    const getStartedBtn = $('#getStartedBtn');

    // ---------- Render Fields ----------
    function renderFields() {
        if (!fieldsList) return;
        fieldsList.innerHTML = '';
        state.fields.forEach((f, idx) => {
            const div = document.createElement('div');
            div.className = 'field-item';
            div.innerHTML = `
                <span><strong>${escapeHtml(f.name)}</strong> <span class="badge">${escapeHtml(f.type)}</span></span>
                <button class="remove-btn" data-index="${idx}">✕</button>
            `;
            fieldsList.appendChild(div);
        });
        // Attach remove events
        fieldsList.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                const idx = parseInt(this.dataset.index, 10);
                if (!isNaN(idx)) {
                    state.fields.splice(idx, 1);
                    renderFields();
                }
            });
        });
    }

    // ---------- Helpers ----------
    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // ---------- Add Field ----------
    function addField() {
        const name = fieldNameInput.value.trim() || 'field';
        const type = fieldTypeSelect.value;
        if (state.fields.some(f => f.name === name)) {
            alert('Field name already exists.');
            return;
        }
        state.fields.push({ name, type });
        renderFields();
        fieldNameInput.value = '';
        fieldNameInput.focus();
    }

    // ---------- Clear Fields ----------
    function clearFields() {
        if (state.fields.length === 0) return;
        if (confirm('Remove all fields?')) {
            state.fields = [];
            renderFields();
        }
    }

    // ---------- Generate Mock Data ----------
    function generateMockData(fields, count, locale) {
        const generators = {
            name: () => ['John', 'Jane', 'Alex', 'Maria', 'James', 'Sarah', 'Michael', 'Emma', 'David', 'Laura'][
                Math.floor(Math.random() * 10)
            ] + ' ' + ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez',
                'Martinez'
            ][Math.floor(Math.random() * 10)],
            email: () => {
                const names = ['john', 'jane', 'alex', 'maria', 'james', 'sarah', 'michael', 'emma', 'david', 'laura'];
                const domains = ['example.com', 'test.org', 'data.dev', 'sample.net', 'mock.io'];
                return names[Math.floor(Math.random() * names.length)] + '.' + names[Math.floor(Math.random() * names
                    .length)] + '@' + domains[Math.floor(Math.random() * domains.length)];
            },
            phone: () => '+1-' + String(100 + Math.floor(Math.random() * 900)) + '-' + String(100 + Math.floor(Math
                .random() * 900)) + '-' + String(1000 + Math.floor(Math.random() * 9000)),
            address: () => Math.floor(Math.random() * 9999) + ' ' + ['Main', 'Oak', 'Pine', 'Maple', 'Cedar', 'Elm',
                'Washington', 'Lincoln', 'Jefferson', 'Madison'
            ][Math.floor(Math.random() * 10)] + ' St, ' + ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix',
                'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'Austin'
            ][Math.floor(Math.random() * 10)] + ', ' + ['NY', 'CA', 'IL', 'TX', 'AZ', 'PA', 'TX', 'CA', 'TX', 'TX'][
                Math.floor(Math.random() * 10)
            ],
            country: () => ['USA', 'Canada', 'UK', 'Germany', 'France', 'Spain', 'Italy', 'Japan', 'Australia', 'Brazil'][
                Math.floor(Math.random() * 10)
            ],
            city: () => ['New York', 'London', 'Paris', 'Berlin', 'Madrid', 'Rome', 'Tokyo', 'Sydney', 'Sao Paulo',
                'Moscow'
            ][Math.floor(Math.random() * 10)],
            company: () => ['Acme', 'Globex', 'Initech', 'Hooli', 'Stark', 'Wayne', 'Umbrella', 'Cyberdyne', 'Oscorp',
                'Wonka'
            ][Math.floor(Math.random() * 10)] + ' ' + ['Corp', 'Inc', 'Ltd', 'LLC', 'Group', 'Holdings', 'Industries',
                'Systems', 'Dynamics', 'Ventures'
            ][Math.floor(Math.random() * 10)],
            number: () => Math.floor(Math.random() * 10000),
            date: () => {
                const d = new Date(Date.now() - Math.random() * 31536000000);
                return d.toISOString().split('T')[0];
            },
            boolean: () => Math.random() > 0.5,
            uuid: () => {
                let s = '';
                for (let i = 0; i < 36; i++) {
                    if (i === 8 || i === 13 || i === 18 || i === 23) s += '-';
                    else if (i === 14) s += '4';
                    else if (i === 19) s += '89ab' [Math.floor(Math.random() * 4)];
                    else s += '0123456789abcdef' [Math.floor(Math.random() * 16)];
                }
                return s;
            },
            url: () => 'https://' + ['example', 'test', 'demo', 'sample', 'data'][Math.floor(Math.random() * 5)] +
                '.com/' + ['page', 'api', 'docs', 'resource', 'item'][Math.floor(Math.random() * 5)] + '/' + Math.floor(
                    Math.random() * 1000),
            ip: () => Math.floor(Math.random() * 255) + '.' + Math.floor(Math.random() * 255) + '.' + Math.floor(Math
                .random() * 255) + '.' + Math.floor(Math.random() * 255),
            price: () => (Math.random() * 999 + 1).toFixed(2),
            custom: () => {
                const pattern = $('#custom-pattern').value || '####';
                let result = '';
                for (let i = 0; i < pattern.length; i++) {
                    if (pattern[i] === '#') {
                        result += Math.floor(Math.random() * 10);
                    } else if (pattern[i] === '?') {
                        result += String.fromCharCode(65 + Math.floor(Math.random() * 26));
                    } else {
                        result += pattern[i];
                    }
                }
                return result;
            }
        };

        const data = [];
        const nullPercentage = parseInt($('#null-percentage').value) || 0;
        const unique = $('#unique-select').value === 'true';

        for (let i = 0; i < count; i++) {
            const row = {};
            fields.forEach(f => {
                if (Math.random() * 100 < nullPercentage) {
                    row[f.name] = null;
                    return;
                }
                const gen = generators[f.type] || generators.name;
                row[f.name] = gen();
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
                    const gen = generators[fields[0].type] || generators.name;
                    row[fieldName] = gen();
                    attempts++;
                }
                uniqueValues.add(row[fieldName]);
            });
        }

        return data;
    }

    // ---------- Format Data ----------
    function formatData(data, format) {
        if (format === 'json') return JSON.stringify(data, null, 2);
        if (format === 'jsonl') return data.map(r => JSON.stringify(r)).join('\n');
        if (format === 'csv') {
            if (data.length === 0) return '';
            const headers = Object.keys(data[0]);
            const rows = data.map(row => headers.map(h => {
                const val = row[h] || '';
                return typeof val === 'string' && (val.includes(',') || val.includes('"')) ?
                    `"${val.replace(/"/g, '""')}"` :
                    val;
            }).join(','));
            return headers.join(',') + '\n' + rows.join('\n');
        }
        if (format === 'sql') {
            if (data.length === 0) return '-- no data';
            const headers = Object.keys(data[0]);
            const table = 'dataset';
            const cols = headers.join(', ');
            const values = data.map(row => {
                const vals = headers.map(h => {
                    const v = row[h];
                    if (v === null || v === undefined) return 'NULL';
                    if (typeof v === 'string') return `'${v.replace(/'/g, "''")}'`;
                    if (typeof v === 'boolean') return v ? '1' : '0';
                    return String(v);
                });
                return `INSERT INTO ${table} (${cols}) VALUES (${vals.join(', ')});`;
            }).join('\n');
            return `-- SQL generated by Datary\n${values}`;
        }
        if (format === 'xml') {
            let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<dataset>\n';
            data.forEach(row => {
                xml += '  <record>\n';
                Object.keys(row).forEach(key => {
                    xml += `    <${key}>${row[key] || ''}</${key}>\n`;
                });
                xml += '  </record>\n';
            });
            xml += '</dataset>';
            return xml;
        }
        if (format === 'yaml') {
            return data.map(row => {
                let yaml = '-\n';
                Object.keys(row).forEach(key => {
                    yaml += `  ${key}: ${row[key] || ''}\n`;
                });
                return yaml;
            }).join('');
        }
        if (format === 'html') {
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
                html +=
                    `    <tr><td colspan="${headers.length}" style="text-align: center; padding: 8px;">... and ${data.length - 20} more rows</td></tr>\n`;
            }
            html += '  </tbody>\n</table>';
            return html;
        }
        if (format === 'markdown') {
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
        return JSON.stringify(data, null, 2);
    }

    // ---------- Start Generation ----------
    function startGeneration() {
        if (state.isGenerating) return;
        if (state.fields.length === 0) {
            alert('Please add at least one field.');
            return;
        }
        const count = parseInt(rowCountInput.value, 10) || 100;
        const locale = localeSelect.value;
        const format = formatSelect.value;
        state.currentFormat = format;

        // Generate
        const data = generateMockData(state.fields, count, locale);
        state.generatedData = data;

        // Show result box
        resultBox.style.display = 'block';
        downloadBtn.disabled = true;
        copyBtn.disabled = true;
        state.isUnlocked = false;

        // Countdown 60 sec
        let seconds = 60;
        countdownEl.textContent = '00:' + String(seconds).padStart(2, '0');
        if (state.countdownInterval) clearInterval(state.countdownInterval);
        state.countdownInterval = setInterval(() => {
            seconds--;
            if (seconds < 0) {
                clearInterval(state.countdownInterval);
                state.countdownInterval = null;
                countdownEl.textContent = '✅ Ready';
                downloadBtn.disabled = false;
                copyBtn.disabled = false;
                state.isUnlocked = true;
                const formatted = formatData(data, format);
                codeContent.textContent = formatted;
                codeLang.textContent = format.toUpperCase();
                document.querySelector('.lock-icon').textContent = '🔓';
            } else {
                countdownEl.textContent = '00:' + String(seconds).padStart(2, '0');
            }
        }, 1000);

        // Show preview
        const previewData = data.slice(0, 10);
        const previewFormatted = formatData(previewData, format);
        codeContent.textContent = previewFormatted + '\n\n... (' + data.length + ' rows total)';
        codeLang.textContent = format.toUpperCase() + ' (preview)';
        codeEditor.style.display = 'block';
        state.isGenerating = true;
        setTimeout(() => { state.isGenerating = false; }, 1000);
    }

    // ---------- Download ----------
    function downloadData() {
        if (!state.generatedData || !state.isUnlocked) return;
        const format = state.currentFormat;
        const content = formatData(state.generatedData, format);
        let mime = 'text/plain';
        let ext = 'txt';
        if (format === 'json') { mime = 'application/json';
            ext = 'json'; } else if (format === 'jsonl') { mime = 'application/jsonl';
            ext = 'jsonl'; } else if (format === 'csv') { mime = 'text/csv';
            ext = 'csv'; } else if (format === 'sql') { mime = 'text/plain';
            ext = 'sql'; } else if (format === 'xml') { mime = 'application/xml';
            ext = 'xml'; } else if (format === 'yaml') { mime = 'text/yaml';
            ext = 'yaml'; } else if (format === 'html') { mime = 'text/html';
            ext = 'html'; } else if (format === 'markdown') { mime = 'text/markdown';
            ext = 'md'; }
        const blob = new Blob([content], { type: mime + ';charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'dataset.' + ext;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // ---------- Copy Code ----------
    function copyCode() {
        const content = codeContent.textContent;
        navigator.clipboard.writeText(content).then(() => {
            alert('Copied to clipboard!');
        }).catch(() => {
            const ta = document.createElement('textarea');
            ta.value = content;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            alert('Copied!');
        });
    }

    // ---------- Advanced Toggle ----------
    function toggleAdvanced() {
        advancedPanel.classList.toggle('open');
        const btn = advancedToggle;
        btn.textContent = advancedPanel.classList.contains('open') ?
            '⚙️ Advanced Options ▴' :
            '⚙️ Advanced Options ▾';
    }

    // ---------- Template Click ----------
    function loadTemplate(templateName) {
        const templates = {
            ecommerce: [
                { name: 'product_id', type: 'uuid' },
                { name: 'product_name', type: 'name' },
                { name: 'price', type: 'price' },
                { name: 'category', type: 'text' },
                { name: 'stock', type: 'number' }
            ],
            banking: [
                { name: 'account_id', type: 'uuid' },
                { name: 'customer_name', type: 'name' },
                { name: 'balance', type: 'price' },
                { name: 'account_type', type: 'text' },
                { name: 'created_date', type: 'date' }
            ],
            healthcare: [
                { name: 'patient_id', type: 'uuid' },
                { name: 'patient_name', type: 'name' },
                { name: 'diagnosis', type: 'text' },
                { name: 'admission_date', type: 'date' },
                { name: 'doctor_name', type: 'name' }
            ],
            education: [
                { name: 'student_id', type: 'uuid' },
                { name: 'student_name', type: 'name' },
                { name: 'course', type: 'text' },
                { name: 'grade', type: 'number' },
                { name: 'enrollment_date', type: 'date' }
            ],
            employees: [
                { name: 'employee_id', type: 'uuid' },
                { name: 'full_name', type: 'name' },
                { name: 'email', type: 'email' },
                { name: 'department', type: 'text' },
                { name: 'salary', type: 'price' }
            ],
            crm: [
                { name: 'contact_id', type: 'uuid' },
                { name: 'contact_name', type: 'name' },
                { name: 'email', type: 'email' },
                { name: 'company', type: 'company' },
                { name: 'status', type: 'text' }
            ],
            realestate: [
                { name: 'property_id', type: 'uuid' },
                { name: 'address', type: 'address' },
                { name: 'price', type: 'price' },
                { name: 'bedrooms', type: 'number' },
                { name: 'bathrooms', type: 'number' }
            ],
            restaurants: [
                { name: 'restaurant_id', type: 'uuid' },
                { name: 'name', type: 'name' },
                { name: 'cuisine', type: 'text' },
                { name: 'rating', type: 'number' },
                { name: 'address', type: 'address' }
            ],
            socialmedia: [
                { name: 'post_id', type: 'uuid' },
                { name: 'user_name', type: 'name' },
                { name: 'content', type: 'text' },
                { name: 'likes', type: 'number' },
                { name: 'created_at', type: 'date' }
            ],
            logistics: [
                { name: 'order_id', type: 'uuid' },
                { name: 'customer_name', type: 'name' },
                { name: 'product', type: 'text' },
                { name: 'quantity', type: 'number' },
                { name: 'delivery_date', type: 'date' }
            ]
        };

        const template = templates[templateName];
        if (template) {
            state.fields = template;
            renderFields();
            // Scroll to generator
            document.getElementById('generator').scrollIntoView({ behavior: 'smooth' });
        }
    }

    // ---------- Init ----------
    function init() {
        renderFields();

        // Events
        addFieldBtn.addEventListener('click', addField);
        clearFieldsBtn.addEventListener('click', clearFields);
        generateBtn.addEventListener('click', startGeneration);
        downloadBtn.addEventListener('click', downloadData);
        copyBtn.addEventListener('click', copyCode);
        codeCopyBtn.addEventListener('click', copyCode);
        advancedToggle.addEventListener('click', toggleAdvanced);

        // Enter key in field name
        fieldNameInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') { e.preventDefault();
                addField(); }
        });

        // Get Started button
        getStartedBtn.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('generator').scrollIntoView({ behavior: 'smooth' });
        });

        // Template chips
        document.querySelectorAll('.template-chip[data-template]').forEach(chip => {
            chip.addEventListener('click', function() {
                const template = this.dataset.template;
                loadTemplate(template);
            });
        });

        // Format change updates code
        formatSelect.addEventListener('change', () => {
            if (state.generatedData) {
                const fmt = formatSelect.value;
                const formatted = formatData(state.generatedData, fmt);
                codeContent.textContent = formatted;
                codeLang.textContent = fmt.toUpperCase();
                state.currentFormat = fmt;
            }
        });

        // Initial sample
        setTimeout(() => {
            const sample = generateMockData(state.fields, 5, 'en_US');
            const formatted = formatData(sample, 'json');
            codeContent.textContent = formatted;
            codeLang.textContent = 'JSON (preview)';
            codeEditor.style.display = 'block';
        }, 300);

        console.log('🚀 Datary initialized.');
    }

    // Run
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();