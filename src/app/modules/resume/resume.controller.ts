import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ResumeServices } from './resume.service';

const uploadAndParseResume = catchAsync(async (req, res) => {
  const userEmail = req.user.email;
  const { fileUrl } = req.body;
  const result = await ResumeServices.processAndSaveResume(fileUrl, userEmail);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Resume parsed and saved successfully',
    data: result,
  });
});

const getMyResume = catchAsync(async (req, res) => {
  const userEmail = req.user.email;
  const result = await ResumeServices.getMyResumeFromDB(userEmail);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Resume retrieved successfully',
    data: result,
  });
});

export const ResumeControllers = {
  uploadAndParseResume,
  getMyResume,
};
