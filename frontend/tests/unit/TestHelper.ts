function windowEthereum(
  walletAddr = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  signedMsg = "0xa2162955fbfbac44ad895441a3501465861435d6615053a64fc9622d98061f1556e47c6655d0ea02df00ed6f6050298eea381b4c46f8148ecb617b32695bdc451c"
) {
  return {
    isMetaMask: true,
    request: async (request: { method: string, params?: Array<unknown> }) => {
      // console.log(request.method); to see the different requests made by ethers
      if (["eth_accounts", "eth_requestAccounts"].includes(request.method)) {
        return [walletAddr]
      } else if (["personal_sign"].includes(request.method)) {
        return signedMsg;
      }
      throw Error(`Unknown request: ${request.method}`);
    },
  };
}

// window.ethereum = WINDOW_ETHEREUM;

function mockToasted() {
  return {
    $toasted: {
      show: jest.fn(),
      global: {
        app_error: jest.fn(),
        app_success: jest.fn(),
      },
    },
  };
}

export { windowEthereum, mockToasted };
