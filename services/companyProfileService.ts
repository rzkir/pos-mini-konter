import AsyncStorage from "@react-native-async-storage/async-storage";

export class CompanyProfileService {
  private static readonly STORAGE_KEY = process.env
    .EXPO_PUBLIC_COMPANY_PROFILE as string;

  // Get company profile
  static async get(): Promise<CompanyProfile | null> {
    try {
      const data = await AsyncStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Error getting company profile:", error);
      return null;
    }
  }

  // Save company profile
  static async save(
    profileData: Partial<CompanyProfile>
  ): Promise<CompanyProfile> {
    try {
      const existingProfile = await this.get();
      const now = new Date().toISOString();

      const updatedProfile: CompanyProfile = {
        id: existingProfile?.id || 1,
        name: profileData.name || existingProfile?.name || "",
        address: profileData.address || existingProfile?.address || "",
        phone: profileData.phone || existingProfile?.phone || "",
        email: profileData.email || existingProfile?.email || "",
        website: profileData.website || existingProfile?.website || "",
        logo_url: profileData.logo_url || existingProfile?.logo_url,
        created_at: existingProfile?.created_at || now,
        updated_at: now,
      };

      await AsyncStorage.setItem(
        this.STORAGE_KEY,
        JSON.stringify(updatedProfile)
      );
      return updatedProfile;
    } catch (error) {
      console.error("Error saving company profile:", error);
      throw error;
    }
  }

  // Update company profile
  static async update(
    profileData: Partial<CompanyProfile>
  ): Promise<CompanyProfile | null> {
    try {
      const existingProfile = await this.get();
      if (!existingProfile) {
        return null;
      }

      const updatedProfile: CompanyProfile = {
        ...existingProfile,
        ...profileData,
        updated_at: new Date().toISOString(),
      };

      await AsyncStorage.setItem(
        this.STORAGE_KEY,
        JSON.stringify(updatedProfile)
      );
      return updatedProfile;
    } catch (error) {
      console.error("Error updating company profile:", error);
      throw error;
    }
  }

  // Clear company profile
  static async clear(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error("Error clearing company profile:", error);
      throw error;
    }
  }
}
