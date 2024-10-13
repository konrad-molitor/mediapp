import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  gridContainer: {
    flexDirection: 'column',
    padding: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  rowLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
  cell: {
    height: 30,  // Adjusted height
    marginHorizontal: 2,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellText: {
    fontSize: 12, // Adjusted for small cells
    fontWeight: 'bold',
    color: '#333', // Darker color for visibility
  },
  noPillboxContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  noPillboxText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#999',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalCloseButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  modalCloseText: {
    color: '#fff',
    fontSize: 16,
  },
});
