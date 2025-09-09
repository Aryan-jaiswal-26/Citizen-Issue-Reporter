const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

app.use(cors());
app.use(express.json());

// Initialize SQLite database
const db = new sqlite3.Database('./authority.db');

// Create tables
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'citizen'
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS issues (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    latitude REAL,
    longitude REAL,
    address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    assigned_to INTEGER,
    sla_breach BOOLEAN DEFAULT 0,
    FOREIGN KEY (assigned_to) REFERENCES users (id)
  )`);

  // Insert default authority user
  const hashedPassword = bcrypt.hashSync('Authority123!', 10);
  db.run(`INSERT OR IGNORE INTO users (username, email, password, role) VALUES (?, ?, ?, ?)`,
    ['admin', 'admin@authority.gov', hashedPassword, 'authority']);

  // Insert sample issues for Indian cities
  const sampleIssues = [
    ['Pothole on MG Road', 'Large pothole causing traffic jam near Cubbon Park', 'road', 'pending', 12.9716, 77.5946, 'MG Road, Bangalore, Karnataka'],
    ['Water leak in Connaught Place', 'Broken water pipe flooding the market area', 'water', 'in_progress', 28.6315, 77.2167, 'Connaught Place, New Delhi'],
    ['Street light not working in Bandra', 'Street light has been out for 5 days near station', 'electricity', 'resolved', 19.0596, 72.8295, 'Bandra West, Mumbai, Maharashtra'],
    ['Garbage not collected in Koramangala', 'Garbage piling up for 2 weeks in residential area', 'sanitation', 'pending', 12.9279, 77.6271, 'Koramangala, Bangalore, Karnataka'],
    ['Road construction blocking traffic', 'Ongoing road work causing major traffic delays', 'road', 'in_progress', 13.0827, 80.2707, 'Anna Salai, Chennai, Tamil Nadu'],
    ['Sewage overflow in Sector 18', 'Open sewage causing health hazard', 'water', 'pending', 28.4595, 77.0266, 'Sector 18, Gurgaon, Haryana'],
    ['Broken traffic signal at junction', 'Traffic signal not working causing accidents', 'electricity', 'pending', 22.5726, 88.3639, 'Park Street, Kolkata, West Bengal'],
    ['Illegal dumping near IT park', 'Construction waste dumped illegally', 'sanitation', 'resolved', 17.4065, 78.4772, 'HITEC City, Hyderabad, Telangana']
  ];

  // Clear existing issues and insert new ones
  db.run(`DELETE FROM issues`, () => {
    sampleIssues.forEach(issue => {
      db.run(`INSERT INTO issues (title, description, category, status, latitude, longitude, address) VALUES (?, ?, ?, ?, ?, ?, ?)`, issue);
    });
  });
});

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Middleware to check authority role
const requireAuthority = (req, res, next) => {
  if (req.user.role !== 'authority') {
    return res.status(403).json({ error: 'Access denied. Authority role required.' });
  }
  next();
};

// Password validation
const validatePassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  
  return password.length >= minLength && hasUpperCase && hasNumber;
};

// Auth routes
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (user.role !== 'authority') {
      return res.status(403).json({ error: 'Access denied. Authority access only.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  });
});

app.post('/api/auth/change-password', authenticateToken, requireAuthority, (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!validatePassword(newPassword)) {
    return res.status(400).json({ 
      error: 'Password must be at least 8 characters with one uppercase letter and one number' 
    });
  }

  db.get('SELECT * FROM users WHERE id = ?', [req.user.id], (err, user) => {
    if (err || !user) {
      return res.status(500).json({ error: 'User not found' });
    }

    if (!bcrypt.compareSync(currentPassword, user.password)) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    db.run('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, req.user.id], (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to update password' });
      }
      res.json({ message: 'Password updated successfully' });
    });
  });
});

// Issues routes
app.get('/api/issues', authenticateToken, requireAuthority, (req, res) => {
  db.all('SELECT * FROM issues ORDER BY created_at DESC', (err, issues) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(issues);
  });
});

app.put('/api/issues/:id/status', authenticateToken, requireAuthority, (req, res) => {
  const { status } = req.body;
  const issueId = req.params.id;

  db.run('UPDATE issues SET status = ? WHERE id = ?', [status, issueId], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to update issue status' });
    }
    res.json({ message: 'Issue status updated successfully' });
  });
});

app.put('/api/issues/:id/assign', authenticateToken, requireAuthority, (req, res) => {
  const { assignedTo } = req.body;
  const issueId = req.params.id;

  db.run('UPDATE issues SET assigned_to = ? WHERE id = ?', [assignedTo, issueId], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to assign issue' });
    }
    res.json({ message: 'Issue assigned successfully' });
  });
});

app.get('/api/dashboard/stats', authenticateToken, requireAuthority, (req, res) => {
  const stats = {};
  
  db.get('SELECT COUNT(*) as count FROM issues WHERE status = "pending"', (err, result) => {
    stats.pending = result ? result.count : 0;
    
    db.get('SELECT COUNT(*) as count FROM issues WHERE status = "in_progress"', (err, result) => {
      stats.inProgress = result ? result.count : 0;
      
      db.get('SELECT COUNT(*) as count FROM issues WHERE status = "resolved"', (err, result) => {
        stats.resolved = result ? result.count : 0;
        
        db.get('SELECT COUNT(*) as count FROM issues WHERE sla_breach = 1', (err, result) => {
          stats.slaBreach = result ? result.count : 0;
          res.json(stats);
        });
      });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Authority server running on port ${PORT}`);
});