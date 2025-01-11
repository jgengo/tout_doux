import { useEffect, useState } from "react";

import AddItem from "@/components/add-item";

const BrainDump = () => {
  const [dumps, setDumps] = useState([]);

  const fetchDumps = async () => {
    const res = await fetch("/api/dumps");
    const data = await res.json();
    setDumps(data);
  };

  useEffect(() => {
    fetchDumps();
  }, []);

  return (
    <div className="flex w-full flex-col px-6 md:max-w-sm">
      <div className={"text-lg font-bold tracking-tight"}>BRAIN DUMP</div>
      <div className="mt-4 space-y-1">
        <div className="flex flex-col">
          {dumps.map((dump, index) => (
            <div
              key={index}
              className="w-full cursor-pointer border-b border-b-gray-300 py-1 text-[0.88rem]"
            >
              <p className="block truncate group-hover:whitespace-normal group-hover:break-words">
                {dump.text}
              </p>
            </div>
          ))}

          <div className="rounded-md border-b border-b-gray-300">
            <AddItem type="dump" onSuccess={fetchDumps} />
          </div>
        </div>
      </div>
    </div>
  );
};

export { BrainDump };
