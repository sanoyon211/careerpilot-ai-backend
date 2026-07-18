import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { JobServices } from './job.service';

const createJob = catchAsync(async (req, res) => {
  const employerEmail = req.user.email as string;
  const result = await JobServices.createJobIntoDB(req.body, employerEmail);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Job posted successfully',
    data: result,
  });
});

const getAllJobs = catchAsync(async (req, res) => {
  const result = await JobServices.getAllJobsFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Jobs retrieved successfully',
    data: result,
  });
});

const getEmployerJobs = catchAsync(async (req, res) => {
  const employerEmail = req.user.email as string;
  const result = await JobServices.getEmployerJobsFromDB(employerEmail);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Employer jobs retrieved successfully',
    data: result,
  });
});

const getJobById = catchAsync(async (req, res) => {
  const result = await JobServices.getJobByIdFromDB(req.params.id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Job retrieved successfully',
    data: result,
  });
});

export const JobControllers = {
  createJob,
  getAllJobs,
  getEmployerJobs,
  getJobById,
};
