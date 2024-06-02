import { useAccount } from "wagmi";
import { useCapabilities, useWriteContracts } from "wagmi/experimental";
import { useMemo, useState } from "react";
import { CallStatus } from "./CallStatus";
import { myNFTABI, myNFTAddress } from "@/ABIs/myNFT";

export function TransactWithPaymaster() {
  const account = useAccount();
  const [id, setId] = useState<string | undefined>(undefined);
  const { writeContracts } = useWriteContracts({
    mutation: { onSuccess: (id) => setId(id) }, 
  });
  const { data: availableCapabilities } = useCapabilities({
    account: account.address,
  });
  const capabilities = useMemo(() => {
    if (!availableCapabilities || !account.chainId) return;
    const capabilitiesForChain = availableCapabilities[account.chainId];
    if (
      capabilitiesForChain["paymasterService"] &&
      capabilitiesForChain["paymasterService"].supported
    ) {
      return {
        paymasterService: {
          url: process.env.PAYMASTER_PROXY_SERVER_URL || `${document.location.origin}/api/paymaster`,
        },
      };
    }
  }, [availableCapabilities]);

  return (
    <div>
      <h2>Transact With Paymaster</h2>
      <div>
        <p style={{
          padding: "10px",
        }}
        >
          This button will mint an NFT for your account. It will be minted using the paymaster service.
        </p>
        <button
          onClick={() => {
            writeContracts({
              contracts: [
                {
                  address: myNFTAddress,
                  abi: myNFTABI,
                  functionName: "mintNFT",
                  args: [account.address],
                },
              ],
              capabilities,
            });
          }}
        >
          Mint
        </button>
        {id && <CallStatus id={id} />}

        <p style={{
          padding: "10px",
        }}
        >
          This button will mint Multiple NFT for your account. It will be minted using the paymaster service.
        </p>
        <button
          onClick={() => {
            writeContracts({
              contracts: [
                {
                  address: myNFTAddress,
                  abi: myNFTABI,
                  functionName: "batchMintNFT",
                  args: [account.address,10],
                },
              ],
              capabilities,
            });
          }}
        >
          Mint Multiple
        </button>
        {id && <CallStatus id={id} />}

        <p style={{
          padding: "10px",
        }}
        >
          This button will update the Name of the NFT for your account. It will be minted using the paymaster service.
        </p>
        <button
          onClick={() => {
            writeContracts({
              contracts: [
                {
                  address: myNFTAddress,
                  abi: myNFTABI,
                  functionName: "updateSvg",
                  args: [0,"babluemotes"],
                },
              ],
              capabilities,
            });
          }}
        >
          Update Name
        </button>
      </div>

    </div>
  );
}
