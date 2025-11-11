//Thêm mạng testnet Sepolia
require("@nomiclabs/hardhat-ethers");

module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/OaKkMlQ-d3Xa4Ba5dfb52", // Có thể dùng Infura/Alchemy nếu cần
      accounts: [ "591b72700ba69e47caebae0e3e9e83ab9616cf8f5b82cca45ac043903066de08" ] // thay PRIVATE_KEY_WALLET bằng khóa ví test của bạn (không dùng ví thật)
    }
  }
}
