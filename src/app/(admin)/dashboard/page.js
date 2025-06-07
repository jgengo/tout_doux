import { getUsers } from "@/actions/users";

const Dashboard = async () => {
  const users = await getUsers();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 font-[family-name:var(--font-ibm-plex-sans)] text-3xl font-bold text-gray-900">
          Dashboard
        </h1>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Users Section */}
          <div className="overflow-hidden bg-white shadow-sm ring-1 ring-gray-200">
            <div className="border-b border-gray-200 bg-white px-6 py-2">
              <h2 className="font-[family-name:var(--font-ibm-plex-sans)] text-lg font-semibold text-gray-900">
                Users
              </h2>
            </div>
            <div className="divide-y divide-gray-200 px-4 py-2">
              {users.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-200" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-gray-900">
                          {user.name}
                        </p>
                        <p className="truncate text-sm text-gray-500">
                          {user.email}
                        </p>
                        <p className="truncate text-xs text-gray-500">
                          {user.tasks?.length || 0} tasks
                        </p>
                      </div>
                    </div>
                  </div>
                  {user.isAdmin && (
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                      Admin
                    </span>
                  )}
                </div>
              ))}
              {users.length === 0 && (
                <p className="py-4 text-center text-sm text-gray-500">
                  No users found
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
