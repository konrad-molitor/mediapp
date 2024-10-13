import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  rowInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: 60, // Adjust input width
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 10, // Spacing between input and buttons
  },
  iconButton: {
    backgroundColor: '#007bff',
    width: 40, // Set fixed width for round shape
    height: 40, // Set height equal to width for round shape
    borderRadius: 20, // Set borderRadius to half of width/height to make it round
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10, // Spacing around the buttons
  },
  iconButtonText: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center', // Ensure the text is centered in the button
  },
  placeholder: {
    height: 100,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    borderRadius: 5,
  },
  placeholderText: {
    color: '#fff',
    fontSize: 16,
    fontStyle: 'italic',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    flex: 0.45,
    justifyContent: 'center',
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 5,
    flex: 0.45,
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    marginTop: 20, // Add more spacing above download button
  },
});
