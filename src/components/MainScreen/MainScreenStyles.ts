import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#001f3f', // Navy blue background
    padding: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Transparent black background
    padding: 20,
  },
  drawerContent: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: '#001f3f', // Navy blue background
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff', // White app name
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  drawerIcon: {
    marginRight: 15,
  },
  drawerText: {
    fontSize: 16,
    color: '#fff', // White menu items
  },
  card: {
    backgroundColor: '#fff', // White background
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  redRectangle: {
    height: 50,
    backgroundColor: 'red',
    marginBottom: 10,
  },
  placeholderText: {
    marginBottom: 10,
    fontStyle: 'italic',
    color: '#666',
  },
  deviceStatus: {
    marginBottom: 10,
    fontWeight: 'bold',
    color: 'red', // Disconnected for now
  },
  fitContentButton: {
    alignSelf: 'flex-end', // Align the button to the right
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  smallButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
    marginLeft: 10, // Add margin to separate buttons in Micro:bit card
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  rowButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end', // Align buttons to the right
    marginTop: 10,
  },
  pillboxPreviewContainer: {
    alignItems: 'stretch', // Center the preview
    marginBottom: 20,
    width: '100%', // Take the full width of the parent
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center', // Center the grid within the container
    width: '100%', // Ensure the grid takes the full width
  },
});
