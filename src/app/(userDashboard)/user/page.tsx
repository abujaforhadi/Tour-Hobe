import LoaderWrapper from "@/lib/LoaderWrapper";



const UserDashboardPage = () => {
  return (
    <LoaderWrapper>
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white max-w-lg w-full p-8 rounded-xl shadow-md border border-gray-200 text-center">
        
        <h1 className="text-3xl font-semibold text-gray-800">
          Welcome to <span className='text-primary'>User Dashboard</span>
        </h1>

        <p className="text-gray-500 mt-3 text-sm">
          We are glad to have you here. Explore your travel activities and updates anytime.
        </p>

        <div className="mt-6">
          <span className="text-4xl font-bold text-primary">👋</span>
        </div>

      </div>
    </div>
    </LoaderWrapper>
  );
};

export default UserDashboardPage;
