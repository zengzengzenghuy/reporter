import {
  createPublicClient,
  http,
  createWalletClient,
  parseAbiItem,
  publicActions,
} from "viem";
import { sepolia, baseSepolia } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import "dotenv/config";

const main = async () => {
  const sepoliaClient = createWalletClient({
    chain: sepolia,
    transport: http(process.env.RPC_SEPOLIA),
  }).extend(publicActions);

  const baseSepClient = createWalletClient({
    chain: baseSepolia,
    transport: http(process.env.RPC_BASE_SEPOLIA),
  }).extend(publicActions);

  const account = privateKeyToAccount(process.env.PRIVATE_KEY);
  const baseSepoliaLZAdapter = "0xbECDb392Ad63F003489cADdF17c6aa96218116ac";
  const sepoliaLZReporter = "0x5574Af502113a5cc164185f0d9091bC352f1D1ec";

  const blockNumber = await sepoliaClient.getBlockNumber();

  const { request } = await sepoliaClient.simulateContract({
    account,
    address: sepoliaLZReporter,
    abi: [
      parseAbiItem(
        "function dispatchBlocks(uint256 targetChainId, address adapter,uint256[] memory blockNumbers) external payable returns (bytes32)"
      ),
    ],
    functionName: "dispatchBlocks",
    args: [baseSepClient.chain.id, baseSepoliaLZAdapter, [blockNumber - 1n]],
  });

  let dispatchMsgTx = await sepoliaClient.writeContract(request);
  console.log(
    `Dispatch tx for block number ${blockNumber - 1n} : ${dispatchMsgTx}`
  );
};

setInterval(main, parseInt(process.env.INTERVAL));

// Run immediately on start
main();
