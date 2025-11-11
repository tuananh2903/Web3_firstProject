import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractABI, contractAddress } from "../utils/constants";

export const TransactionContext = React.createContext();

export const TransactionsProvider = ({ children }) => {
  const [formData, setformData] = useState({ addressTo: "", amount: "", keyword: "", message: "" });
  const [currentAccount, setCurrentAccount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [transactionCount, setTransactionCount] = useState(localStorage.getItem("transactionCount"));
  const [transactions, setTransactions] = useState([]);

  // Helper: Lấy instance contract
  const createEthereumContract = async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      alert("Bạn cần cài MetaMask!");
      throw new Error("No ethereum object");
    }
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const transactionsContract = new ethers.Contract(contractAddress, contractABI, signer);
    return transactionsContract;
  };

  // Xử lý nhập form
  const handleChange = (e, name) => {
    setformData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

  // Lấy tất cả transaction
  const getAllTransactions = async () => {
    try {
      if (!window.ethereum) return alert("Bạn cần cài MetaMask!");
      const transactionsContract = await createEthereumContract();
      const availableTransactions = await transactionsContract.getAllTransactions();
      // THÊM LOG ở đây ↓
      availableTransactions.forEach((transaction, idx) => {
        console.log(`Transaction #${idx}: timestamp =`, transaction.timestamp, "typeof:", typeof transaction.timestamp);
      });
      const structuredTransactions = availableTransactions.map((transaction) => ({
        addressTo: transaction.receiver,
        addressFrom: transaction.sender,
        timestamp: new Date(Number(transaction.timestamp) * 1000).toLocaleString(),
        message: transaction.message,
        keyword: transaction.keyword,
        amount: Number(transaction.amount) / (10 ** 18),
      }));
      console.log("Danh sách transaction:", structuredTransactions);
      setTransactions(structuredTransactions);
    } catch (error) {
      console.log("Lỗi khi getAllTransactions:", error);
    }
  };

  // Kiểm tra ví đã connect chưa
  const checkIfWalletIsConnect = async () => {
    try {
      if (!window.ethereum) return alert("Bạn cần cài MetaMask!");
      const accounts = await window.ethereum.request({ method: "eth_accounts" });
      if (accounts.length) {
        setCurrentAccount(accounts[0]);
        await getAllTransactions();
      } else {
        setCurrentAccount("");
        console.log("No accounts found");
      }
    } catch (error) {
      console.log("Lỗi kiểm tra connect ví:", error);
    }
  };

  // Kiểm tra số lượng transactions (giúp reload khi gửi thành công)
  const checkIfTransactionsExists = async () => {
    try {
      if (!window.ethereum) return;
      const transactionsContract = await createEthereumContract();
      const currentTransactionCount = await transactionsContract.getTransactionCount();
      window.localStorage.setItem("transactionCount", currentTransactionCount);
      setTransactionCount(currentTransactionCount);
    } catch (error) {
      console.log("Không lấy được số lượng transaction:", error);
    }
  };

  // Nút connect ví từ UI
  const connectWallet = async () => {
    try {
      if (!window.ethereum) return alert("Bạn cần cài MetaMask!");
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setCurrentAccount(accounts[0]);
      await getAllTransactions();
    } catch (error) {
      console.log("Lỗi connectWallet:", error);
    }
  };

  // Gửi transaction từ form
  const sendTransaction = async () => {
    try {
      if (!window.ethereum) return alert("Bạn cần cài MetaMask!");
      const { addressTo, amount, keyword, message } = formData;
      const transactionsContract = await createEthereumContract();
      const parsedAmount = ethers.parseEther(amount);

      // Gửi ETH qua Metamask
      await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [{
          from: currentAccount,
          to: addressTo,
          gas: "0x5208", // 21000 GWEI
          value: parsedAmount.toString(16),
        }],
      });

      // Lưu transaction vào contract
      const transactionHash = await transactionsContract.addToBlockchain(addressTo, parsedAmount, message, keyword);

      setIsLoading(true);
      console.log(`Loading - ${transactionHash.hash}`);
      await transactionHash.wait();
      console.log(`Success - ${transactionHash.hash}`);
      setIsLoading(false);

      // Cập nhật lại số lượng transaction và reload list
      await checkIfTransactionsExists();
      await getAllTransactions();
    } catch (error) {
      console.log("Lỗi sendTransaction:", error);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnect();
    checkIfTransactionsExists();
    getAllTransactions();
    // Nếu đổi network hoặc reload transactionCount -> load lại
  }, [transactionCount]);

  return (
    <TransactionContext.Provider
      value={{
        transactionCount,
        connectWallet,
        transactions,
        currentAccount,
        isLoading,
        sendTransaction,
        handleChange,
        formData,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
