//nastavení serveru
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

//ROUTER (endpointy mají tvar /backend/)
const router = express.Router();

//testovací endpoint
router.get('/ping', (req, res) => res.send('Backend is alive'));

// Endpoint pro získání zpráv
router.get('/admin/messages', (req, res) => {
  const sql = 'SELECT * FROM MESSAGES ORDER BY id_messages ASC';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('❌ Error fetching messages:', err);
      return res.status(500).json({ success: false, error: 'Error fetching messages' });
    }

    const transformedResults = results.map(row => ({
      id_messages: row.id_messages,
      answered: row.answered, 
      text: `Name: ${row.name}\nEmail: ${row.email}\nMessage: ${row.message}`
    }));

    res.json({ success: true, data: transformedResults });
  });
});



// Endpoint pro získání rezervací ubytování
router.get('/admin/accommodation', (req, res) => {
  const sql = `
    SELECT 
      r.id_reservations,
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

    const transformedResults = results.map(row => {
    const formattedStartDate = new Date(row.date_start).toDateString();
    const formattedEndDate = new Date(row.date_end).toDateString();
    return {
      id_reservations: row.id_reservations,
      text: `Room: ${row.room_number} (Capacity: ${row.room_capacity})\nName: ${row.customer_name}\nEmail: ${row.customer_email}\nPhone: ${row.customer_phone}\nCity: ${row.customer_city}\nStreet: ${row.customer_street}\nZIP: ${row.customer_ZIP}\nCountry: ${row.customer_country}\nCheck-in Date: ${formattedStartDate}\nCheck-out Date: ${formattedEndDate}`
    };
  });


    res.json({ success: true, data: transformedResults });
  });
});

// Endpoint pro získání rezervací ubytování podle čísla pokoje
router.get('/admin/accommodation/:roomNumber', (req, res) => {
  const roomNumber = req.params.roomNumber;
  const sql = `
    SELECT 
      r.id_reservations,
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
    WHERE rm.number = ?
    ORDER BY r.date_start ASC
  `;
  db.query(sql, [roomNumber], (err, results) => {
    if (err) {
      console.error('❌ Error fetching filtered room reservations:', err);
      return res.status(500).json({ success: false, error: 'Error fetching filtered reservations' });
    }

    const transformedResults = results.map(row => ({
      id_reservations: row.id_reservations,
      text: `Room: ${row.room_number} (Capacity: ${row.room_capacity})\nName: ${row.customer_name}\nEmail: ${row.customer_email}\nPhone: ${row.customer_phone}\nCity: ${row.customer_city}\nStreet: ${row.customer_street}\nZIP: ${row.customer_ZIP}\nCountry: ${row.customer_country}\nCheck-in Date: ${new Date(row.date_start).toDateString()}\nCheck-out Date: ${new Date(row.date_end).toDateString()}`
    }));

    res.json({ success: true, data: transformedResults });
  });
});


// Endpoint pro získání rezervací restaurace
router.get('/admin/restaurant/:tableNumber', (req, res) => {
  const tableNumber = req.params.tableNumber;
  const sql = `
    SELECT 
      r.id_reservations,
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
    WHERE t.number = ?
    ORDER BY r.date_start ASC, r.time ASC
  `;

  db.query(sql, [tableNumber], (err, results) => {
    if (err) {
      console.error('❌ Error fetching filtered table reservations:', err);
      return res.status(500).json({ success: false, error: 'Error fetching filtered reservations' });
    }

    const transformedResults = results.map(row => {
      const formattedDate = new Date(row.date_start).toDateString();
      const formattedTime = row.time.slice(0, 5);
      return {
        id_reservations: row.id_reservations,
        text: `Table: ${row.table_number} (Seats: ${row.table_seats})\nName: ${row.customer_name}\nEmail: ${row.customer_email}\nPhone: ${row.customer_phone}\nDate: ${formattedDate}\nTime: ${formattedTime}`
      };
    });

    res.json({ success: true, data: transformedResults });
  });
});
// Endpoint pro získání všech rezervací restaurace
router.get('/admin/restaurant', (req, res) => {
  const sql = `
    SELECT 
      r.id_reservations,
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
    ORDER BY r.date_start ASC, r.time ASC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('❌ Error fetching all restaurant reservations:', err);
      return res.status(500).json({ success: false, error: 'Error fetching restaurant reservations' });
    }

    const transformedResults = results.map(row => {
      const formattedDate = new Date(row.date_start).toDateString();
      const formattedTime = row.time.slice(0, 5);
      return {
        id_reservations: row.id_reservations,
        text: `\nTable: ${row.table_number} (Seats: ${row.table_seats})\nName: ${row.customer_name}\nEmail: ${row.customer_email}\nPhone: ${row.customer_phone}\nDate: ${formattedDate}\nTime: ${formattedTime}`
      };
    });

    res.json({ success: true, data: transformedResults });
  });
});






// Endpointy rooms a tables (pro plánky)
router.get('/admin/rooms', (req, res) => {
  const sql = 'SELECT number FROM Rooms ORDER BY number ASC';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('❌ Error fetching room list:', err);
      return res.status(500).json({ success: false, error: 'Error fetching room list' });
    }
    res.json({ success: true, data: results });
  });
});

