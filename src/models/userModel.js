const pool = require('../config/db');
const bcrypt = require('bcrypt');

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

class User {
    static async findById(id) {
        const { rows } = await pool.query('SELECT id, username, email, role FROM users WHERE id = $1', [id]);
        return rows[0];
    }

    static async findByEmail(email) {
        const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = rows[0];

        if (user) {
            // Add the verification method to the user object
            user.verifyPassword = async function (password) {
                return await bcrypt.compare(password, this.password);
            };
        }

        return user;
    }

    static async create({ username, email, password, role = 'user' }) {
        // Hash the password before storing
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const { rows } = await pool.query(
            'INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, username, email, role',
            [username, email, hashedPassword, role]
        );

        return rows[0];
    }

    static async update(id, { username, email, role }) {
        const updateFields = [];
        const values = [];
        let valueIndex = 1;

        if (username !== undefined) {
            updateFields.push(`username = $${valueIndex++}`);
            values.push(username);
        }

        if (email !== undefined) {
            updateFields.push(`email = $${valueIndex++}`);
            values.push(email);
        }

        if (role !== undefined) {
            updateFields.push(`role = $${valueIndex++}`);
            values.push(role);
        }

        values.push(id);

        const { rows } = await pool.query(
            `UPDATE users SET ${updateFields.join(', ')} WHERE id = $${valueIndex} RETURNING id, username, email, role`,
            values
        );

        return rows[0];
    }

    static async delete(id) {
        await pool.query('DELETE FROM users WHERE id = $1', [id]);
    }
}

module.exports = {
    User,
    Gadget
};