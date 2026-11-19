import { db } from './db.js';

// Helper to parse JSON body from incoming Node.js IncomingMessage
export const parseBody = (req) => {
  if (req.body && typeof req.body === 'object') {
    return Promise.resolve(req.body);
  }
  return new Promise((resolve) => {
    if (req.readableEnded) {
      return resolve({});
    }
    let data = '';
    req.on('data', chunk => {
      data += chunk;
    });
    req.on('end', () => {
      if (!data) return resolve({});
      try {
        resolve(JSON.parse(data));
      } catch (e) {
        resolve({});
      }
    });
    req.on('error', () => resolve({}));
  });
};

// Helper to send JSON responses
export const sendJson = (res, statusCode, payload) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.statusCode = statusCode;
  res.end(JSON.stringify(payload));
};

// Main Backend Request Dispatcher
export const handleApiRequest = async (req, res) => {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.statusCode = 204;
    return res.end();
  }

  // Parse path
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname.replace(/^\/api/, '');
  const method = req.method;

  try {
    // 1. HEALTH CHECK
    if (pathname === '/health') {
      return sendJson(res, 200, {
        status: 'online',
        service: 'E-VAHAN Central Multi-Vendor EV Marketplace API',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        stats: {
          realOrders: db.get('orders').length,
          testDrives: db.get('testDrives').length,
          serviceBookings: db.get('services').length,
          categories: db.get('categories').length,
          brands: db.get('brands').length,
          registeredUsers: db.get('users').length
        }
      });
    }

    // 2. VEHICLES
    if (pathname === '/vehicles') {
      if (method === 'GET') {
        return sendJson(res, 200, db.get('vehicles'));
      }
      if (method === 'POST') {
        const body = await parseBody(req);
        const item = { ...body, id: body.id || `veh-${Date.now()}` };
        db.insert('vehicles', item);
        return sendJson(res, 201, item);
      }
    }

    if (pathname.startsWith('/vehicles/')) {
      const slugOrId = pathname.replace('/vehicles/', '');
      const vehicles = db.get('vehicles');
      const item = vehicles.find(v => v.slug === slugOrId || v.id === slugOrId);
      if (item) {
        return sendJson(res, 200, item);
      }
      return sendJson(res, 404, { error: 'Vehicle not found' });
    }

    // 3. CATEGORIES
    if (pathname === '/categories') {
      if (method === 'GET') {
        return sendJson(res, 200, db.get('categories'));
      }
      if (method === 'POST') {
        const body = await parseBody(req);
        const newCat = {
          ...body,
          id: body.id || `cat-${Date.now()}`,
          status: body.status || 'ACTIVE'
        };
        db.insert('categories', newCat);
        return sendJson(res, 201, newCat);
      }
    }

    if (pathname.startsWith('/categories/')) {
      const id = pathname.replace('/categories/', '');
      if (method === 'PUT') {
        const body = await parseBody(req);
        const updated = db.update('categories', id, body);
        return sendJson(res, 200, updated || { error: 'Not found' });
      }
      if (method === 'DELETE') {
        db.delete('categories', id);
        return sendJson(res, 200, { success: true, id });
      }
    }

    // 4. SUB-CATEGORIES
    if (pathname === '/subcategories') {
      if (method === 'GET') {
        return sendJson(res, 200, db.get('subcategories'));
      }
      if (method === 'POST') {
        const body = await parseBody(req);
        const newSub = {
          ...body,
          id: body.id || `sub-${Date.now()}`,
          status: body.status || 'ACTIVE'
        };
        db.insert('subcategories', newSub);
        return sendJson(res, 201, newSub);
      }
    }

    if (pathname.startsWith('/subcategories/')) {
      const id = pathname.replace('/subcategories/', '');
      if (method === 'PUT') {
        const body = await parseBody(req);
        const updated = db.update('subcategories', id, body);
        return sendJson(res, 200, updated || { error: 'Not found' });
      }
      if (method === 'DELETE') {
        db.delete('subcategories', id);
        return sendJson(res, 200, { success: true, id });
      }
    }

    // 5. BRANDS
    if (pathname === '/brands') {
      if (method === 'GET') {
        return sendJson(res, 200, db.get('brands'));
      }
      if (method === 'POST') {
        const body = await parseBody(req);
        const newBrand = {
          ...body,
          id: body.id || `brd-${Date.now()}`,
          status: body.status || 'ACTIVE',
          isVerified: true
        };
        db.insert('brands', newBrand);
        return sendJson(res, 201, newBrand);
      }
    }

    if (pathname.startsWith('/brands/')) {
      const id = pathname.replace('/brands/', '');
      if (method === 'PUT') {
        const body = await parseBody(req);
        const updated = db.update('brands', id, body);
        return sendJson(res, 200, updated || { error: 'Not found' });
      }
      if (method === 'DELETE') {
        db.delete('brands', id);
        return sendJson(res, 200, { success: true, id });
      }
    }

    // 6. REAL VEHICLE ORDERS (Connected to Frontend Checkout)
    if (pathname === '/orders') {
      if (method === 'GET') {
        return sendJson(res, 200, db.get('orders'));
      }
      if (method === 'POST') {
        const body = await parseBody(req);
        const randNum = Math.floor(10000 + Math.random() * 90000);
        const newOrder = {
          ...body,
          id: body.id || `ord-veh-${Date.now()}`,
          orderNumber: body.orderNumber || `ORD-EV-${new Date().getFullYear()}-${randNum}`,
          status: body.status || 'BOOKING_CONFIRMED',
          createdAt: new Date().toISOString()
        };
        db.insert('orders', newOrder);
        return sendJson(res, 201, newOrder);
      }
    }

    if (pathname.startsWith('/orders/')) {
      const id = pathname.replace('/orders/', '');
      if (method === 'PUT') {
        const body = await parseBody(req);
        const updated = db.update('orders', id, body);
        return sendJson(res, 200, updated || { error: 'Not found' });
      }
    }

    // 7. REAL TEST DRIVES
    if (pathname === '/test-drives') {
      if (method === 'GET') {
        return sendJson(res, 200, db.get('testDrives'));
      }
      if (method === 'POST') {
        const body = await parseBody(req);
        const randNum = Math.floor(1000 + Math.random() * 9000);
        const newBooking = {
          ...body,
          id: body.id || `td-${Date.now()}`,
          bookingNumber: body.bookingNumber || `TD-${new Date().getFullYear()}-${randNum}`,
          status: 'CONFIRMED',
          createdAt: new Date().toISOString()
        };
        db.insert('testDrives', newBooking);
        return sendJson(res, 201, newBooking);
      }
    }

    if (pathname.startsWith('/test-drives/')) {
      const id = pathname.replace('/test-drives/', '');
      if (method === 'PUT') {
        const body = await parseBody(req);
        const updated = db.update('testDrives', id, body);
        return sendJson(res, 200, updated || { error: 'Not found' });
      }
    }

    // 8. REAL QUOTATIONS
    if (pathname === '/quotations') {
      if (method === 'GET') {
        return sendJson(res, 200, db.get('quotations'));
      }
      if (method === 'POST') {
        const body = await parseBody(req);
        const randNum = Math.floor(1000 + Math.random() * 9000);
        const expiry = new Date();
        expiry.setDate(expiry.getDate() + 15);
        const newQuote = {
          ...body,
          id: body.id || `qt-${Date.now()}`,
          quotationNumber: body.quotationNumber || `QT-${new Date().getFullYear()}-${randNum}`,
          status: 'QUOTE_PREPARED',
          validUntil: expiry.toISOString(),
          createdAt: new Date().toISOString()
        };
        db.insert('quotations', newQuote);
        return sendJson(res, 201, newQuote);
      }
    }

    if (pathname.startsWith('/quotations/')) {
      const id = pathname.replace('/quotations/', '');
      if (method === 'PUT') {
        const body = await parseBody(req);
        const updated = db.update('quotations', id, body);
        return sendJson(res, 200, updated || { error: 'Not found' });
      }
    }

    // 9. REAL DOORSTEP SERVICES
    if (pathname === '/services') {
      if (method === 'GET') {
        return sendJson(res, 200, db.get('services'));
      }
      if (method === 'POST') {
        const body = await parseBody(req);
        const randNum = Math.floor(1000 + Math.random() * 9000);
        const newService = {
          ...body,
          id: body.id || `srv-${Date.now()}`,
          bookingNumber: body.bookingNumber || `SRV-${new Date().getFullYear()}-${randNum}`,
          status: 'CONFIRMED',
          technician: {
            name: 'Santosh Kumar',
            phone: '+91 98112 34567',
            vanNumber: 'DL-1EV-8899',
            rating: 4.95
          },
          createdAt: new Date().toISOString()
        };
        db.insert('services', newService);
        return sendJson(res, 201, newService);
      }
    }

    if (pathname.startsWith('/services/')) {
      const id = pathname.replace('/services/', '');
      if (method === 'PUT') {
        const body = await parseBody(req);
        const updated = db.update('services', id, body);
        return sendJson(res, 200, updated || { error: 'Not found' });
      }
    }

    // 10. REAL SPARE PARTS ORDERS
    if (pathname === '/parts-orders') {
      if (method === 'GET') {
        return sendJson(res, 200, db.get('partsOrders'));
      }
      if (method === 'POST') {
        const body = await parseBody(req);
        const randNum = Math.floor(1000 + Math.random() * 9000);
        const newOrder = {
          ...body,
          id: body.id || `ord-part-${Date.now()}`,
          orderNumber: body.orderNumber || `ORD-PRT-${new Date().getFullYear()}-${randNum}`,
          status: 'PROCESSING',
          createdAt: new Date().toISOString()
        };
        db.insert('partsOrders', newOrder);
        return sendJson(res, 201, newOrder);
      }
    }

    // 11. REAL SUPPORT TICKETS
    if (pathname === '/tickets') {
      if (method === 'GET') {
        return sendJson(res, 200, db.get('tickets'));
      }
      if (method === 'POST') {
        const body = await parseBody(req);
        const randNum = Math.floor(1000 + Math.random() * 9000);
        const newTicket = {
          ...body,
          id: body.id || `tkt-${Date.now()}`,
          ticketNumber: body.ticketNumber || `TKT-${new Date().getFullYear()}-${randNum}`,
          status: 'OPEN',
          createdAt: new Date().toISOString(),
          messages: body.messages || [
            {
              id: `msg-${Date.now()}`,
              sender: 'CUSTOMER',
              senderName: body.customerName || 'Customer',
              text: body.message || body.subject || '',
              timestamp: new Date().toISOString()
            }
          ]
        };
        db.insert('tickets', newTicket);
        return sendJson(res, 201, newTicket);
      }
    }

    if (pathname.endsWith('/reply') && method === 'POST') {
      const ticketId = pathname.replace('/tickets/', '').replace('/reply', '');
      const body = await parseBody(req);
      const tickets = db.get('tickets');
      const ticket = tickets.find(t => t.id === ticketId);
      if (ticket) {
        ticket.messages.push({
          id: `msg-${Date.now()}`,
          sender: body.sender || 'SUPPORT_AGENT',
          senderName: body.senderName || 'E-VAHAN Support Desk',
          text: body.text || '',
          timestamp: new Date().toISOString()
        });
        db.save();
        return sendJson(res, 200, ticket);
      }
      return sendJson(res, 404, { error: 'Ticket not found' });
    }

    // 12. REAL REGISTERED USERS
    if (pathname === '/users') {
      if (method === 'GET') {
        return sendJson(res, 200, db.get('users'));
      }
      if (method === 'POST') {
        const body = await parseBody(req);
        const cleanPhone = (body.phone || '').replace(/\D/g, '').trim();
        const users = db.get('users');
        const existingIndex = users.findIndex(u => u.phone.replace(/\D/g, '').trim() === cleanPhone);
        if (existingIndex >= 0) {
          users[existingIndex] = { ...users[existingIndex], ...body };
          db.save();
          return sendJson(res, 200, users[existingIndex]);
        } else {
          const newUser = {
            ...body,
            id: body.id || `usr-${Date.now()}`,
            createdAt: new Date().toISOString()
          };
          db.insert('users', newUser);
          return sendJson(res, 201, newUser);
        }
      }
    }

    // 13. ANNOUNCEMENTS
    if (pathname === '/announcements') {
      if (method === 'GET') {
        return sendJson(res, 200, db.get('announcements'));
      }
      if (method === 'POST') {
        const body = await parseBody(req);
        const list = Array.isArray(body) ? body : (body.announcements || []);
        db.set('announcements', list);
        return sendJson(res, 200, list);
      }
    }

    // 14. REVIEWS
    if (pathname === '/reviews') {
      if (method === 'GET') {
        return sendJson(res, 200, db.get('reviews'));
      }
      if (method === 'POST') {
        const body = await parseBody(req);
        const newReview = {
          ...body,
          id: body.id || `rev-${Date.now()}`,
          verifiedBuyer: true,
          date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
        };
        db.insert('reviews', newReview);
        return sendJson(res, 201, newReview);
      }
    }

    // 15. SYNC ALL (Backup / restore state)
    if (pathname === '/sync/all') {
      if (method === 'GET') {
        return sendJson(res, 200, db.data);
      }
      if (method === 'POST') {
        const body = await parseBody(req);
        db.data = { ...db.data, ...body };
        db.save();
        return sendJson(res, 200, { success: true });
      }
    }

    // 404 Route Not Found
    return sendJson(res, 404, { error: `Endpoint ${method} ${pathname} not found on backend` });

  } catch (error) {
    console.error('API Error:', error);
    return sendJson(res, 500, { error: 'Internal Server Error', message: error.message });
  }
};
