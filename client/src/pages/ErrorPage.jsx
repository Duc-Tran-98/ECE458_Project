const ErrorPage = (props) => {
  return (
    <div className="d-flex justify-content-center">
      <h1 className="display-4 mt-5">
        <strong>{props.message}</strong>
      </h1>
    </div>
  );
};

export default ErrorPage;
