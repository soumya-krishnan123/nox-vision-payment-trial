const planService = require('../services/planServices');



exports.addPlan = async (req, res, next) => {
  try {
    const plan = await planService.addPlan(req.body);
    if (!plan) {
      return res.status(400).json({
        status: false,
        status_code: 400,
        message: 'Failed to add plan'
      });
    }
    res.status(200).json({
      status: true,
      status_code: 200,
      message: 'Plan added successfully',
      data: plan
    });
  } catch (error) {
    next(error);
  }
};

exports.getPlanById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const plan = await planService.getPlanById(id);
      res.status(200).json({
        status: true,
        status_code: 200,
        message: 'Plan fetched successfully',
        data:plan
      });
  } catch (error) {
    next(error);
  }
};
exports.updatePlan = async (req, res, next) => {
  try {
    const { id } = req.params;
    const plan = await planService.updatePlan(id, req.body);
    res.status(200).json({
      status: true,
      status_code: 200,
      message: 'Plan updated successfully',
      data: plan
    });
  } catch (error) {
    next(error);
  }
};  


exports.deletePlan = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await planService.deletePlan(id);
    res.status(200).json({
      status: true,
      status_code: 200,
      message: 'Plan deleted successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};
exports.getAllPlans = async (req, res, next) => {
  try {
    const plans = await planService.getAllPlans();
    res.status(200).json({
      status: true,
      status_code: 200,
      data: plans
    });
  } catch (error) {
    next(error);
  }
};
