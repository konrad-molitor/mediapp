import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  modalContainer: {
    flex: 1, // Ensure the container fills the screen
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    maxHeight: '90%', // Prevent the modal from exceeding the screen height
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 5,
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  scrollContent: {
    flexGrow: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  medicationNameInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#fff',
    width: '100%',
  },
  timeTypeContainer: {
    marginBottom: 15,
  },
  radioButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  radioButtonSelected: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  radioButtonText: {
    color: '#000',
  },
  timesContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  timeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  timeText: {
    fontSize: 16,
  },
  removeButton: {
    backgroundColor: '#dc3545',
    width: 40, // Fixed width for round shape
    height: 40, // Height equal to width for round shape
    borderRadius: 20, // Half of width/height for round shape
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#28a745', // Positive action color
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 20, // Spacing above the save/cancel buttons
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
  },
  everyNDaysContainer: {
    marginBottom: 20,
  },
  intervalInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  iconButton: {
    backgroundColor: '#007bff',
    width: 40, // Fixed width for round shape
    height: 40, // Height equal to width for round shape
    borderRadius: 20, // Half of width/height for round shape
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10, // Spacing around the buttons
  },
  iconButtonText: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
  },
  intervalInput: {
    width: 60, // Adjusted input width
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 10, // Spacing between input and buttons
  },
  intervalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  saveButton: {
    flex: 0.48,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
  },
  cancelButton: {
    flex: 0.48,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
  },
});

