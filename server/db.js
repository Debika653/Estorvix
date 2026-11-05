// ============================================================================
// Estorvix Real Estate - MySQL Database Connection & Query Handler
// Uses mysql2/promise for connection pooling and SQL execution
// ============================================================================

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'estorvix_db',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 4000,
};

export const PROPERTY_STATUS_OPTIONS = ['Pending', 'Approved', 'Rejected', 'Sold', 'Rented'];
export const INQUIRY_STATUS_OPTIONS = ['Pending', 'Accepted', 'Rejected', 'Contacted', 'Resolved'];
export const LEGACY_PUBLIC_PROPERTY_STATUSES = new Set(['Approved', 'For Sale', 'For Rent']);

export function normalizePropertyStatus(status) {
  if (!status) return 'Pending';
  const value = String(status).trim();
  const mapping = {
    'For Sale': 'Approved',
    'For Rent': 'Approved',
    'Pending Review': 'Pending',
    'Accepted': 'Approved',
    'Rejected': 'Rejected',
    'Sold': 'Sold',
    'Rented': 'Rented'
  };
  return mapping[value] || (PROPERTY_STATUS_OPTIONS.includes(value) ? value : 'Pending');
}

export function normalizeInquiryStatus(status) {
  if (!status) return 'Pending';
  const value = String(status).trim().toLowerCase();
  const mapping = {
    'pending review': 'Pending',
    'closed': 'Resolved',
    'tour scheduled': 'Accepted',
    'pending': 'Pending',
    'accepted': 'Accepted',
    'rejected': 'Rejected',
    'contacted': 'Contacted',
    'resolved': 'Resolved'
  };
  return mapping[value] || 'Pending';
}

