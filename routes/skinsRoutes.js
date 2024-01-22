const express = require('express');
const router = express.Router();
const Skin = require('../models/tiendaSkins');
const User = require('../models/User');
const Inventory = require('../models/Inventory');

//Obtener todas las skins disponibles
router.get('/skins', async (req, res) => {
    try {
        const skins = await Skin.find();
        res.json(skins);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//Comprar una skin
router.post('/comprar', async (req, res) => {
    const { skinId } = req.body;

    try {
        const skin = await Skin.findById(skinId);

        if (!skin) {
            return res.status(400).json({ message: 'Skin no encontrada' });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado'});
        }

        if (user.polymoney < skin.price) {
            return res.status(400).json({ message: 'Saldo insuficiente para comprar la skin' });
        }

        user.polymoney -= skin.price;

        await user.save();

        const inventoryItem = new Inventory({
            user: user,
            skin: skinId,
        });

        await inventoryItem.save();

        res.json({message: 'Compra exitosa', newPolymoney: user.polymoney });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;