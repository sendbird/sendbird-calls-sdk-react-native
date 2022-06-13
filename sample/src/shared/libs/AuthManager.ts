import AsyncStorage from '@react-native-async-storage/async-storage';

interface Credential {
  applicationId: string;
  userId: string;
  accessToken?: string;
}
class AuthManager {
  private key = 'calls@authManager';
  credential: Credential | null = null;
  storage = {
    get: async () => {
      const str = await AsyncStorage.getItem(this.key);
      return str ? JSON.parse(str) : null;
    },
    update: () => {
      if (this.credential) {
        return AsyncStorage.setItem(this.key, JSON.stringify(this.credential));
      } else {
        return AsyncStorage.removeItem(this.key);
      }
    },
  };

  isAuthenticated() {
    return Boolean(this.credential);
  }
  async getSavedCredential() {
    if (this.credential) return this.credential;
    const cred = await this.storage.get();
    if (cred) this.credential = cred;
    return this.credential;
  }
  authenticate(cred: Credential) {
    this.credential = cred;
    return this.storage.update();
  }
  deAuthenticate() {
    this.credential = null;
    return this.storage.update();
  }
}

export default new AuthManager();
