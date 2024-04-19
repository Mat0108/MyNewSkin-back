const assert = require('assert');
const db = require('../../config/db.config');

describe('Database Configuration', () => {
    it('should have a valid database URL', () => {
        assert.strictEqual(typeof db.url, 'string');
        assert.ok(db.url.startsWith('mongodb+srv'));
    });

});