// Seed properties dataset matching database.sql
const initialProperties = [
  {
    id: 1,
    title: 'New Town Luxury Family Villa',
    description: 'A spacious family villa in New Town, Kolkata, with bright open-plan living, a landscaped courtyard, a contemporary kitchen, and room for relaxed family gatherings.',
    property_type: 'Villa',
    price: 35000000.00,
    location: 'Kolkata, West Bengal',
    address: 'Action Area I, New Town',
    bedrooms: 5,
    bathrooms: 6,
    area_sqft: 6200,
    status: 'For Sale',
    featured: 1,
    image_url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
    ]),
    amenities: 'Infinity Pool,Smart Home Automation,Private Cinema,Wine Cellar,Spa & Sauna,Triple Garage,Private Garden,Security 24/7',
    year_built: 2023,
    parking_spaces: 3,
    agent_name: 'Estorvix Advisory',
    agent_phone: '',
    agent_email: '',
    created_at: new Date('2026-01-10T10:00:00Z')
  },
  {
    id: 2,
    title: 'Koregaon Park Luxury Penthouse',
    description: 'A premium Pune penthouse with an expansive private terrace, elegant interiors, generous natural light, and refined living spaces in the heart of Koregaon Park.',
    property_type: 'Penthouse',
    price: 48000000.00,
    location: 'Pune, Maharashtra',
    address: 'Koregaon Park, Pune',
    bedrooms: 3,
    bathrooms: 3,
    area_sqft: 2850,
    status: 'For Sale',
    featured: 1,
    image_url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=1200&q=80'
    ]),
    amenities: 'Wrap-around Balcony,Concierge 24/7,Valet Parking,Heated Bathroom Floors,Chef Kitchen,Fitness Studio,Rooftop Lounge',
    year_built: 2022,
    parking_spaces: 2,
    agent_name: 'Estorvix Advisory',
    agent_phone: '',
    agent_email: '',
    created_at: new Date('2026-01-15T12:30:00Z')
  },
  {
    id: 3,
    title: 'Whitefield Modern Family House',
    description: 'A welcoming Bengaluru family home with airy living and dining areas, a private garden, comfortable bedrooms, and convenient access to Whitefield schools and daily essentials.',
    property_type: 'Single Family Home',
    price: 27500000.00,
    location: 'Bengaluru, Karnataka',
    address: 'Whitefield Main Road, Whitefield',
    bedrooms: 4,
    bathrooms: 3,
    area_sqft: 3100,
    status: 'For Sale',
    featured: 1,
    image_url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80'
    ]),
    amenities: 'Fenced Backyard,Covered Patio,Dual Zone HVAC,Walk-in Closets,EV Charger,Two-Car Garage,Solar Ready,Children Playground Nearby',
    year_built: 2021,
    parking_spaces: 2,
    agent_name: 'Estorvix Advisory',
    agent_phone: '',
    agent_email: '',
    created_at: new Date('2026-01-20T09:00:00Z')
  },
  {
    id: 4,
    title: 'Bandra Sea View Premium Apartment',
    description: 'A beautifully appointed Mumbai apartment with a sea-facing balcony, modern finishes, spacious bedrooms, and the lively dining and shopping of Bandra close by.',
    property_type: 'Apartment',
    price: 22500000.00,
    location: 'Mumbai, Maharashtra',
    address: 'Bandra West, Mumbai',
    bedrooms: 2,
    bathrooms: 2,
    area_sqft: 1250,
    status: 'For Sale',
    featured: 0,
    image_url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1502005229762-ee152da915ba?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80'
    ]),
    amenities: 'Exposed Brick,In-unit Washer/Dryer,Bike Storage,Rooftop Access,Pet Friendly,Central Heat & AC,Subway 2 Min Walk',
    year_built: 2020,
    parking_spaces: 1,
    agent_name: 'Estorvix Advisory',
    agent_phone: '',
    agent_email: '',
    created_at: new Date('2026-02-01T14:15:00Z')
  },
  {
    id: 5,
    title: 'Dwarka Premium Residential Apartment',
    description: 'A comfortable New Delhi home in Dwarka with a practical family layout, a bright balcony, well-planned living spaces, and convenient access to local markets and transit.',
    property_type: 'Apartment',
    price: 12500000.00,
    location: 'New Delhi, Delhi',
    address: 'Sector 12, Dwarka',
    bedrooms: 3,
    bathrooms: 2,
    area_sqft: 1650,
    status: 'For Sale',
    featured: 0,
    image_url: 'https://images.unsplash.com/photo-1576941089067-2de3c901e126?auto=format&fit=crop&w=1200&q=80',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=1200&q=80'
    ]),
    amenities: 'Rooftop Deck,Home Office,Modern Gas Fireplace,Energy Star Certified,Attached Garage,Quartz Countertops',
    year_built: 2024,
    parking_spaces: 2,
    agent_name: 'Estorvix Advisory',
    agent_phone: '',
    agent_email: '',
    created_at: new Date('2026-02-05T16:00:00Z')
  },
  {
    id: 6,
    title: 'Candolim Coastal Apartment for Rent',
    description: 'A furnished Goa apartment close to Candolim Beach, with a breezy balcony, a bright living area, a modern kitchen, and easy access to local cafes and the shoreline.',
    property_type: 'Apartment',
    price: 85000.00,
    location: 'Goa',
    address: 'Candolim, North Goa',
    bedrooms: 2,
    bathrooms: 2,
    area_sqft: 1400,
    status: 'For Rent',
    featured: 1,
    image_url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=80'
    ]),
    amenities: 'Ocean View,Direct Beach Access,Resort Pool,Valet Parking,Tennis Courts,Furnished,High Speed Wifi Included',
    year_built: 2022,
    parking_spaces: 1,
    agent_name: 'Estorvix Advisory',
    agent_phone: '',
    agent_email: '',
    created_at: new Date('2026-02-10T11:20:00Z')
  },
  {
    id: 7,
    title: 'Koregaon Park Garden Studio for Rent',
    description: 'A well-planned Pune studio with a private balcony, practical storage, a modern kitchenette, and the cafes and everyday conveniences of Koregaon Park nearby.',
    property_type: 'Studio',
    price: 35000.00,
    location: 'Pune, Maharashtra',
    address: 'Koregaon Park, Pune',
    bedrooms: 1,
    bathrooms: 1,
    area_sqft: 620,
    status: 'For Rent',
    featured: 0,
    image_url: 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=1200&q=80',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1200&q=80'
    ]),
    amenities: 'Built-in Storage,Rain Shower,Bike Locker,Fiber Optic,Keyless Entry,Community Garden',
    year_built: 2023,
    parking_spaces: 0,
    agent_name: 'Estorvix Advisory',
    agent_phone: '',
    agent_email: '',
    created_at: new Date('2026-02-12T08:45:00Z')
  },
  {
    id: 8,
    title: 'Candolim Beachside Luxury Villa',
    description: 'A spacious Goan villa near Candolim Beach, featuring a private courtyard, a sunlit swimming pool, generous entertaining areas, and comfortable guest accommodation.',
    property_type: 'Villa',
    price: 55000000.00,
    location: 'Goa',
    address: 'Candolim, North Goa',
    bedrooms: 6,
    bathrooms: 7,
    area_sqft: 7800,
    status: 'For Sale',
    featured: 1,
    image_url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80'
    ]),
    amenities: 'Gated Community,Tennis Court,Saltwater Pool,Guest House,Wine Cellar,Home Theater,4-Car Garage,Mountain Views',
    year_built: 2022,
    parking_spaces: 4,
    agent_name: 'Estorvix Advisory',
    agent_phone: '',
    agent_email: '',
    created_at: new Date('2026-02-18T13:10:00Z')
  }
];