router.get('/admin/tables', (req, res) => {
  const sql = 'SELECT number FROM Tables ORDER BY number ASC';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('❌ Error fetching table list:', err);
      return res.status(500).json({ success: false, error: 'Error fetching table list' });
    }
    res.json({ success: true, data: results });
  });
});

// Endpoint pro kontrolu dostupnosti pokojů
router.post('/availability', (req, res) => {
  const { guests, checkInDate, checkOutDate } = req.body;
  const sql = `
    SELECT id_rooms, number, capacity
    FROM Rooms
    WHERE capacity >= ?
      AND id_rooms NOT IN (
        SELECT Rooms_Fk FROM Reservations
        WHERE NOT (date_end <= ? OR date_start >= ?)
      )
    ORDER BY capacity ASC
  `;
  db.query(sql, [guests, checkInDate, checkOutDate], (err, results) => {
    if (err) return res.status(500).json({ success: false, error: 'DB error' });
    res.json({ success: true, rooms: results });
  });
});

// Endpoint pro kontrolu dostupnosti restaurace
router.post('/restaurantAvailability', (req, res) => {
  const { reservationDate, reservationTime, guests } = req.body;
  const sql = `
    SELECT id_tables FROM Tables
    WHERE seats >= ?
    AND id_tables NOT IN (
      SELECT Tables_Fk FROM Reservations
      WHERE date_start = ?
      AND TIME_TO_SEC(TIMEDIFF(time, ?)) BETWEEN -7200 AND 7200
    )
    LIMIT 1
  `;
  db.query(sql, [guests, reservationDate, reservationTime], (err, result) => {
    if (err) return res.status(500).json({ success: false, error: 'Error checking availability' });
    if (result.length === 0) return res.json({ success: false });
    res.json({ success: true });
  });
});

// Endpoint pro vytvoření rezervace pokoje
router.post('/bookNow', (req, res) => {
  const { firstName, lastName, email, countryCode, phone, city, street, postalCode, country, checkInDate, checkOutDate, selectedRoomId } = req.body;

  const name = `${firstName} ${lastName}`;
  const phoneNumber = `${countryCode} ${phone}`;

  const customerSql = `
    INSERT INTO Customers (name, email, phone_number, city, street, postal_code, country)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(customerSql, [name, email, phoneNumber, city, street, postalCode, country], (err, customerResult) => {
    if (err) return res.status(500).json({ success: false, error: 'Error saving customer' });
    const customerId = customerResult.insertId;

    const reservationSql = `
      INSERT INTO Reservations (date_start, date_end, Customers_Fk, Rooms_Fk)
      VALUES (?, ?, ?, ?)
    `;

    db.query(reservationSql, [checkInDate, checkOutDate, customerId, selectedRoomId], (err, reservationResult) => {
      if (err) return res.status(500).json({ success: false, error: 'Error saving reservation' });
      res.json({ success: true, reservationId: reservationResult.insertId });
    });
  });
});

// Endpoint pro odeslání kontaktního formuláře
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


// Endpoint pro vytvoření rezervace restaurace
router.post('/restaurantReservation', (req, res) => {
  const { name, email, phone, reservationDate, reservationTime, guests } = req.body;

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
    if (err || tableResult.length === 0) {
      return res.status(400).json({ success: false, error: 'No available table' });
    }

    const tableId = tableResult[0].id_tables;

    const customerSql = `INSERT INTO Customers (name, email, phone_number) VALUES (?, ?, ?)`;
    db.query(customerSql, [name, email, phone], (err, customerResult) => {
      if (err) return res.status(500).json({ success: false, error: 'Error saving customer' });

      const customerId = customerResult.insertId;

      const reservationSql = `INSERT INTO Reservations (date_start, time, Customers_Fk, Tables_Fk) VALUES (?, ?, ?, ?)`;
      db.query(reservationSql, [reservationDate, reservationTime, customerId, tableId], (err, reservationResult) => {
        if (err) return res.status(500).json({ success: false, error: 'Error saving reservation' });
        res.json({ success: true, reservationId: reservationResult.insertId });
      });
    });
  });
});

//mazání zpráv
router.delete('/admin/messages/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM MESSAGES WHERE id_messages = ?';

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('❌ Error deleting message:', err);
      return res.status(500).json({ success: false, error: 'Error deleting message' });
    }

    res.json({ success: true });
  });
});

// mazání rezervací
router.delete('/admin/reservations/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM Reservations WHERE id_reservations = ?';

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('❌ Error deleting reservation:', err);
      return res.status(500).json({ success: false, error: 'Error deleting reservation' });
    }

    res.json({ success: true });
  });
});

// Označení zprávy jako zodpovězené
router.put('/admin/messages/:id/answered', (req, res) => {
  const { id } = req.params;
  const { answered } = req.body;
  const sql = 'UPDATE MESSAGES SET answered = ? WHERE id_messages = ?';

  db.query(sql, [answered, id], (err, result) => {
    if (err) {
      console.error('❌ Error updating message:', err);
      return res.status(500).json({ success: false, error: 'Error updating message' });
    }

    res.json({ success: true });
  });
});




//spuštění serveru
app.use('/backend', router);

app.listen(port, () => console.log(`✅ Node backend running at http://localhost:${port}`));
