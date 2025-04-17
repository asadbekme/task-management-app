import { Header } from "./header";
import { StorageIndicator } from "./storage-indicator";

function RetryComponent({ error }: { error: string | null }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
          <p className="text-amber-600 mb-4">{error}</p>
          <p className="mb-4">
            You can still use the app with local data, or try again later.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
      <StorageIndicator />
    </div>
  );
}

export default RetryComponent;
