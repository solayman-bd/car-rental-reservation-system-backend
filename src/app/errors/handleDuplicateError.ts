import { TErrorSources, TGenericErrorResponse } from '../interface/error';

const handleDuplicateError = (err: {
  message: string;
}): TGenericErrorResponse => {
  // Extract value within double quotes using regex
  const match = err.message.match(/"([^"]*)"/);

  // The extracted value will be in the first capturing group
  const extractedMessage = match ? match[1] : 'Duplicate value';

  const errorSources: TErrorSources = [
    {
      path: '',
      message: `${extractedMessage} already exists`,
    },
  ];

  const statusCode = 400;

  return {
    statusCode,
    message: 'Duplicate entry',
    errorSources,
  };
};

export default handleDuplicateError;
