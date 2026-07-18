import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AIServices } from './ai.service';

const generateCoverLetter = catchAsync(async (req, res) => {
  const result = await AIServices.generateCoverLetter(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cover letter generated successfully',
    data: result,
  });
});

export const AIControllers = {
  generateCoverLetter,
};