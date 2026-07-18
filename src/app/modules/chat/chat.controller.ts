import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ChatServices } from './chat.service';

const sendMessage = catchAsync(async (req, res) => {
  const userEmail = req.user.email;
  const { history } = req.body;
  const result = await ChatServices.processChatMessage(history, userEmail);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'AI replied successfully',
    data: result,
  });
});

export const ChatControllers = {
  sendMessage,
};
