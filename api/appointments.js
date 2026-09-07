export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    const { slot_id, name, email } = req.body || {};
    if (!name || !email || !slot_id) {
      return res.status(422).json({
        message: 'Validation failed',
        errors: {
          name: !name ? ['The name field is required.'] : [],
          email: !email ? ['The email field is required.'] : [],
        }
      });
    }

    const appointment = {
      id: `apt-${Date.now()}`,
      status: 'confirmed',
      cancellation_reason: null,
      created_at: new Date().toISOString(),
      user: { id: 1, name, email },
      slot: {
        id: slot_id,
        start_time: new Date().toISOString(),
        end_time: new Date().toISOString(),
        formatted_start_time: '10:00 AM',
        formatted_end_time: '11:00 AM',
        formatted_date: new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: '2-digit', year: 'numeric' }),
        status: 'booked',
        is_available: false,
        duration_minutes: 60
      },
      is_upcoming: true,
    };

    return res.status(201).json({
      message: 'Appointment booked successfully!',
      data: appointment
    });
  }

  if (req.method === 'GET') {
    return res.status(200).json({ data: [] });
  }

  if (req.method === 'PATCH') {
    return res.status(200).json({
      message: 'Appointment cancelled successfully.',
      data: { status: 'cancelled' }
    });
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
