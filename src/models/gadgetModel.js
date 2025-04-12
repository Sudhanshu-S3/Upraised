const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');

// Gadget codename prefixes and suffixes for random generation
const CODENAME_PREFIXES = ['The', 'Operation', 'Project', 'Agent', 'Mission'];
const CODENAME_SUFFIXES = ['Nightingale', 'Kraken', 'Phoenix', 'Shadow', 'Falcon', 'Specter',
    'Chimera', 'Phantom', 'Cobra', 'Eclipse', 'Horizon', 'Avalanche',
    'Whirlwind', 'Titan', 'Oracle'];

// Valid gadget statuses
const GADGET_STATUSES = ['Available', 'Deployed', 'Destroyed', 'Decommissioned'];

class Gadget {
    // Generate a random success probability percentage
    static generateSuccessProbability() {
        return Math.floor(Math.random() * 70) + 30; // Returns between 30% and 99%
    }

    // Generate a unique codename for a gadget
    static generateCodename() {
        const prefix = CODENAME_PREFIXES[Math.floor(Math.random() * CODENAME_PREFIXES.length)];
        const suffix = CODENAME_SUFFIXES[Math.floor(Math.random() * CODENAME_SUFFIXES.length)];
        return `${prefix} ${suffix}`;
    }

    static async findById(id) {
        const { rows } = await pool.query('SELECT * FROM gadgets WHERE id = $1', [id]);
        if (rows[0]) {
            // Add mission success probability when retrieving a gadget
            rows[0].mission_success_probability = this.generateSuccessProbability();
        }
        return rows[0];
    }

    static async findAll(filters = {}) {
        let query = 'SELECT * FROM gadgets';
        const values = [];

        // Apply filters
        if (filters.status) {
            query += ' WHERE status = $1';
            values.push(filters.status);
        }

        const { rows } = await pool.query(query, values);

        // Add mission success probability to each gadget
        return rows.map(gadget => ({
            ...gadget,
            mission_success_probability: this.generateSuccessProbability()
        }));
    }

    static async create({ name, description, price }) {
        const id = uuidv4();
        const codename = this.generateCodename();
        const status = 'Available'; // Default status for new gadgets

        const { rows } = await pool.query(
            'INSERT INTO gadgets (id, name, description, price, codename, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [id, name, description, price, codename, status]
        );
        return rows[0];
    }

    static async update(id, { name, description, price, status, selfDestructTime }) {
        const updateFields = [];
        const values = [];
        let valueIndex = 1;

        if (name !== undefined) {
            updateFields.push(`name = $${valueIndex++}`);
            values.push(name);
        }

        if (description !== undefined) {
            updateFields.push(`description = $${valueIndex++}`);
            values.push(description);
        }

        if (price !== undefined) {
            updateFields.push(`price = $${valueIndex++}`);
            values.push(price);
        }

        if (status !== undefined && GADGET_STATUSES.includes(status)) {
            updateFields.push(`status = $${valueIndex++}`);
            values.push(status);
        }

        if (selfDestructTime !== undefined) {
            updateFields.push(`self_destruct_time = $${valueIndex++}`);
            values.push(selfDestructTime);
        }

        values.push(id);

        const { rows } = await pool.query(
            `UPDATE gadgets SET ${updateFields.join(', ')} WHERE id = $${valueIndex} RETURNING *`,
            values
        );

        return rows[0];
    }

    static async delete(id) {
        // Instead of deleting, mark as "Decommissioned" with timestamp
        const { rows } = await pool.query(
            'UPDATE gadgets SET status = $1, decommissioned_at = $2 WHERE id = $3 RETURNING *',
            ['Decommissioned', new Date(), id]
        );
        return rows[0];
    }

    static async triggerSelfDestruct(id, confirmationCode) {
        // In a real application, you would verify the confirmation code
        const { rows } = await pool.query(
            'UPDATE gadgets SET status = $1 WHERE id = $2 RETURNING *',
            ['Destroyed', id]
        );
        return rows[0];
    }

    static async generateSelfDestructCode(id) {
        // Generate a random 8-character alphanumeric code
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let code = '';
        for (let i = 0; i < 8; i++) {
            code += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return code;
    }
}

module.exports = Gadget;