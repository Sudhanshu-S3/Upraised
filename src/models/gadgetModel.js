const pool = require('../config/db');

class Gadget {
    static async findById(id) {
        const { rows } = await pool.query('SELECT * FROM gadgets WHERE id = $1', [id]);
        return rows[0];
    }

    static async create({ name, description, price }) {
        const { rows } = await pool.query(
            'INSERT INTO gadgets (name, description, price) VALUES ($1, $2, $3) RETURNING *',
            [name, description, price]
        );
        return rows[0];
    }

    static async update(id, { name, description, price, selfDestructTime }) {
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
        await pool.query('DELETE FROM gadgets WHERE id = $1', [id]);
    }
}

module.exports = Gadget;