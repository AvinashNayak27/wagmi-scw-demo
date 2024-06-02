import { useCallsStatus } from "wagmi/experimental";
import { useEffect } from "react";

export function CallStatus({ id }: { id: string }) {
  const { data: callsStatus } = useCallsStatus({
    id,
    query: {
      refetchInterval: (data) =>
        data.state.data?.status === "CONFIRMED" ? false : 1000,
    },
  });

  useEffect(() => {
    console.log("callsStatus", callsStatus);
  }, [callsStatus]);

  return (
    <div>
      Status: {callsStatus?.status || "loading"}
      {callsStatus?.status === "CONFIRMED" && (
        <div>
          <div>
            Transaction Hash: {callsStatus?.receipts?.[0]?.transactionHash}
          </div>
        </div>
      )}
    </div>
  );
}
