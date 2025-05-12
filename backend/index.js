const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

// Připojení k databázi
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'mydb'
});

db.connect(err => {
  if (err) {
    console.error('❌ Připojení k databázi selhalo:', err);
  } else {
    console.log('✅ Připojeno k MariaDB');
  }
});

// === ROUTER ===
const router = express.Router();

router.get('/ping', (req, res) => res.send('Backend is alive'));

// Endpoint pro získání zpráv
router.get('/admin/messages', (req, res) => {
  const sql = 'SELECT * FROM MESSAGES ORDER BY id_messages ASC';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('❌ Error fetching messages:', err);
      return res.status(500).json({ success: false, error: 'Error fetching messages' });
    }

    // Transformace dat
    const transformedResults = results.map(row => {
      return `Name: ${row.name}\nEmail: ${row.email}\nMessage: ${row.message}`;
    });

    res.json({ success: true, data: transformedResults });
  });
});

// Endpoint pro získání rezervací ubytování
router.get('/admin/accommodation', (req, res) => {
  const sql = `
    SELECT 
      r.date_start, 
      r.date_end, 
      c.name AS customer_name, 
      c.email AS customer_email, 
      c.phone_number AS customer_phone, 
      c.city AS customer_city, 
      c.street AS customer_street, 
      c.country AS customer_country, 
      c.postal_code AS customer_ZIP,
      rm.number AS room_number, 
      rm.capacity AS room_capacity
    FROM Reservations r
    JOIN Customers c ON r.Customers_Fk = c.id_customers
    JOIN Rooms rm ON r.Rooms_Fk = rm.id_rooms
    WHERE r.Rooms_Fk IS NOT NULL
     ORDER BY r.date_start ASC
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error('❌ Error fetching accommodation reservations:', err);
      return res.status(500).json({ success: false, error: 'Error fetching accommodation reservations' });
    }

    // Transformace dat
    const transformedResults = results.map(row => {
      const formattedStartDate = new Date(row.date_start).toDateString(); // Format: May 13 2025
      const formattedEndDate = new Date(row.date_end).toDateString(); // Format: May 13 2025
      return `Name: ${row.customer_name}\nEmail: ${row.customer_email}\nPhone: ${row.customer_phone}\nCity: ${row.customer_city}\nStreet: ${row.customer_street}\nZIP: ${row.customer_ZIP}\nCountry: ${row.customer_country}\nRoom: ${row.room_number} (Capacity: ${row.room_capacity})\nCheck-in Date: ${formattedStartDate}\nCheck-out Date: ${formattedEndDate}`;
    });

    res.json({ success: true, data: transformedResults });
  });
});

// Endpoint pro získání rezervací restaurace
router.get('/admin/restaurant', (req, res) => {
  const sql = `
    SELECT 
      r.date_start, 
      r.time, 
      c.name AS customer_name, 
      c.email AS customer_email, 
      c.phone_number AS customer_phone,
      t.number AS table_number, 
      t.seats AS table_seats
    FROM Reservations r
    JOIN Customers c ON r.Customers_Fk = c.id_customers
    JOIN Tables t ON r.Tables_Fk = t.id_tables
    WHERE r.Tables_Fk IS NOT NULL
     ORDER BY r.date_start ASC, r.time ASC
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error('❌ Error fetching restaurant reservations:', err);
      return res.status(500).json({ success: false, error: 'Error fetching restaurant reservations' });
    }

    // Transformace dat
    const transformedResults = results.map(row => {
      const formattedDate = new Date(row.date_start).toDateString(); //Format
      const formattedTime = row.time.slice(0, 5); // Format
      return `Name: ${row.customer_name}\nEmail: ${row.customer_email}\nPhone: ${row.customer_phone}\nTable: ${row.table_number} (Seats: ${row.table_seats})\nDate: ${formattedDate}\nTime: ${formattedTime}`;
    });

    res.json({ success: true, data: transformedResults });
  });
});

// Endpoint pro zpracování kontaktního formuláře
router.post('/contact', (req, res) => {
  const { name, email, message } = req.body;

  const sql = 'INSERT INTO MESSAGES (name, email, message) VALUES (?, ?, ?)';
  db.query(sql, [name, email, message], (err, result) => {
    if (err) {
      console.error('❌ Error saving message:', err);
      res.status(500).json({ success: false, error: 'Server error' });
    } else {
      res.json({ success: true, insertedId: result.insertId });
    }
  });
});

