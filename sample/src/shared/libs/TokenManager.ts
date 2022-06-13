import AsyncStorage from '@react-native-async-storage/async-storage';

interface Token {
  value: string;
  type: 'fcm' | 'apns' | 'voip';
}

class TokenManager {
  private key = 'calls@tokenManager';
  token: Token | null = null;
  storage = {
    get: async () => {
      const token = await AsyncStorage.getItem(this.key);
      return token ? JSON.parse(token) : null;
    },
    update: () => {
      if (this.token) {
        return AsyncStorage.setItem(this.key, JSON.stringify(this.token));
      } else {
        return AsyncStorage.removeItem(this.key);
      }
    },
  };

  async get() {
    this.token = await this.storage.get();
    return this.token;
  }

  set(token: Token | null) {
    this.token = token;
    return this.storage.update();
  }
}

export default new TokenManager();
