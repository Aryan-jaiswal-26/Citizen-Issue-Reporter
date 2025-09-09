const { Pool } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config();

const DATABASE_URL = process.env.DATABASE_URL || "postgresql://postgres:XkSSGOybkcMWgXTXqoefPKPzzozBrsOn@metro.proxy.rlwy.net:46631/railway";

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function addDemoData() {
  try {
    console.log('🔄 Adding demo data...');

    // Add admin user
    const hashedPassword = await bcrypt.hash('Authority123!', 10);
    
    await pool.query(`
      INSERT INTO users (name, email, password, role) 
      VALUES ($1, $2, $3, $4) 
      ON CONFLICT (email) DO NOTHING
    `, ['Authority Admin', 'admin@authority.gov', hashedPassword, 'authority']);

    // Add some citizen users
    const citizenPassword = await bcrypt.hash('citizen123', 10);
    
    await pool.query(`
      INSERT INTO users (name, email, password, role) 
      VALUES 
        ($1, $2, $3, $4),
        ($5, $6, $7, $8),
        ($9, $10, $11, $12)
      ON CONFLICT (email) DO NOTHING
    `, [
      'John Doe', 'john@example.com', citizenPassword, 'citizen',
      'Jane Smith', 'jane@example.com', citizenPassword, 'citizen',
      'Mike Johnson', 'mike@example.com', citizenPassword, 'citizen'
    ]);

    // Get user IDs
    const users = await pool.query('SELECT id, name FROM users WHERE role = $1', ['citizen']);
    const userIds = users.rows.map(u => u.id);

    // Add sample issues
    const sampleIssues = [
      {
        title: 'Large pothole on Main Street',
        description: 'There is a large pothole causing traffic issues and potential vehicle damage.',
        category: 'Road',
        status: 'pending',
        location: 'Main Street, Downtown',
        latitude: 28.6139,
        longitude: 77.2090
      },
      {
        title: 'Water leak near City Park',
        description: 'Continuous water leak from underground pipe causing water wastage.',
        category: 'Water',
        status: 'in_progress',
        location: 'City Park Area',
        latitude: 28.6129,
        longitude: 77.2100
      },
      {
        title: 'Broken street light',
        description: 'Street light has been non-functional for over a week, creating safety concerns.',
        category: 'Electricity',
        status: 'pending',
        location: 'Oak Avenue',
        latitude: 28.6149,
        longitude: 77.2080
      },
      {
        title: 'Garbage not collected',
        description: 'Garbage has not been collected for 3 days, causing hygiene issues.',
        category: 'Garbage',
        status: 'resolved',
        location: 'Residential Area Block A',
        latitude: 28.6159,
        longitude: 77.2070
      },
      {
        title: 'Open manhole cover',
        description: 'Dangerous open manhole without proper covering or warning signs.',
        category: 'Manholes',
        status: 'pending',
        location: 'Industrial Road',
        latitude: 28.6119,
        longitude: 77.2110
      }
    ];

    for (const issue of sampleIssues) {
      const randomUserId = userIds[Math.floor(Math.random() * userIds.length)];
      await pool.query(`
        INSERT INTO issues (user_id, title, description, category, status, location, latitude, longitude, upvotes)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `, [
        randomUserId,
        issue.title,
        issue.description,
        issue.category,
        issue.status,
        issue.location,
        issue.latitude,
        issue.longitude,
        Math.floor(Math.random() * 10) + 1 // Random upvotes 1-10
      ]);
    }

    console.log('✅ Demo data added successfully!');
    console.log('📧 Admin login: admin@authority.gov');
    console.log('🔑 Admin password: Authority123!');
    
  } catch (error) {
    console.error('❌ Error adding demo data:', error);
  } finally {
    await pool.end();
  }
}

addDemoData();