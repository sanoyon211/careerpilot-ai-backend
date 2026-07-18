import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { RecommendationServices } from './recommendation.service';

const getRecommendations = catchAsync(async (req, res) => {
  const userEmail = req.user.email;
  const result = await RecommendationServices.getRecommendations(userEmail);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Recommendations generated successfully',
    data: result,
  });
});

export const RecommendationControllers = {
  getRecommendations,
};
