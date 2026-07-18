import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ApplicationServices } from './application.service';

const createApplication = catchAsync(async (req, res) => {
  const applicantEmail = req.user.email;
  const result = await ApplicationServices.createApplicationIntoDB(req.body, applicantEmail);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Application submitted successfully',
    data: result,
  });
});

const getMyApplications = catchAsync(async (req, res) => {
  const applicantEmail = req.user.email;
  const result = await ApplicationServices.getMyApplicationsFromDB(applicantEmail);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Applications retrieved successfully',
    data: result,
  });
});

const getJobApplications = catchAsync(async (req, res) => {
  const employerEmail = req.user.email;
  const result = await ApplicationServices.getJobApplicationsFromDB(req.params.jobId, employerEmail);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Job applications retrieved successfully',
    data: result,
  });
});

const updateApplicationStatus = catchAsync(async (req, res) => {
  const employerEmail = req.user.email;
  const { status } = req.body;
  const result = await ApplicationServices.updateApplicationStatusInDB(req.params.id, status, employerEmail);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Application status updated successfully',
    data: result,
  });
});

export const ApplicationControllers = {
  createApplication,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
};
