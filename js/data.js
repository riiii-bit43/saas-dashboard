/* IRCTC Mock Dataset & Station Database */

const STATIONS = [
  { code: 'NDLS', name: 'New Delhi Railway Station', city: 'New Delhi' },
  { code: 'HWH', name: 'Howrah Junction', city: 'Kolkata' },
  { code: 'CSMT', name: 'Chhatrapati Shivaji Maharaj Terminus', city: 'Mumbai' },
  { code: 'SBC', name: 'KSR Bengaluru City Junction', city: 'Bengaluru' },
  { code: 'PNBE', name: 'Patna Junction', city: 'Patna' },
  { code: 'MAS', name: 'Chennai Central', city: 'Chennai' },
  { code: 'ADI', name: 'Ahmedabad Junction', city: 'Ahmedabad' },
  { code: 'JP', name: 'Jaipur Junction', city: 'Jaipur' },
  { code: 'CNB', name: 'Kanpur Central', city: 'Kanpur' },
  { code: 'LKO', name: 'Lucknow Charbagh', city: 'Lucknow' }
];

const SAVED_PASSENGERS = [
  { id: 'p1', name: 'Vikram Sharma', age: 29, gender: 'Male', berth: 'Lower', selected: true },
  { id: 'p2', name: 'Priya Sharma', age: 28, gender: 'Female', berth: 'Window', selected: false },
  { id: 'p3', name: 'Ramesh Sharma', age: 62, gender: 'Male', berth: 'Lower (Sr. Citizen)', selected: false }
];

const TRAINS_DATABASE = [
  {
    number: '22436',
    name: 'Vande Bharat Express',
    from: 'NDLS',
    to: 'PNBE',
    deptTime: '06:00',
    arrivalTime: '14:00',
    duration: '08h 00m',
    speedClass: 'Superfast Express',
    days: ['M', 'T', 'W', 'T', 'F', 'S'],
    classes: [
      { code: 'CC', price: 1750, status: 'AVAILABLE-0042', statusType: 'available', prob: 98 },
      { code: 'EC', price: 3300, status: 'AVAILABLE-0012', statusType: 'available', prob: 100 }
    ]
  },
  {
    number: '12310',
    name: 'Patna Rajdhani Express',
    from: 'NDLS',
    to: 'PNBE',
    deptTime: '17:15',
    arrivalTime: '05:30',
    duration: '12h 15m',
    speedClass: 'Rajdhani',
    days: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
    classes: [
      { code: '3A', price: 2150, status: 'AVAILABLE-0085', statusType: 'available', prob: 95 },
      { code: '2A', price: 3080, status: 'RAC 04', statusType: 'rac', prob: 88 },
      { code: '1A', price: 4420, status: 'WL 02', statusType: 'wl', prob: 65 }
    ]
  },
  {
    number: '12394',
    name: 'Sampoorna Kranti Express',
    from: 'NDLS',
    to: 'PNBE',
    deptTime: '17:30',
    arrivalTime: '06:45',
    duration: '13h 15m',
    speedClass: 'Superfast',
    days: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
    classes: [
      { code: 'SL', price: 485, status: 'WL 42', statusType: 'wl', prob: 40 },
      { code: '3A', price: 1350, status: 'RAC 12', statusType: 'rac', prob: 78 },
      { code: '2A', price: 1980, status: 'AVAILABLE-0008', statusType: 'available', prob: 92 }
    ]
  },
  {
    number: '12260',
    name: 'Sealdah Duronto Express',
    from: 'NDLS',
    to: 'HWH',
    deptTime: '19:45',
    arrivalTime: '12:40',
    duration: '16h 55m',
    speedClass: 'Duronto',
    days: ['M', 'W', 'F', 'S'],
    classes: [
      { code: '3A', price: 2450, status: 'AVAILABLE-0120', statusType: 'available', prob: 99 },
      { code: '2A', price: 3540, status: 'AVAILABLE-0024', statusType: 'available', prob: 96 }
    ]
  }
];

const MOCK_PNRS = {
  '8429104523': {
    pnr: '8429104523',
    trainNumber: '12310',
    trainName: 'Patna Rajdhani Express',
    from: 'NDLS',
    to: 'PNBE',
    date: '2026-08-25',
    passengers: [
      { name: 'Vikram Sharma', bookingStatus: 'CNF / B3 / 42 (Lower)', currentStatus: 'CNF' }
    ],
    timeline: [
      { station: 'New Delhi (NDLS)', time: '17:15', status: 'completed', label: 'Departed On Time' },
      { station: 'Kanpur Central (CNB)', time: '21:55', status: 'completed', label: 'Passed 21:58 (+3m)' },
      { station: 'Prayagraj Jn (PRYJ)', time: '00:45', status: 'current', label: 'Arriving Platform 4' },
      { station: 'DDU Junction (DDU)', time: '03:15', status: 'upcoming', label: 'Scheduled' },
      { station: 'Patna Junction (PNBE)', time: '05:30', status: 'upcoming', label: 'Destination' }
    ]
  }
};
