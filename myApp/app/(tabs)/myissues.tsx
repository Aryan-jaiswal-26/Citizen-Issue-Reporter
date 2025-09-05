import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { mockIssues } from '../../data/mockData';
import { Issue } from '../../types';

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Road': return 'car-outline';
    case 'Water': return 'water-outline';
    case 'Garbage': return 'trash-outline';
    case 'Electricity': return 'flash-outline';
    default: return 'alert-circle-outline';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Pending': return '#FF6B6B';
    case 'In Progress': return '#4ECDC4';
    case 'Resolved': return '#45B7D1';
    default: return '#95A5A6';
  }
};

const IssueCard = ({ item }: { item: Issue }) => (
  <TouchableOpacity style={styles.issueCard}>
    <View style={styles.cardHeader}>
      <View style={styles.thumbnailContainer}>
        <Ionicons name={getCategoryIcon(item.category)} size={24} color="#2C3E50" />
      </View>
      <View style={styles.issueInfo}>
        <Text style={styles.issueTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.issueCategory}>{item.category}</Text>
        <Text style={styles.issueDate}>{item.createdAt}</Text>
      </View>
      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
        <Text style={styles.statusText}>{item.status}</Text>
      </View>
    </View>
    <Text style={styles.issueDescription} numberOfLines={2}>{item.description}</Text>
    <View style={styles.cardFooter}>
      <View style={styles.upvoteContainer}>
        <Ionicons name="arrow-up" size={16} color="#7F8C8D" />
        <Text style={styles.upvoteText}>{item.upvotes} upvotes</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#BDC3C7" />
    </View>
  </TouchableOpacity>
);

export default function MyIssuesScreen() {
  const userIssues = mockIssues.filter((_, index) => index < 3);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Issues</Text>
        <Text style={styles.subtitle}>{userIssues.length} issues reported</Text>
      </View>

      {userIssues.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="document-outline" size={64} color="#BDC3C7" />
          <Text style={styles.emptyTitle}>No Issues Reported</Text>
          <Text style={styles.emptySubtitle}>Start by reporting your first civic issue</Text>
        </View>
      ) : (
        <FlatList
          data={userIssues}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <IssueCard item={item} />}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E8ED',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2C3E50',
  },
  subtitle: {
    fontSize: 16,
    color: '#7F8C8D',
    marginTop: 4,
  },
  listContainer: {
    padding: 16,
  },
  issueCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  thumbnailContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#E8F4FD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  issueInfo: {
    flex: 1,
    marginLeft: 12,
  },
  issueTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    lineHeight: 22,
  },
  issueCategory: {
    fontSize: 14,
    color: '#7F8C8D',
    marginTop: 4,
  },
  issueDate: {
    fontSize: 12,
    color: '#95A5A6',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  issueDescription: {
    fontSize: 14,
    color: '#34495E',
    lineHeight: 20,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  upvoteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  upvoteText: {
    fontSize: 12,
    color: '#7F8C8D',
    marginLeft: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2C3E50',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 22,
  },
});