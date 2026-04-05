import AccessCode from '../models/AccessCode.js';

const generateCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

export const createAccessCode = async (req, res, next) => {
  try {
    const { type, maxUses, expiresInDays, maxRecipes, features } = req.body;

    let expiresAt;
    if (expiresInDays) {
      expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + expiresInDays);
    }

    let code = generateCode();
    let exists = await AccessCode.findOne({ code });
    while (exists) {
      code = generateCode();
      exists = await AccessCode.findOne({ code });
    }

    const accessCode = await AccessCode.create({
      code,
      type: type || 'trial',
      maxUses: maxUses || 1,
      expiresAt,
      createdBy: req.user._id,
      maxRecipes: maxRecipes || 10,
      features: features || []
    });

    res.status(201).json(accessCode);
  } catch (error) {
    next(error);
  }
};

export const validateAccessCode = async (req, res, next) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ message: 'Access code is required' });
    }

    const accessCode = await AccessCode.findOne({ 
      code: code.toUpperCase(),
      isActive: true 
    });

    if (!accessCode) {
      return res.status(400).json({ message: 'Invalid access code' });
    }

    if (accessCode.expiresAt && new Date(accessCode.expiresAt) < new Date()) {
      return res.status(400).json({ message: 'Access code has expired' });
    }

    if (accessCode.usedBy.length >= accessCode.maxUses) {
      return res.status(400).json({ message: 'Access code usage limit reached' });
    }

    res.json({
      valid: true,
      type: accessCode.type,
      maxRecipes: accessCode.maxRecipes,
      features: accessCode.features
    });
  } catch (error) {
    next(error);
  }
};

export const getAccessCodes = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;

    const codes = await AccessCode.find({ createdBy: req.user._id })
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await AccessCode.countDocuments({ createdBy: req.user._id });

    res.json({
      codes,
      page,
      pages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAccessCode = async (req, res, next) => {
  try {
    const code = await AccessCode.findById(req.params.id);

    if (!code) {
      return res.status(404).json({ message: 'Access code not found' });
    }

    if (code.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await code.deleteOne();
    res.json({ message: 'Access code deleted' });
  } catch (error) {
    next(error);
  }
};

export const updateAccessCode = async (req, res, next) => {
  try {
    const { isActive, maxUses } = req.body;
    const code = await AccessCode.findById(req.params.id);

    if (!code) {
      return res.status(404).json({ message: 'Access code not found' });
    }

    if (code.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (isActive !== undefined) code.isActive = isActive;
    if (maxUses !== undefined) code.maxUses = maxUses;

    await code.save();
    res.json(code);
  } catch (error) {
    next(error);
  }
};