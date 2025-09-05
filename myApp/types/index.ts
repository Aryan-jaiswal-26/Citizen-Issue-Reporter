export interface Issue {
  id: string;
  title: string;
  category: 'Road' | 'Water' | 'Garbage' | 'Electricity';
  description: string;
  image?: string;
  status: 'Pending' | 'In Progress' | 'Resolved';
  location: {
    latitude: number;
    longitude: number;
  };
  createdAt: string;
  upvotes: number;
  officerNotes?: string;
}

export type RootStackParamList = {
  MainTabs: undefined;
  IssueDetails: { issue: Issue };
};

export type TabParamList = {
  Home: undefined;
  Report: undefined;
  MyIssues: undefined;
  Notifications: undefined;
};