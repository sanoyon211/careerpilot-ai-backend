import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { DashboardServices } from './dashboard.service';

const getJobSeekerStats = catchAsync(async (req, res) => {
  const userEmail = req.user.email;
  const result = await DashboardServices.getJobSeekerStats(userEmail);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Dashboard stats retrieved successfully',
    data: result,
  });
});

const getEmployerStats = catchAsync(async (req, res) => {
  const userEmail = req.user.email;
  const result = await DashboardServices.getEmployerStats(userEmail);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Dashboard stats retrieved successfully',
    data: result,
  });
});

export const DashboardControllers = {
  getJobSeekerStats,
  getEmployerStats,
};
