import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { SavedJobServices } from './savedJob.service';

const saveJob = catchAsync(async (req, res) => {
  const userEmail = req.user.email;
  const { jobId } = req.body;
  const result = await SavedJobServices.saveJob(jobId, userEmail);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Job saved successfully',
    data: result,
  });
});

const getMySavedJobs = catchAsync(async (req, res) => {
  const userEmail = req.user.email;
  const result = await SavedJobServices.getMySavedJobs(userEmail);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Saved jobs retrieved successfully',
    data: result,
  });
});

const removeSavedJob = catchAsync(async (req, res) => {
  const { id } = req.params as { id: string };
  const userEmail = req.user.email;
  const result = await SavedJobServices.removeSavedJob(id, userEmail);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Job removed from saved list successfully',
    data: result,
  });
});

export const SavedJobControllers = {
  saveJob,
  getMySavedJobs,
  removeSavedJob,
};