// Endpoint pro zpracování rezervace pokoje
router.post('/bookNow', (req, res) => {
  const { firstName, lastName, email, countryCode, phone, city, street, postalCode, country, checkInDate, checkOutDate, guests } = req.body;

  // Kombinace jména a telefonního čísla
  const name = `${firstName} ${lastName}`;
  const phoneNumber = `${countryCode} ${phone}`;

  console.log('📥 Received data on backend:', { firstName, lastName, email, countryCode, phone, city, street, postalCode, country, checkInDate, checkOutDate, guests });

  // Najít dostupný pokoj
  const roomSql = `
    SELECT id_rooms, capacity
    FROM Rooms
    WHERE capacity >= ?
      AND id_rooms NOT IN (
        SELECT Rooms_Fk
        FROM Reservations
        WHERE (date_start < ? AND date_end > ?)
      )
    ORDER BY capacity ASC
    LIMIT 1
  `;

  db.query(roomSql, [guests, checkOutDate, checkInDate], (err, roomResult) => {
    if (err) {
      console.error('❌ Error finding room:', err);
      return res.status(500).json({ success: false, error: 'Error finding room' });
    }

    if (roomResult.length === 0) {
      //Nedostupný pokoj
      return res.status(400).json({ success: false, error: 'No available room for the specified number of guests and dates' });
    }

    const roomId = roomResult[0].id_rooms;
    console.log('✅ Selected room:', roomResult[0]);

    // Uložit zákazníka do tabulky Customers
    const customerSql = `
      INSERT INTO Customers (name, email, phone_number, city, street, postal_code, country)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(customerSql, [name, email, phoneNumber, city, street, postalCode, country], (err, customerResult) => {
      if (err) {
        console.error('❌ Error saving customer:', err);
        return res.status(500).json({ success: false, error: 'Error saving customer' });
      }

      console.log('✅ Customer saved:', customerResult);

      const customerId = customerResult.insertId;

      // Uložit rezervaci do tabulky Reservations
      const reservationSql = `
        INSERT INTO Reservations (date_start, date_end, Customers_Fk, Rooms_Fk)
        VALUES (?, ?, ?, ?)
      `;

      db.query(reservationSql, [checkInDate, checkOutDate, customerId, roomId], (err, reservationResult) => {
        if (err) {
          console.error('❌ Error saving reservation:', err);
          return res.status(500).json({ success: false, error: 'Error saving reservation' });
        }

        console.log('✅ Reservation saved:', reservationResult);
        res.json({ success: true, reservationId: reservationResult.insertId });
      });
    });
  });
});

// Endpoint pro zpracování rezervace restaurace
router.post('/restaurantReservation', (req, res) => {
  const { name, email, phone, reservationDate, reservationTime, guests } = req.body;

  console.log('📥 Received data on backend:', { name, email, phone, reservationDate, reservationTime, guests });

  // Najít dostupný stůl
  const tableSql = `
    SELECT id_tables, seats
    FROM Tables
    WHERE seats >= ?
      AND id_tables NOT IN (
        SELECT Tables_Fk
        FROM Reservations
        WHERE date_start = ?
          AND (
            TIME_TO_SEC(TIMEDIFF(time, ?)) BETWEEN -7200 AND 7200
          )
      )
    ORDER BY seats ASC
    LIMIT 1
  `;

  db.query(tableSql, [guests, reservationDate, reservationTime], (err, tableResult) => {
    if (err) {
      console.error('❌ Error finding table:', err);
      return res.status(500).json({ success: false, error: 'Error finding table' });
    }

    if (tableResult.length === 0) {
      // nedostupný stůl
      return res.status(400).json({ success: false, error: 'No available table for the specified number of guests and time' });
    }

    const tableId = tableResult[0].id_tables;
    console.log('✅ Selected table:', tableResult[0]);

    // Uložit zákazníka do tabulky Customers
    const customerSql = `
      INSERT INTO Customers (name, email, phone_number)
      VALUES (?, ?, ?)
    `;

    db.query(customerSql, [name, email, phone], (err, customerResult) => {
      if (err) {
        console.error('❌ Error saving customer:', err);
        return res.status(500).json({ success: false, error: 'Error saving customer' });
      }

      console.log('✅ Customer saved:', customerResult);

      const customerId = customerResult.insertId;

      // Uložit rezervaci do tabulky Reservations
      const reservationSql = `
        INSERT INTO Reservations (date_start, time, Customers_Fk, Tables_Fk)
        VALUES (?, ?, ?, ?)
      `;

      db.query(reservationSql, [reservationDate, reservationTime, customerId, tableId], (err, reservationResult) => {
        if (err) {
          console.error('❌ Error saving reservation:', err);
          return res.status(500).json({ success: false, error: 'Error saving reservation' });
        }

        console.log('✅ Reservation saved:', reservationResult);
        res.json({ success: true, reservationId: reservationResult.insertId });
      });
    });
  });
});

// Přidání routeru
app.use('/backend', router);

// Start serveru
app.listen(port, () => console.log(`✅ Node backend running at http://localhost:${port}`));


