import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff', // White app name
  },
  drawerContent: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: '#001f3f', // Navy blue background
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
});
