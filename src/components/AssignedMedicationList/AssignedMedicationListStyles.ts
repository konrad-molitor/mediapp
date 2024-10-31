import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 20,
    color: '#666',
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'nowrap',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    justifyContent: 'space-between',
  },
  statusIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8, // Makes it a circle. Use 0 for a square
    marginRight: 10,
  },
  medicationDetails: {
    flex: 1,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  medicationName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
    marginTop: 4,
  },
  scheduledTime: {
    fontSize: 14,
    color: '#666666',
  },
})