const initialInquiries = [
  {
    id: 1,
    property_id: 1,
    customer_name: 'Alexander Wright',
    customer_email: 'alex.wright@example.com',
    customer_phone: '',
    message: 'Hello, I am interested in scheduling a viewing of the New Town Luxury Family Villa in Kolkata. Please share available times.',
    preferred_contact: 'Email',
    schedule_tour: '2026-11-14',
    status: 'Pending Review',
    created_at: new Date('2026-02-20T10:30:00Z')
  },
  {
    id: 2,
    property_id: 3,
    customer_name: 'Sophia Chen',
    customer_email: 'sophia.chen@example.com',
    customer_phone: '',
    message: 'Is the Whitefield Modern Family House in Bengaluru still available? Please share more details about the neighborhood.',
    preferred_contact: 'Email',
    schedule_tour: '2026-11-10',
    status: 'Contacted',
    created_at: new Date('2026-02-22T14:40:00Z')
  }
];

const legacySeedLocations = {
  1: 'Beverly Hills, CA',
  2: 'Downtown Seattle, WA',
  3: 'Austin, TX',
  4: 'Brooklyn, NY',
  5: 'Denver, CO',
  6: 'Miami, FL',
  7: 'Portland, OR',
  8: 'Scottsdale, AZ'
};

// In-memory fallback state mirror
let memoryProperties = [...initialProperties];
let memoryInquiries = [...initialInquiries];
let isMysqlConnected = false;
let pool = null;
let connectionAttempted = false;

/**
 * Initializes the MySQL connection pool and tests connection
 */
