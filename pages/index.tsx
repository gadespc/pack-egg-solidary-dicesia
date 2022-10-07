import {
  ThirdwebNftMedia,
  useAddress,
  useDisconnect,
  useMetamask,
  useOwnedNFTs,
  usePack,
} from "@thirdweb-dev/react";
import { PackRewards } from "@thirdweb-dev/sdk/dist/src/schema";
import type { NextPage } from "next";
import { useState } from "react";
import ERC1155RewardBox from "../components/ERC1155RewardBox";
// import ERC20RewardBox from "../components/ERC20RewardBox";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  const disconnectWallet = useDisconnect();

  const pack = usePack("0x53d483C557F9DF11fa3a05994447963D41d1c8C8");

  const { data: nfts, isLoading } = useOwnedNFTs(pack, address);

  const [openedPackRewards, setOpenedPackRewards] = useState<PackRewards>();

  async function open() {
    const openedRewards = await pack?.open(0, 1);
    console.log("Opened rewards:", openedRewards);
    setOpenedPackRewards(openedRewards);
  }

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
                    <div
                      className={styles.nftBox}
                      key={nft.metadata.id.toString()}
                    >
                      <ThirdwebNftMedia
                        // @ts-ignore
                        metadata={{
                          ...nft.metadata,
                          image: `${nft.metadata.image}`,
                        }}
                        className={styles.nftMedia}
                      />
                      <h3>{nft.metadata.name}</h3>

                      <button
                        className={`${styles.mainButton} ${styles.spacerBottom}`}
                        onClick={() => open()}
                      >
                        Open
                      </button>
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
                <h3>Congratulations, these are your NFTs - You can see in <a href="https://opensea.io/account" target="_blank" rel="noopener noreferrer"> Opensea</a></h3>
                <p>Or you can go to <a href="https://dicesia.com/"> Dicesia</a> or <a href="https://discord.com/invite/2jZtuwZT5c"> Discord</a></p>
                <div className={styles.nftBoxGrid}>
                  {openedPackRewards?.erc1155Rewards.map((reward, i) => (
                    <ERC1155RewardBox reward={reward} key={i} />
                  ))}
                </div>
              </>
            )}
        </>
      ) : (
        <>
        <h1>Open the Dicesia Solidary Egg! 🎁</h1>
        <button 
          className={`${styles.mainButton} ${styles.spacerTop}`}
          onClick={connectWithMetamask}>Connect Metamask</button>
        </>
      )}
    </div>
  );
};

export default Home;
