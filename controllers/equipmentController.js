const queries = require('../db/queries');
const { body, validationResult } = require('express-validator');
exports.equipmentGET = async (req, res) => {
  const equipment = await queries.getEquipment();
  res.render('equipment/equipment', { equipment: equipment });
};

exports.equipmentNewGET = (req, res) => {
  if (req.query.err) {
    return res.render('equipment/new', { err: req.query.err });
  }
  res.render('equipment/new');
};

exports.equipmentNewPOST = [
  body('equipment')
    .isString()
    .withMessage('Please enter valid data')
    .isLength({ max: 20 })
    .withMessage('Data too long'),
  async (req, res, next) => {
    console.log(req.body); // is {}
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors.errors[0].msg);
      return next(errors.errors);
    }
    const { equipment } = req.body;
    console.log(req.body);
    try {
      await queries.insertEquipment(equipment);
      res.redirect('/equipment');
    } catch (err) {
      return next([err]);
    }
  },
  (err, req, res, next) => {
    console.log(err);
    res.redirect(`/equipment/new?err=${err[0].msg}`);
  },
];