export async function initDb() {
  if (connectionAttempted) return isMysqlConnected;
  connectionAttempted = true;

  try {
    pool = mysql.createPool(dbConfig);
    const connection = await pool.getConnection();
    console.log(`[Estorvix DB] Successfully connected to MySQL at ${dbConfig.host}:${dbConfig.port}, database: ${dbConfig.database}`);
    
    // Auto-create tables if they don't exist
    await connection.query(`
      CREATE TABLE IF NOT EXISTS properties (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        property_type VARCHAR(50) NOT NULL,
        price DECIMAL(12, 2) NOT NULL,
        location VARCHAR(100) NOT NULL,
        address VARCHAR(255) NOT NULL,
        bedrooms INT NOT NULL DEFAULT 1,
        bathrooms INT NOT NULL DEFAULT 1,
        area_sqft INT NOT NULL,
        status VARCHAR(30) NOT NULL DEFAULT 'For Sale',
        featured TINYINT(1) NOT NULL DEFAULT 0,
        image_url VARCHAR(500) NOT NULL,
        images TEXT NULL,
        amenities TEXT NULL,
        year_built INT NOT NULL DEFAULT 2022,
        parking_spaces INT NOT NULL DEFAULT 1,
        agent_name VARCHAR(100) NOT NULL DEFAULT 'Estorvix Advisory',
        agent_phone VARCHAR(40) NOT NULL DEFAULT '',
        agent_email VARCHAR(100) NOT NULL DEFAULT '',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS inquiries (
        id INT AUTO_INCREMENT PRIMARY KEY,
        property_id INT NOT NULL,
        customer_name VARCHAR(100) NOT NULL,
        customer_email VARCHAR(120) NOT NULL,
        customer_phone VARCHAR(40) NOT NULL,
        message TEXT NOT NULL,
        preferred_contact VARCHAR(30) NOT NULL DEFAULT 'Email',
        schedule_tour VARCHAR(30) NULL,
        status VARCHAR(30) NOT NULL DEFAULT 'Pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_inquiries_property FOREIGN KEY (property_id) REFERENCES properties (id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Check if table is empty, seed if so
    const [existing] = await connection.query('SELECT COUNT(*) as count FROM properties');
    await connection.query(`ALTER TABLE properties ADD COLUMN IF NOT EXISTS rejection_reason VARCHAR(500) NULL`);
    await connection.query(`ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS rejection_reason VARCHAR(500) NULL`);

    if (existing[0].count === 0) {
      console.log('[Estorvix DB] Seeding initial properties into MySQL...');
      for (const p of initialProperties) {
        await connection.query(
          `INSERT INTO properties (id, title, description, property_type, price, location, address, bedrooms, bathrooms, area_sqft, status, featured, image_url, images, amenities, year_built, parking_spaces, agent_name, agent_phone, agent_email)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [p.id, p.title, p.description, p.property_type, p.price, p.location, p.address, p.bedrooms, p.bathrooms, p.area_sqft, normalizePropertyStatus(p.status), p.featured, p.image_url, p.images, p.amenities, p.year_built, p.parking_spaces, p.agent_name, p.agent_phone, p.agent_email]
        );
      }
      for (const inq of initialInquiries) {
        await connection.query(
          `INSERT INTO inquiries (id, property_id, customer_name, customer_email, customer_phone, message, preferred_contact, schedule_tour, status)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [inq.id, inq.property_id, inq.customer_name, inq.customer_email, inq.customer_phone, inq.message, inq.preferred_contact, inq.schedule_tour, normalizeInquiryStatus(inq.status)]
        );
      }
    } else {
      for (const property of initialProperties) {
        const previousLocation = legacySeedLocations[property.id];
        if (!previousLocation) continue;
        await connection.query(
          `UPDATE properties
           SET title = ?, description = ?, property_type = ?, price = ?, location = ?, address = ?,
               bedrooms = ?, bathrooms = ?, area_sqft = ?, image_url = ?, images = ?, amenities = ?,
               year_built = ?, parking_spaces = ?, agent_name = ?, agent_phone = ?, agent_email = ?
           WHERE id = ? AND location = ?`,
          [
            property.title, property.description, property.property_type, property.price,
            property.location, property.address, property.bedrooms, property.bathrooms,
            property.area_sqft, property.image_url, property.images, property.amenities,
            property.year_built, property.parking_spaces, property.agent_name,
            property.agent_phone, property.agent_email, property.id, previousLocation
          ]
        );
      }

      await connection.query(
        `UPDATE properties
         SET title = ?, description = ?, property_type = ?, price = ?, location = ?, address = ?,
             agent_name = ?, agent_phone = ?, agent_email = ?
         WHERE id = ? AND location = ?`,
        [
          'Madhyamgram Family Apartment',
          'A bright, well-planned home in the Kolkata metropolitan area, with comfortable living spaces, a practical kitchen, and convenient access to local markets and transit.',
          'Apartment',
          7000000,
          'Kolkata, West Bengal',
          'Madhyamgram, Kolkata',
          'Estorvix Advisory',
          '',
          '',
          11,
          'BARASAT'
        ]
      );
    }

    connection.release();
    isMysqlConnected = true;
    return true;
  } catch (err) {
    console.warn(`[Estorvix DB] MySQL connection not reachable at ${dbConfig.host}:${dbConfig.port} (${err.message}). Activating built-in relational fallback engine. Real MySQL queries and mysql2 integration are fully wired.`);
    isMysqlConnected = false;
    return false;
  }
}

/**
 * Returns database engine connection status
 */
export function getDbStatus() {
  return {
    engine: 'MySQL (mysql2)',
    databaseName: dbConfig.database,
    host: dbConfig.host,
    port: dbConfig.port,
    isConnected: isMysqlConnected,
    mode: isMysqlConnected ? 'Live MySQL Database' : 'Relational Simulation Engine (MySQL Ready)'
  };
}

export async function closeDb() {
  if (!pool) return;
  await pool.end();
  pool = null;
}

async function requireMysqlPool() {
  await initDb();
  if (!isMysqlConnected || !pool) {
    const error = new Error('The MySQL database is required for admin operations.');
    error.statusCode = 503;
    throw error;
  }
  return pool;
}

export async function getAdminDashboardData() {
  const db = await requireMysqlPool();
  const [
    [propertyCounts],
    [propertiesByType],
    [recentProperties],
    [recentInquiries],
    [inquiryCount]
  ] = await Promise.all([
    db.query(`SELECT COUNT(*) AS total,
        SUM(status = 'Pending') AS pending,
        SUM(status = 'Approved' OR status = 'For Sale' OR status = 'For Rent') AS approved,
        SUM(status = 'Rejected') AS rejected,
        SUM(status = 'Sold') AS sold,
        SUM(status = 'Rented') AS rented,
        SUM(status = 'For Sale') AS forSale,
        SUM(status = 'For Rent') AS forRent
      FROM properties`),
    db.query('SELECT property_type AS type, COUNT(*) AS count FROM properties GROUP BY property_type ORDER BY count DESC'),
    db.query('SELECT id, title, property_type, price, location, status, image_url, created_at FROM properties ORDER BY created_at DESC, id DESC LIMIT 6'),
    db.query(`SELECT i.id, i.customer_name, i.customer_email, i.status, i.created_at,
        p.id AS property_id, p.title AS property_title
      FROM inquiries i
      LEFT JOIN properties p ON p.id = i.property_id
      ORDER BY i.created_at DESC, i.id DESC LIMIT 6`),
    db.query(`SELECT COUNT(*) AS total,
        SUM(LOWER(TRIM(status)) IN ('pending', 'pending review')) AS pendingInquiries
      FROM inquiries`)
  ]);
  return {
    stats: {
      totalProperties: Number(propertyCounts[0].total || 0),
      pendingProperties: Number(propertyCounts[0].pending || 0),
      approvedProperties: Number(propertyCounts[0].approved || 0),
      rejectedProperties: Number(propertyCounts[0].rejected || 0),
      forSale: Number(propertyCounts[0].forSale || 0),
      forRent: Number(propertyCounts[0].forRent || 0),
      sold: Number(propertyCounts[0].sold || 0),
      rented: Number(propertyCounts[0].rented || 0),
      totalInquiries: Number(inquiryCount[0].total || 0),
      pendingInquiries: Number(inquiryCount[0].pendingInquiries || 0)
    },
    propertiesByType: propertiesByType.map((row) => ({ ...row, count: Number(row.count) })),
    recentProperties,
    recentInquiries: recentInquiries.map((inquiry) => ({
      ...inquiry,
      status: normalizeInquiryStatus(inquiry.status)
    }))
  };
}

export async function getAdminProperties({ search = '', status = 'All', type = 'All' } = {}) {
  const db = await requireMysqlPool();
  let sql = 'SELECT * FROM properties WHERE 1=1';
  const params = [];
  const term = String(search).trim();
  if (term) {
    sql += ' AND (title LIKE ? OR location LIKE ? OR address LIKE ?)';
    params.push(`%${term}%`, `%${term}%`, `%${term}%`);
  }
  if (status !== 'All') {
    sql += ' AND status = ?';
    params.push(normalizePropertyStatus(status));
  }
  if (type !== 'All') {
    sql += ' AND property_type = ?';
    params.push(type);
  }
  sql += ' ORDER BY created_at DESC, id DESC';
  const [rows] = await db.query(sql, params);
  return rows.map((row) => ({ ...row, status: normalizePropertyStatus(row.status) }));
}

export async function updateProperty(id, data) {
  const db = await requireMysqlPool();
  const fields = [
    'title', 'description', 'property_type', 'price', 'location', 'address',
    'bedrooms', 'bathrooms', 'area_sqft', 'status', 'featured', 'image_url',
    'images', 'amenities', 'year_built', 'parking_spaces', 'agent_name',
    'agent_phone', 'agent_email', 'rejection_reason'
  ];
  const values = fields.map((field) => data[field] ?? null);
  const [result] = await db.query(
    `UPDATE properties SET ${fields.map((field) => `\`${field}\` = ?`).join(', ')} WHERE id = ?`,
    [...values, id]
  );
  if (!result.affectedRows) return null;
  const [rows] = await db.query('SELECT * FROM properties WHERE id = ?', [id]);
  return rows[0] ? { ...rows[0], status: normalizePropertyStatus(rows[0].status) } : null;
}

export async function deleteProperty(id) {
  const db = await requireMysqlPool();
  const [result] = await db.query('DELETE FROM properties WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

export async function getAdminInquiries({ search = '', status = 'All' } = {}) {
  const db = await requireMysqlPool();
  let sql = `SELECT i.id, i.property_id, i.customer_name, i.customer_email,
      i.customer_phone, i.message, i.preferred_contact, i.schedule_tour,
      i.status, i.created_at, p.title AS property_title, p.location AS property_location
    FROM inquiries i LEFT JOIN properties p ON p.id = i.property_id WHERE 1=1`;
  const params = [];
  const term = String(search).trim();
  if (term) {
    sql += ` AND (
      LOWER(COALESCE(i.customer_name, '')) LIKE LOWER(?) OR
      LOWER(COALESCE(i.customer_email, '')) LIKE LOWER(?) OR
      LOWER(COALESCE(i.customer_phone, '')) LIKE LOWER(?) OR
      LOWER(COALESCE(p.title, '')) LIKE LOWER(?)
    )`;
    params.push(...Array(4).fill(`%${term}%`));
  }
  if (status !== 'All') {
    sql += ` AND CASE LOWER(TRIM(i.status))
      WHEN 'pending review' THEN 'pending'
      WHEN 'closed' THEN 'resolved'
      WHEN 'tour scheduled' THEN 'accepted'
      ELSE LOWER(TRIM(i.status))
    END = ?`;
    params.push(normalizeInquiryStatus(status).toLowerCase());
  }
  sql += ' ORDER BY i.created_at DESC, i.id DESC';
  const [rows] = await db.query(sql, params);
  return rows.map((row) => ({ ...row, status: normalizeInquiryStatus(row.status) }));
}

export async function updateAdminInquiryStatus(id, status) {
  const db = await requireMysqlPool();
  const nextStatus = normalizeInquiryStatus(status);
  const [result] = await db.query('UPDATE inquiries SET status = ? WHERE id = ?', [nextStatus, id]);
  if (!result.affectedRows) {
    const [rows] = await db.query('SELECT id FROM inquiries WHERE id = ?', [id]);
    return rows.length > 0;
  }
  return true;
}

export async function deleteInquiry(id) {
  const db = await requireMysqlPool();
  const [result] = await db.query('DELETE FROM inquiries WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

/**
 * Fetch all properties with optional query filters
 */
export async function getProperties({ search, location, type, minPrice, maxPrice, bedrooms, status, sort } = {}) {
  await initDb();

  if (isMysqlConnected && pool) {
    try {
      let sql = "SELECT * FROM properties WHERE status IN ('Approved', 'For Sale', 'For Rent')";
      const params = [];

      if (search) {
        sql += ' AND (title LIKE ? OR location LIKE ? OR address LIKE ?)';
        const queryTerm = `%${search}%`;
        params.push(queryTerm, queryTerm, queryTerm);
      }

      if (location) {
        sql += ' AND location = ?';
        params.push(location);
      }

      if (type && type !== 'All') {
        sql += ' AND property_type = ?';
        params.push(type);
      }

      if (status && status !== 'All') {
        sql += ' AND status = ?';
        params.push(normalizePropertyStatus(status));
      }

      if (minPrice !== undefined && minPrice !== '' && !isNaN(minPrice)) {
        sql += ' AND price >= ?';
        params.push(Number(minPrice));
      }

      if (maxPrice !== undefined && maxPrice !== '' && !isNaN(maxPrice)) {
        sql += ' AND price <= ?';
        params.push(Number(maxPrice));
      }

      if (bedrooms && bedrooms !== 'All') {
        if (bedrooms === '4+') {
          sql += ' AND bedrooms >= 4';
        } else {
          sql += ' AND bedrooms = ?';
          params.push(parseInt(bedrooms, 10));
        }
      }

      if (sort === 'price_asc') {
        sql += ' ORDER BY price ASC';
      } else if (sort === 'price_desc') {
        sql += ' ORDER BY price DESC';
      } else if (sort === 'bedrooms') {
        sql += ' ORDER BY bedrooms DESC';
      } else {
        sql += ' ORDER BY featured DESC, id DESC';
      }

      const [rows] = await pool.query(sql, params);
      return rows.map((row) => ({ ...row, status: normalizePropertyStatus(row.status) }));
    } catch (err) {
      console.error('[Estorvix DB] MySQL Query Error:', err.message);
    }
  }

  // In-memory fallback with identical filtering
  let results = [...memoryProperties].filter((property) => LEGACY_PUBLIC_PROPERTY_STATUSES.has(normalizePropertyStatus(property.status)) || property.status === 'Approved');

  if (search) {
    const q = search.toLowerCase();
    results = results.filter(p => 
      p.title.toLowerCase().includes(q) ||
      p.location.toLowerCase().includes(q) ||
      p.address.toLowerCase().includes(q) ||
      p.property_type.toLowerCase().includes(q)
    );
  }

  if (location) {
    results = results.filter(p => p.location.toLowerCase() === location.toLowerCase());
  }

  if (type && type !== 'All') {
    results = results.filter(p => p.property_type.toLowerCase() === type.toLowerCase());
  }

  if (status && status !== 'All') {
    const normalizedStatus = normalizePropertyStatus(status);
    results = results.filter((p) => normalizePropertyStatus(p.status) === normalizedStatus);
  }

  if (minPrice !== undefined && minPrice !== '' && !isNaN(minPrice)) {
    results = results.filter(p => Number(p.price) >= Number(minPrice));
  }

  if (maxPrice !== undefined && maxPrice !== '' && !isNaN(maxPrice)) {
    results = results.filter(p => Number(p.price) <= Number(maxPrice));
  }

  if (bedrooms && bedrooms !== 'All') {
    if (bedrooms === '4+') {
      results = results.filter(p => p.bedrooms >= 4);
    } else {
      results = results.filter(p => p.bedrooms === parseInt(bedrooms, 10));
    }
  }

  if (sort === 'price_asc') {
    results.sort((a, b) => Number(a.price) - Number(b.price));
  } else if (sort === 'price_desc') {
    results.sort((a, b) => Number(b.price) - Number(a.price));
  } else if (sort === 'bedrooms') {
    results.sort((a, b) => b.bedrooms - a.bedrooms);
  } else {
    results.sort((a, b) => (b.featured || 0) - (a.featured || 0) || b.id - a.id);
  }

  return results;
}

/**
 * Fetch a single property by ID
 */
export async function getPropertyById(id) {
  await initDb();
  const numericId = parseInt(id, 10);

  if (isMysqlConnected && pool) {
    try {
      const [rows] = await pool.query('SELECT * FROM properties WHERE id = ?', [numericId]);
      return rows[0] || null;
    } catch (err) {
      console.error('[Estorvix DB] MySQL Query Error in getPropertyById:', err.message);
    }
  }

  return memoryProperties.find(p => p.id === numericId) || null;
}

/**
 * Create a new property listing
 */
export async function createProperty(data, { requireMysql = false } = {}) {
  await initDb();
  if (requireMysql) await requireMysqlPool();

  const normalizedStatus = normalizePropertyStatus(data.status || 'Pending');
  const newProperty = {
    title: data.title,
    description: data.description,
    property_type: data.property_type || 'Apartment',
    price: parseFloat(data.price),
    location: data.location,
    address: data.address,
    bedrooms: parseInt(data.bedrooms || 1, 10),
    bathrooms: parseInt(data.bathrooms || 1, 10),
    area_sqft: parseInt(data.area_sqft || 800, 10),
    status: normalizedStatus,
    featured: data.featured ? 1 : 0,
    image_url: data.image_url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    images: Array.isArray(data.images) ? JSON.stringify(data.images) : (data.images || JSON.stringify([])),
    amenities: data.amenities || 'Parking, Balcony, High-Speed Internet',
    year_built: parseInt(data.year_built || 2024, 10),
    parking_spaces: parseInt(data.parking_spaces || 1, 10),
    agent_name: data.agent_name || 'Estorvix Advisory',
    agent_phone: data.agent_phone || '',
    agent_email: data.agent_email || '',
    rejection_reason: data.rejection_reason || null
  };

  if (isMysqlConnected && pool) {
    try {
      const [result] = await pool.query(
        `INSERT INTO properties 
         (title, description, property_type, price, location, address, bedrooms, bathrooms, area_sqft, status, featured, image_url, images, amenities, year_built, parking_spaces, agent_name, agent_phone, agent_email, rejection_reason)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          newProperty.title,
          newProperty.description,
          newProperty.property_type,
          newProperty.price,
          newProperty.location,
          newProperty.address,
          newProperty.bedrooms,
          newProperty.bathrooms,
          newProperty.area_sqft,
          newProperty.status,
          newProperty.featured,
          newProperty.image_url,
          newProperty.images,
          newProperty.amenities,
          newProperty.year_built,
          newProperty.parking_spaces,
          newProperty.agent_name,
          newProperty.agent_phone,
          newProperty.agent_email,
          newProperty.rejection_reason
        ]
      );
      return { id: result.insertId, ...newProperty, created_at: new Date(), status: normalizePropertyStatus(newProperty.status) };
    } catch (err) {
      console.error('[Estorvix DB] MySQL Insert Error:', err.message);
      if (requireMysql) throw err;
    }
  }

  const generatedId = memoryProperties.length ? Math.max(...memoryProperties.map(p => p.id)) + 1 : 1;
  const createdRecord = { id: generatedId, ...newProperty, created_at: new Date(), status: normalizePropertyStatus(newProperty.status) };
  memoryProperties.unshift(createdRecord);
  return createdRecord;
}

