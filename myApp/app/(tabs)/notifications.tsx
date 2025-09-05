import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const notifications = [
  {
    id: '1',
    title: 'Issue Status Updated',
    message: 'Your reported pothole issue is now in progress',
    time: '2 hours ago',
    type: 'status',
    read: false,
  },
  {
    id: '2',
    title: 'New Issue Nearby',
    message: 'A water leakage has been reported 0.5km from your location',
    time: '1 day ago',
    type: 'nearby',
    read: true,
  },
  {
    id: '3',
    title: 'Issue Resolved',
    message: 'The garbage overflow issue you reported has been resolved',
    time: '3 days ago',
    type: 'resolved',
    read: true,
  },
];

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'status': return 'refresh-circle';
    case 'nearby': return 'location';
    case 'resolved': return 'checkmark-circle';
    default: return 'notifications';
  }
};

const getNotificationColor = (type: string) => {
  switch (type) {
    case 'status': return '#4ECDC4';
    case 'nearby': return '#3498DB';
    case 'resolved': return '#27AE60';
    default: return '#95A5A6';
  }
};

const NotificationCard = ({ item }: { item: any }) => (
  <TouchableOpacity style={[styles.notificationCard, !item.read && styles.unreadCard]}>
    <View style={[styles.iconContainer, { backgroundColor: getNotificationColor(item.type) + '20' }]}>
      <Ionicons 
        name={getNotificationIcon(item.type)} 
        size={24} 
        color={getNotificationColor(item.type)} 
      />
    </View>
    <View style={styles.notificationContent}>
      <Text style={[styles.notificationTitle, !item.read && styles.unreadTitle]}>
        {item.title}
      </Text>
      <Text style={styles.notificationMessage}>{item.message}</Text>
      <Text style={styles.notificationTime}>{item.time}</Text>
    </View>
    {!item.read && <View style={styles.unreadDot} />}
  </TouchableOpacity>
);

export default function NotificationsScreen() {
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Notifications</Text>
        {unreadCount > 0 && (
          <Text style={styles.subtitle}>{unreadCount} unread notifications</Text>
        )}
      </View>

      {notifications.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="notifications-outline" size={64} color="#BDC3C7" />
          <Text style={styles.emptyTitle}>No Notifications</Text>
          <Text style={styles.emptySubtitle}>You'll receive updates about your reported issues here</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <NotificationCard item={item} />}
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
    color: '#E74C3C',
    marginTop: 4,
  },
  listContainer: {
    padding: 16,
  },
  notificationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#3498DB',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationContent: {
    flex: 1,
    marginLeft: 12,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 4,
  },
  unreadTitle: {
    fontWeight: '700',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#34495E',
    lineHeight: 20,
    marginBottom: 8,
  },
  notificationTime: {
    fontSize: 12,
    color: '#95A5A6',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3498DB',
    marginTop: 8,
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