import { useState, useEffect } from "react";

import { CompanyProfileService } from "@/services";

export const useCompanyProfile = () => {
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const profile = await CompanyProfileService.get();
      setCompanyProfile(profile);
    } catch (error) {
      console.error("Error loading company profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async (profileData: Partial<CompanyProfile>) => {
    try {
      const savedProfile = await CompanyProfileService.save(profileData);
      setCompanyProfile(savedProfile);
      return savedProfile;
    } catch (error) {
      console.error("Error saving company profile:", error);
      throw error;
    }
  };

  const updateProfile = async (profileData: Partial<CompanyProfile>) => {
    try {
      const updatedProfile = await CompanyProfileService.update(profileData);
      if (updatedProfile) {
        setCompanyProfile(updatedProfile);
      }
      return updatedProfile;
    } catch (error) {
      console.error("Error updating company profile:", error);
      throw error;
    }
  };

  const clearProfile = async () => {
    try {
      await CompanyProfileService.clear();
      setCompanyProfile(null);
    } catch (error) {
      console.error("Error clearing company profile:", error);
      throw error;
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  return {
    companyProfile,
    loading,
    loadProfile,
    saveProfile,
    updateProfile,
    clearProfile,
  };
};