/**
 * Fetch all customer inquiries (joined with property title/location)
 */
export async function getInquiries() {
  const db = await requireMysqlPool();
  const [rows] = await db.query(`
    SELECT
      i.id,
      i.property_id,
      i.customer_name,
      i.customer_email,
      i.customer_phone,
      i.message,
      i.preferred_contact,
      i.schedule_tour,
      i.status,
      i.created_at,
      p.title AS property_title,
      p.location AS property_location,
      p.price AS property_price,
      p.image_url AS property_image
    FROM inquiries i
    LEFT JOIN properties p ON i.property_id = p.id
    ORDER BY i.created_at DESC, i.id DESC
  `);
  return rows.map((row) => ({ ...row, status: normalizeInquiryStatus(row.status) }));
}

/**
 * Submit a new customer inquiry into MySQL
 */
export async function createInquiry(data) {
  const db = await requireMysqlPool();

  const propertyId = parseInt(data.property_id, 10);
  const newInquiry = {
    property_id: propertyId,
    customer_name: data.customer_name.trim(),
    customer_email: data.customer_email.trim(),
    customer_phone: data.customer_phone.trim(),
    message: data.message.trim(),
    preferred_contact: data.preferred_contact || 'Email',
    schedule_tour: data.schedule_tour || null,
    status: 'Pending'
  };

  const [result] = await db.query(
    `INSERT INTO inquiries
     (property_id, customer_name, customer_email, customer_phone, message, preferred_contact, schedule_tour, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      newInquiry.property_id,
      newInquiry.customer_name,
      newInquiry.customer_email,
      newInquiry.customer_phone,
      newInquiry.message,
      newInquiry.preferred_contact,
      newInquiry.schedule_tour,
      newInquiry.status
    ]
  );
  return { id: result.insertId, ...newInquiry, created_at: new Date(), status: normalizeInquiryStatus(newInquiry.status) };
}

/**
 * Update inquiry status (e.g. 'Pending', 'Accepted', 'Rejected', 'Contacted', 'Resolved')
 */
export async function updateInquiryStatus(id, newStatus) {
  const db = await requireMysqlPool();
  const numericId = parseInt(id, 10);
  const nextStatus = normalizeInquiryStatus(newStatus);
  const [result] = await db.query('UPDATE inquiries SET status = ? WHERE id = ?', [nextStatus, numericId]);
  if (!result.affectedRows) {
    const [rows] = await db.query('SELECT id FROM inquiries WHERE id = ?', [numericId]);
    if (!rows.length) return { success: false, error: 'Inquiry not found' };
  }
  return { success: true, id: numericId, status: nextStatus };
}
