import {
  ThirdwebNftMedia,
  useAddress,
  useContract,
  useOwnedNFTs,
  Web3Button,
  useMetamask,
  useDisconnect,
} from "@thirdweb-dev/react";
import { PackRewards } from "@thirdweb-dev/sdk/dist/declarations/src/evm/schema";
import type { NextPage } from "next";
import { useState } from "react";
import ERC1155RewardBox from "../components/ERC1155RewardBox";
// import ERC20RewardBox from "../components/ERC20RewardBox";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  const disconnectWallet = useDisconnect();

  const { contract: pack } = useContract(
    "0x18C90599FC60ffa12baa0c098954a87632139C82",
    "pack"
  );

  // @ts-ignore
  const { data: nfts, isLoading } = useOwnedNFTs(pack, address);

  const [openedPackRewards, setOpenedPackRewards] = useState<PackRewards>();

  return (
    <div>
      {address ? (
        <>
          <h1>Open the Dicesia Solidary Egg! 🎁</h1>
          <button
            className={`${styles.mainButton} ${styles.spacerTop}`}
            onClick={disconnectWallet}>Disconnect Wallet</button>
          <p>Your address: {address}</p>
      <div className={styles.container} style={{ marginTop: 0 }}>
        <div className={styles.collectionContainer}>
          {!isLoading ? (
            <div className={styles.nftBoxGrid}>
              {nfts?.map((nft) => (
                <div className={styles.nftBox} key={nft.metadata.id.toString()}>
                  <ThirdwebNftMedia
                    // @ts-ignore
                    metadata={{
                      ...nft.metadata,
                      image: `${nft.metadata.image}`,
                    }}
                    className={styles.nftMedia}
                  />
                  <h3>{nft.metadata.name}</h3>

                  <Web3Button
                    className={`${styles.mainButton} ${styles.spacerBottom}`}
                    contractAddress="0x18C90599FC60ffa12baa0c098954a87632139C82"
                    action={async () => {
                      pack?.interceptor.overrideNextTransaction(() => ({
                        gasLimit: 350000,
                      }));
                      const openedRewards = await pack?.open(0, 1);
                      console.log("Opened rewards:", openedRewards);
                      setOpenedPackRewards(openedRewards);
                    }}
                  >
                    Open
                  </Web3Button>
                </div>
              ))}
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>

      <hr className={styles.divider} />

      <h2>Opened Rewards</h2>

      <div className={styles.centered}>
        {/* {openedPackRewards &&
          openedPackRewards?.erc20Rewards &&
          openedPackRewards?.erc20Rewards?.length > 0 && (
            <>
              <h3>ERC-20 Tokens</h3>
              <div className={styles.nftBoxGrid}>
                {openedPackRewards?.erc20Rewards?.map((reward, i) => (
                  <ERC20RewardBox reward={reward} key={i} />
                ))}
              </div>
            </>
          )} */}

        {openedPackRewards &&
          openedPackRewards?.erc1155Rewards &&
          openedPackRewards?.erc1155Rewards?.length > 0 && (
            <>
              <h3>ERC-1155 Tokens</h3>
              <div className={styles.nftBoxGrid}>
                {openedPackRewards?.erc1155Rewards.map((reward, i) => (
                  <ERC1155RewardBox reward={reward} key={i} />
                ))}
              </div>
            </>
          )}
      </div>
      </>
      ) : (
        <>
        <h1>
          Open the Dicesia Solidary Egg! 🎁</h1>
        <button 
          className={`${styles.mainButton} ${styles.spacerTop}`}
          onClick={connectWithMetamask}>Connect Metamask</button>
        </>
      )}
    </div>
  );
};

export default Home;
