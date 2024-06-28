import { TErrorMessages, TGenericErrorResponse } from '../interface/error';

const handleDuplicateError = (err: {
  message: string;
}): TGenericErrorResponse => {
  // Extract value within double quotes using regex
  const match = err.message.match(/"([^"]*)"/);

  // The extracted value will be in the first capturing group
  const extractedMessage = match ? match[1] : 'Duplicate value';

  const errorMessages: TErrorMessages = [
    {
      path: '',
      message: `${extractedMessage} already exists`,
    },
  ];

  const statusCode = 400;

  return {
    statusCode,
    message: 'Duplicate entry',
    errorMessages,
  };
};

export default handleDuplicateError;
