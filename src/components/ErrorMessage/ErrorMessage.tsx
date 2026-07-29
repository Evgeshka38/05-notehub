import css from './ErrorMessage.module.css';

interface ErrorMessageProps {
  message?: string;
}

const ErrorMessage = ({
  message = 'Something went wrong. Please try again.',
}: ErrorMessageProps) => {
  return (
    <p className={css.error} role="alert">
      {message}
    </p>
  );
};

export default ErrorMessage;