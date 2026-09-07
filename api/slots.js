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

  const { date } = req.query;
  const targetDate = date || new Date().toISOString().split('T')[0];

  const defaultHours = [
    { start: '09:00', end: '10:00', startLabel: '09:00 AM', endLabel: '10:00 AM' },
    { start: '10:00', end: '11:00', startLabel: '10:00 AM', endLabel: '11:00 AM' },
    { start: '11:30', end: '12:30', startLabel: '11:30 AM', endLabel: '12:30 PM' },
    { start: '14:00', end: '15:00', startLabel: '02:00 PM', endLabel: '03:00 PM' },
    { start: '15:30', end: '16:30', startLabel: '03:30 PM', endLabel: '04:30 PM' },
    { start: '16:30', end: '17:30', startLabel: '04:30 PM', endLabel: '05:30 PM' },
  ];

  const d = new Date(targetDate + 'T00:00:00Z');
  const formattedDate = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: '2-digit', year: 'numeric' });

  const slots = defaultHours.map((h, idx) => ({
    id: `slot-${targetDate}-${idx + 1}`,
    start_time: `${targetDate}T${h.start}:00Z`,
    end_time: `${targetDate}T${h.end}:00Z`,
    formatted_start_time: h.startLabel,
    formatted_end_time: h.endLabel,
    formatted_date: formattedDate,
    status: 'available',
    is_available: true,
    is_past: false,
    duration_minutes: 60,
  }));

  return res.status(200).json({ data: slots });
}
