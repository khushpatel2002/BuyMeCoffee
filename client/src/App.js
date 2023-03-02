import "./App.css";
import abi from "./contract/Fundme.json";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Fund from "./components/Fund";
import Memos from "./components/Memos";

function App() {
  const [state, setState] = useState({
    provider: null,
    signer: null,
    contract: null,
  });

  const [account, setAccount] = useState("None");

  useEffect(() => {
    const connectWallet = async () => {
      const contractAddress = "0x6a73e79985cb6f20b7360ab6e4a0620019e1e8ba";
      const contractABI = abi.abi;
      try {
        const { ethereum } = window;

        if (ethereum) {
          const account = await ethereum.request({
            method: "eth_requestAccounts",
          });

          window.ethereum.on("chainChanged", () => {
            window.location.reload();
          });

          window.ethereum.on("accountsChanged", () => {
            window.location.reload();
          });

          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const contract = new ethers.Contract(
            contractAddress,
            contractABI,
            signer
          );
          setAccount(account);
          setState({ provider, signer, contract });
        } else {
          alert("Please install metamask");
        }
      } catch (error) {
        console.log(error);
      }
    };
    connectWallet();
  }, []);

  console.log(state);
  return (
    <div style={{ backgroundColor: "#EFEFEF", height: "100%" }}>
      <img
        src="https://cdn.buymeacoffee.com/assets/img/home-page-v3/bmc-new-logo.png"
        className="img-fluid"
        alt=".."
        height="50%"
        width="50%"
      />
      <p
        class="text-muted lead "
        style={{ marginTop: "10px", marginLeft: "5px" }}
      >
        <small>Connected Account - {account}</small>
      </p>
      <div className="container">
        <Fund state={state} />
        <Memos state={state} />
      </div>
    </div>
  );
}

export default App;
