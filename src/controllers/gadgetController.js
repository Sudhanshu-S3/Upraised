const Gadget = require('../models/gadgetModel');
const pool = require('../config/db');

const getG = async (req, res) => {
    try {
        // Extract status filter if present
        const filters = {};
        if (req.query.status) {
            filters.status = req.query.status;
        }

        // Use model method instead of direct query
        const gadgets = await Gadget.findAll(filters);
        res.status(200).json({
            success: true,
            data: gadgets,
        });
    } catch (error) {
        console.error('Error fetching gadgets:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
}

const addG = async (req, res) => {
    try {
        const { name, description, price } = req.body;
        const newGadget = await Gadget.create({ name, description, price });
        res.status(201).json({
            success: true,
            data: newGadget,
        });
    }
    catch (error) {
        console.error('Error adding gadget:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
}

const updateG = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price } = req.body;
        const updatedGadget = await Gadget.update(id, { name, description, price });
        res.status(200).json({
            success: true,
            data: updatedGadget,
        });
    } catch (error) {
        console.error('Error updating gadget:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
}

const deleteG = async (req, res) => {
    try {
        const { id } = req.params;
        await Gadget.delete(id);
        res.status(204).json({
            success: true,
            message: 'Gadget deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting gadget:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
}

const genSelfDestructG = async (req, res) => {
    try {
        const { id } = req.params;
        const gadget = await Gadget.findById(id);
        if (!gadget) {
            return res.status(404).json({
                success: false,
                message: 'Gadget not found',
            });
        }
        const selfDestructTime = Date.now() + 60000; // 1 minute from now
        await Gadget.update(id, { selfDestructTime });
        res.status(200).json({
            success: true,
            message: 'Self-destruct timer set',
        });
    } catch (error) {
        console.error('Error setting self-destruct timer:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
}

const selfDestructG = async (req, res) => {
    try {
        const { id } = req.params;
        const { code } = req.body;

        const gadget = await Gadget.findById(id);
        if (!gadget) {
            return res.status(404).json({
                success: false,
                message: 'Gadget not found',
            });
        }

        // Use triggerSelfDestruct instead of delete
        await Gadget.triggerSelfDestruct(id, code);
        res.status(200).json({
            success: true,
            message: 'Gadget self-destructed successfully',
        });
    } catch (error) {
        console.error('Error self-destructing gadget:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
}

module.exports = {
    getGadgets: getG,
    addGadget: addG,
    updateGadget: updateG,
    deleteGadget: deleteG,
    selfDestructGadget: selfDestructG,
    generateSelfDestructCode: genSelfDestructG
}