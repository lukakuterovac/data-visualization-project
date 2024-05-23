const NotFound = () => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <div className="border-2 border-red-500 p-3 rounded-md">
        <h1 className="text-3xl text-red-500">ERROR</h1>
        <p>This page could not be found.</p>
      </div>
    </div>
  );
};

export default NotFound;
