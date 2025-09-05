import { Issue } from '../types';

export const mockIssues: Issue[] = [
  {
    id: '1',
    title: 'Large pothole on Main Street',
    category: 'Road',
    description: 'Deep pothole causing damage to vehicles near the intersection',
    status: 'Pending',
    location: { latitude: 37.7749, longitude: -122.4194 },
    createdAt: '2024-01-15',
    upvotes: 12,
    officerNotes: 'Issue reported to road maintenance department'
  },
  {
    id: '2',
    title: 'Water pipe burst',
    category: 'Water',
    description: 'Water leaking from underground pipe flooding the sidewalk',
    status: 'In Progress',
    location: { latitude: 37.7849, longitude: -122.4094 },
    createdAt: '2024-01-14',
    upvotes: 8,
    officerNotes: 'Repair crew dispatched, work in progress'
  },
  {
    id: '3',
    title: 'Overflowing garbage bin',
    category: 'Garbage',
    description: 'Garbage bin overflowing for past 3 days, attracting pests',
    status: 'Resolved',
    location: { latitude: 37.7649, longitude: -122.4294 },
    createdAt: '2024-01-13',
    upvotes: 5,
    officerNotes: 'Garbage collected and bin cleaned'
  },
  {
    id: '4',
    title: 'Street light not working',
    category: 'Electricity',
    description: 'Street light has been out for a week, making area unsafe at night',
    status: 'Pending',
    location: { latitude: 37.7549, longitude: -122.4394 },
    createdAt: '2024-01-12',
    upvotes: 15,
    officerNotes: 'Electrical team notified'
  }
];