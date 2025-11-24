// Step 1: Import Express (the web framework)
import express from 'express';
import fs from 'fs';

// Step 2: Create an Express app
const app = express();

// Step 3: Tell Express to understand JSON data
app.use(express.json());

// Step 4: Where to store our data
const DATA_FILE = './data.json';

// Step 5: Helper function to read transactions from file
function getTransactions() {
    if (!fs.existsSync(DATA_FILE)) {
        return [];
    }
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(data);
}

// Step 6: Helper function to save transactions to file
function saveTransactions(transactions) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(transactions, null, 2));
}

// Step 7: Serve the HTML page when someone visits the website
app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Finance Tracker</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 15px;
            padding: 30px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
        }
        
        h1 {
            color: #667eea;
            margin-bottom: 30px;
            text-align: center;
        }
        
        .summary {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
            margin-bottom: 30px;
        }
        
        .summary-card {
            padding: 20px;
            border-radius: 10px;
            text-align: center;
        }
        
        .summary-card.income {
            background: #d4edda;
            border: 2px solid #28a745;
        }
        
        .summary-card.expense {
            background: #f8d7da;
            border: 2px solid #dc3545;
        }
        
        .summary-card.balance {
            background: #d1ecf1;
            border: 2px solid #17a2b8;
        }
        
        .summary-card h3 {
            font-size: 14px;
            margin-bottom: 10px;
            color: #666;
        }
        
        .summary-card p {
            font-size: 24px;
            font-weight: bold;
        }
        
        .form-section {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 30px;
        }
        
        .form-group {
            margin-bottom: 15px;
        }
        
        label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
            color: #333;
        }
        
        input, select {
            width: 100%;
            padding: 10px;
            border: 2px solid #ddd;
            border-radius: 5px;
            font-size: 14px;
        }
        
        input:focus, select:focus {
            outline: none;
            border-color: #667eea;
        }
        
        button {
            width: 100%;
            padding: 12px;
            background: #667eea;
            color: white;
            border: none;
            border-radius: 5px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            transition: background 0.3s;
        }
        
        button:hover {
            background: #5568d3;
        }
        
        .transactions {
            margin-top: 20px;
        }
        
        .transaction {
            background: white;
            border: 2px solid #ddd;
            padding: 15px;
            margin-bottom: 10px;
            border-radius: 8px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .transaction.income {
            border-left: 4px solid #28a745;
        }
        
        .transaction.expense {
            border-left: 4px solid #dc3545;
        }
        
        .transaction-info {
            flex: 1;
        }
        
        .transaction-desc {
            font-weight: bold;
            margin-bottom: 5px;
        }
        
        .transaction-category {
            color: #666;
            font-size: 12px;
        }
        
        .transaction-amount {
            font-size: 20px;
            font-weight: bold;
            margin-right: 15px;
        }
        
        .transaction-amount.income {
            color: #28a745;
        }
        
        .transaction-amount.expense {
            color: #dc3545;
        }
        
        .delete-btn {
            padding: 8px 15px;
            background: #dc3545;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 12px;
        }
        
        .delete-btn:hover {
            background: #c82333;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>💰 Personal Finance Tracker</h1>
        
        <div class="summary">
            <div class="summary-card income">
                <h3>Total Income</h3>
                <p id="total-income">₹0</p>
            </div>
            <div class="summary-card expense">
                <h3>Total Expenses</h3>
                <p id="total-expenses">₹0</p>
            </div>
            <div class="summary-card balance">
                <h3>Balance</h3>
                <p id="balance">₹0</p>
            </div>
        </div>
        
        <div class="form-section">
            <h2 style="margin-bottom: 15px;">Add Transaction</h2>
            <form id="transaction-form">
                <div class="form-group">
                    <label>Type</label>
                    <select id="type" required>
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label>Description</label>
                    <input type="text" id="description" placeholder="e.g., Salary, Groceries" required>
                </div>
                
                <div class="form-group">
                    <label>Amount (₹)</label>
                    <input type="number" id="amount" placeholder="e.g., 5000" required min="0" step="0.01">
                </div>
                
                <div class="form-group">
                    <label>Category</label>
                    <select id="category" required>
                        <option value="salary">Salary</option>
                        <option value="freelance">Freelance</option>
                        <option value="food">Food</option>
                        <option value="transport">Transport</option>
                        <option value="entertainment">Entertainment</option>
                        <option value="bills">Bills</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                
                <button type="submit">Add Transaction</button>
            </form>
        </div>
        
        <div class="transactions">
            <h2 style="margin-bottom: 15px;">Recent Transactions</h2>
            <div id="transactions-list"></div>
        </div>
    </div>

    <script>
        window.addEventListener('load', loadTransactions);
        
        document.getElementById('transaction-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const transaction = {
                type: document.getElementById('type').value,
                description: document.getElementById('description').value,
                amount: parseFloat(document.getElementById('amount').value),
                category: document.getElementById('category').value,
                date: new Date().toLocaleDateString()
            };
            
            const response = await fetch('/api/transactions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(transaction)
            });
            
            if (response.ok) {
                document.getElementById('transaction-form').reset();
                loadTransactions();
            }
        });
        
        async function loadTransactions() {
            const response = await fetch('/api/transactions');
            const transactions = await response.json();
            
            let income = 0;
            let expenses = 0;
            
            transactions.forEach(t => {
                if (t.type === 'income') {
                    income += t.amount;
                } else {
                    expenses += t.amount;
                }
            });
            
            document.getElementById('total-income').textContent = '₹' + income.toFixed(2);
            document.getElementById('total-expenses').textContent = '₹' + expenses.toFixed(2);
            document.getElementById('balance').textContent = '₹' + (income - expenses).toFixed(2);
            
            const list = document.getElementById('transactions-list');
            list.innerHTML = '';
            
            transactions.forEach(t => {
                const div = document.createElement('div');
                div.className = 'transaction ' + t.type;
                
                const infoDiv = document.createElement('div');
                infoDiv.className = 'transaction-info';
                infoDiv.innerHTML = '<div class="transaction-desc">' + t.description + '</div><div class="transaction-category">' + t.category + ' • ' + t.date + '</div>';
                
                const amountDiv = document.createElement('div');
                amountDiv.className = 'transaction-amount ' + t.type;
                amountDiv.textContent = (t.type === 'income' ? '+' : '-') + '₹' + t.amount.toFixed(2);
                
                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'delete-btn';
                deleteBtn.textContent = 'Delete';
                deleteBtn.onclick = () => deleteTransaction(t.id);
                
                div.appendChild(infoDiv);
                div.appendChild(amountDiv);
                div.appendChild(deleteBtn);
                list.appendChild(div);
            });
        }
        
        async function deleteTransaction(id) {
            if (confirm('Delete this transaction?')) {
                await fetch('/api/transactions/' + id, { method: 'DELETE' });
                loadTransactions();
            }
        }
    </script>
</body>
</html>
    `);
});

// Step 8: API to GET all transactions
app.get('/api/transactions', (req, res) => {
    const transactions = getTransactions();
    res.json(transactions);
});

// Step 9: API to ADD a new transaction
app.post('/api/transactions', (req, res) => {
    const transactions = getTransactions();
    
    const newTransaction = {
        id: Date.now(),
        ...req.body
    };
    
    transactions.push(newTransaction);
    saveTransactions(transactions);
    
    res.json({ success: true, transaction: newTransaction });
});

// Step 10: API to DELETE a transaction
app.delete('/api/transactions/:id', (req, res) => {
    const transactions = getTransactions();
    const filtered = transactions.filter(t => t.id !== parseInt(req.params.id));
    saveTransactions(filtered);
    res.json({ success: true });
});

// Step 11: Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log('🚀 Server running at http://localhost:' + PORT);
    console.log('Press Ctrl+C to stop');
});