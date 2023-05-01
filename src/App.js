import { Alchemy, Network } from "alchemy-sdk";
import { useEffect, useState } from "react";
import React from "react";
import styled from "styled-components";

import "./App.css";

// Refer to the README doc for more information about using API
// keys in client-side code. You should never do this in production
// level code.
const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

// In this week's lessons we used ethers.js. Here we are using the
// Alchemy SDK is an umbrella library with several different packages.
//
// You can read more about the packages here:
//   https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
const alchemy = new Alchemy(settings);

function App() {
  // const [blockNumber, setBlockNumber] = useState();
  // const [block, setBlock] = useState();
  // const [blockTime, setBlockTime] = useState();
  const [latestBlockNumbers, setLatestBlockNumbers] = useState([]);
  const [enabled, setEnabled] = useState(true);
  const [selectedBlock, setSelectedBlock] = useState();
  const [transactions, setTransactions] = useState([]);

  const Table = styled.table`
    border-collapse: collapse;
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
  `;

  const Th = styled.th`
    background-color: #f2f2f2;
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  `;

  const Td = styled.td`
    border: 1px solid #ddd;
    padding: 8px;
  `;

  useEffect(() => {
    async function getBlockNumber() {
      const latestBlock = await alchemy.core.getBlockNumber();
      const latestBlocks = [];
      for (let i = 0; i < 5; i++) {
        const blockNumber = latestBlock - i;
        const block = await alchemy.core.getBlock(blockNumber);
        latestBlocks.push(block);
      }

      setLatestBlockNumbers(latestBlocks);
    }

    getBlockNumber();
  });

  const getBlockInfo = (block) => {
    setEnabled(false);
    setSelectedBlock(block);
    getBlockTransactions(block.hash);
  };

  async function getBlockTransactions(selectedBlock) {
    const blockTransactions = [];
    const block = await alchemy.core.getBlockWithTransactions(selectedBlock);

    for (let i = 0; i < block.transactions.length; i++) {
      const hash = block.transactions[i].hash;
      blockTransactions.push(hash);
    }
    setTransactions(blockTransactions);
  }

  return (
    <div className="App">
      <div>
        <h1>ETHEREUM BLOCK EXPLORER!</h1>
        <br />
        <br />
        <br />
        {enabled === true ? (
          <Table>
            <thead>
              <tr>
                <Th>Block</Th>
                <Th>Hash</Th>
                <Th>TimeStamp</Th>
              </tr>
            </thead>
            <tbody>
              {latestBlockNumbers.map((block) => {
                return (
                  <tr key={block.number}>
                    <Td>
                      <button onClick={() => getBlockInfo(block)}>
                        {block.number}
                      </button>
                    </Td>
                    <Td>{block.hash}</Td>
                    <Td>{new Date(block.timestamp * 1000).toLocaleString()}</Td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Transactions Hash</Th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((hash, i) => {
                return (
                  <tr key={i}>
                    <Td>{hash} </Td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )}
      </div>
    </div>
  );
}

export default App;
