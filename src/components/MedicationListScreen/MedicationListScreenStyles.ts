import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#001f3f', // Navy blue background
    padding: 20,
  },
  scrollContainer: {
    paddingBottom: 100,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#28a745', // Green background
    padding: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  medicationName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff', // White text for readability
  },
  medicationTime: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  cardContent: {
    padding: 15,
  },
  actionButtonsContainer: {
    marginTop: 10,
  },
  fullWidthButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    justifyContent: 'center',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 5,
    flex: 0.48,
    justifyContent: 'center',
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6c757d',
    padding: 15,
    borderRadius: 5,
    flex: 0.48,
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
  },
});
