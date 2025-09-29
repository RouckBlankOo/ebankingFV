import AsyncStorage from '@react-native-async-storage/async-storage';

const REFRESH_KEY = 'homeScreenRefreshNeeded';

export const markHomeForRefresh = async () => {
  try {
    await AsyncStorage.setItem(REFRESH_KEY, 'true');
    console.log('🔄 Marked home screen for refresh');
  } catch (error) {
    console.error('Error marking home for refresh:', error);
  }
};

export const checkAndClearRefreshFlag = async (): Promise<boolean> => {
  try {
    const needsRefresh = await AsyncStorage.getItem(REFRESH_KEY);
    if (needsRefresh === 'true') {
      await AsyncStorage.removeItem(REFRESH_KEY);
      console.log('🔄 Home screen refresh flag cleared');
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error checking refresh flag:', error);
    return false;
  }
};