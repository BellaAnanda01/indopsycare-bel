import React, { useState, useEffect } from 'react';
import Xendit from 'xendit-node';

function App() {
  const [transactions, setTransactions] = useState([]);

  const x = new Xendit({ secretKey: 'xnd_production_gDJXGW42n3Ho7Y9HXhu6BlJjaI89Y5H8lct6zYpQYB0qIVaAOHZg7NhI81MOl' });
  
  useEffect(() => {
    const fetchTransactions = async () => {
      const oneMinuteAgo = new Date(Date.now() - 60 * 1000).toISOString();

      try {
        const data = await x.Transaction.getAllTransactions({statuses: ['SUCCESS'], limit: 5,
          params: {
            'created[gte]': oneMinuteAgo
          }
        });
        setTransactions(data.data);
        console.log(data.data)
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    fetchTransactions();

    const interval = setInterval(() => {
      fetchTransactions();
    }, 1 * 60 * 1000); // Fetch transactions every 1 minute

    return () => clearInterval(interval);
  // eslint-disable-next-line
  }, []);

  // const options = { 
  //   day: '2-digit', 
  //   month: '2-digit', 
  //   year: 'numeric' 
  // };

  return (
    <div>
      <h2>Transactions</h2>
      <table>
        <thead>
          <tr>
            <th>Settlement Status</th>
            <th>Id</th>
            <th>ReferenceId</th>
            <th>Created</th>
            <th>Updated</th>
            <th>Amount</th>
            {/* Add more table headers as needed */}
          </tr>
        </thead>
        <tbody>
        {transactions.map(transaction => (
            <tr key={transaction.id}>
              <td>{transaction.settlementStatus}</td>
              <td>{transaction.id}</td>
              <td>{transaction.referenceId}</td>
              <td>{transaction.created.toISOString()}</td>
              <td>{transaction.updated.toISOString()}</td>
              <td>{transaction.amount}</td>
              {/* Add more table cells for other transaction properties */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
