const express = require('express');
const router = express.Router();
const service = require('../Services/user.service');
const middleware = require('../Middleware/auth');

// Mock routes
router.get('/', async (req, res) => {
    const employees = await service.getAllEmployees();
    res.send(employees);
});

router.post('/', async (req, res) => {
    await service.addOrEditEmployee(req.body);
    res.status(201).send('created successfully.');
});

router.put('/:id', async (req, res) => {
    const affectedRows = await service.addOrEditEmployee(req.body, req.params.id);
    if (affectedRows == 0) {
        res.status(404).json('no record with given id : ' + req.params.id);
    } else {
        res.send('updated successfully.');
    }
});

router.delete('/:id', async (req, res) => {
    const affectedRows = await service.deleteEmployee(req.params.id);
    if (affectedRows == 0) {
        res.status(404).json('no record with given id : ' + req.params.id);
    } else {
        res.send('deleted successfully.')
    }
})

module.exports = router;
