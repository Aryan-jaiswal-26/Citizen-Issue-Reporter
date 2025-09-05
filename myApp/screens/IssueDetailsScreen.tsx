import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../types';

type IssueDetailsRouteProp = RouteProp<RootStackParamList, 'IssueDetails'>;

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Pending': return '#FF6B6B';
    case 'In Progress': return '#4ECDC4';
    case 'Resolved': return '#27AE60';
    default: return '#95A5A6';
  }
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Road': return 'car-outline';
    case 'Water': return 'water-outline';
    case 'Garbage': return 'trash-outline';
    case 'Electricity': return 'flash-outline';
    default: return 'alert-circle-outline';
  }
};

const StatusTimeline = ({ currentStatus }: { currentStatus: string }) => {
  const statuses = ['Pending', 'In Progress', 'Resolved'];
  const currentIndex = statuses.indexOf(currentStatus);

  return (
    <View style={styles.timeline}>
      {statuses.map((status, index) => (
        <View key={status} style={styles.timelineItem}>
          <View style={styles.timelineLeft}>
            <View style={[
              styles.timelineCircle,
              index <= currentIndex && styles.activeCircle
            ]}>
              {index <= currentIndex && (
                <Ionicons name="checkmark" size={12} color="#FFFFFF" />
              )}
            </View>
            {index < statuses.length - 1 && (
              <View style={[
                styles.timelineLine,
                index < currentIndex && styles.activeLine
              ]} />
            )}
          </View>
          <View style={styles.timelineContent}>
            <Text style={[
              styles.timelineStatus,
              index <= currentIndex && styles.activeStatus
            ]}>
              {status}
            </Text>
            {index <= currentIndex && (
              <Text style={styles.timelineDate}>
                {index === 0 ? 'Reported' : index === 1 ? 'In Progress' : 'Completed'}
              </Text>
            )}
          </View>
        </View>
      ))}
    </View>
  );
};

export default function IssueDetailsScreen() {
  const route = useRoute<IssueDetailsRouteProp>();
  const { issue } = route.params;
  const [upvoted, setUpvoted] = useState(false);
  const [upvoteCount, setUpvoteCount] = useState(issue.upvotes);

  const handleUpvote = () => {
    if (upvoted) {
      setUpvoteCount(prev => prev - 1);
    } else {
      setUpvoteCount(prev => prev + 1);
    }
    setUpvoted(!upvoted);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        <View style={styles.imagePlaceholder}>
          <Ionicons name={getCategoryIcon(issue.category)} size={64} color="#BDC3C7" />
          <Text style={styles.imagePlaceholderText}>Issue Photo</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(issue.status) }]}>
          <Text style={styles.statusText}>{issue.status}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{issue.title}</Text>
          <Text style={styles.category}>{issue.category}</Text>
          <Text style={styles.date}>Reported on {issue.createdAt}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{issue.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Status Timeline</Text>
          <StatusTimeline currentStatus={issue.status} />
        </View>

        {issue.officerNotes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Officer Notes</Text>
            <View style={styles.notesContainer}>
              <Ionicons name="person-circle-outline" size={24} color="#7F8C8D" />
              <Text style={styles.notes}>{issue.officerNotes}</Text>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Community Support</Text>
          <TouchableOpacity 
            style={[styles.upvoteButton, upvoted && styles.upvotedButton]}
            onPress={handleUpvote}
          >
            <Ionicons 
              name={upvoted ? "arrow-up" : "arrow-up-outline"} 
              size={24} 
              color={upvoted ? "#FFFFFF" : "#3498DB"} 
            />
            <Text style={[styles.upvoteText, upvoted && styles.upvotedText]}>
              {upvoteCount} {upvoteCount === 1 ? 'Upvote' : 'Upvotes'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  imageContainer: {
    height: 250,
    position: 'relative',
  },
  imagePlaceholder: {
    flex: 1,
    backgroundColor: '#E8F4FD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    fontSize: 16,
    color: '#7F8C8D',
    marginTop: 8,
  },
  statusBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 8,
  },
  category: {
    fontSize: 16,
    color: '#3498DB',
    fontWeight: '600',
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#34495E',
    lineHeight: 24,
  },
  timeline: {
    paddingLeft: 8,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  timelineLeft: {
    alignItems: 'center',
    marginRight: 16,
  },
  timelineCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E1E8ED',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeCircle: {
    backgroundColor: '#27AE60',
  },
  timelineLine: {
    width: 2,
    height: 40,
    backgroundColor: '#E1E8ED',
    marginTop: 4,
  },
  activeLine: {
    backgroundColor: '#27AE60',
  },
  timelineContent: {
    flex: 1,
    paddingBottom: 20,
  },
  timelineStatus: {
    fontSize: 16,
    fontWeight: '600',
    color: '#95A5A6',
  },
  activeStatus: {
    color: '#2C3E50',
  },
  timelineDate: {
    fontSize: 14,
    color: '#7F8C8D',
    marginTop: 4,
  },
  notesContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#3498DB',
  },
  notes: {
    flex: 1,
    fontSize: 16,
    color: '#34495E',
    lineHeight: 22,
    marginLeft: 12,
  },
  upvoteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#3498DB',
    borderRadius: 12,
    padding: 16,
  },
  upvotedButton: {
    backgroundColor: '#3498DB',
    borderColor: '#3498DB',
  },
  upvoteText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3498DB',
    marginLeft: 8,
  },
  upvotedText: {
    color: '#FFFFFF',
  },
});