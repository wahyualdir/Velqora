"use client";

import React, { useEffect, useState } from "react";
import { PageContainer } from "@/components/ui/section";
import { SubNavTabs } from "@/components/layout/sub-nav-tabs";
import { createClient } from "@/lib/supabase/client";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useThemeAccent } from "@/context/theme-accent-context";
import { SettingsHeader } from "@/components/settings/settings-header";
import { SettingsNav, SettingsSectionId } from "@/components/settings/settings-nav";
import { ProfileSettings } from "@/components/settings/profile-settings";
import { AppearanceSettings } from "@/components/settings/appearance-settings";
import { LearningPreferences } from "@/components/settings/learning-preferences";
import { NotificationSettings } from "@/components/settings/notification-settings";
import { PrivacySecuritySettings } from "@/components/settings/privacy-security-settings";
import { AccountSettings } from "@/components/settings/account-settings";
import { ApplicationSettings } from "@/components/settings/application-settings";

export default function PengaturanPage() {
  const { theme, setTheme } = useTheme();
  const {
    settings,
    accent,
    setAccent,
    density,
    setDensity,
    radius,
    setRadius,
    motion,
    setMotion,
    resetToDefaults,
    exportSettings,
  } = useThemeAccent();

  const [activeSection, setActiveSection] = useState<SettingsSectionId>("profile");
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);

  // Profile Form States
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [institution, setInstitution] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [email, setEmail] = useState("");

  // Fetch Profile & Preferences on Mount
  useEffect(() => {
    async function loadUserProfile() {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          setEmail(user.email || "");
          const meta = user.user_metadata || {};
          setFullName(meta.full_name || "");
          setBio(meta.bio || "");
          setInstitution(meta.institution || "");
          setAvatarUrl(meta.avatar_url || "");
        }
      } catch (error) {
        console.error("Error loading user profile:", error);
      } finally {
        setLoading(false);
      }
    }

    loadUserProfile();
  }, []);

  // Save Profile Handler
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: fullName,
          bio,
          institution,
          avatar_url: avatarUrl,
          theme_settings: settings,
        },
      });

      if (error) throw error;
      toast.success("Profil pengguna berhasil disimpan!");
    } catch (error: any) {
      toast.error(error.message || "Gagal memperbarui profil pengguna.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleResetAllSettings = () => {
    resetToDefaults();
    if (typeof window !== "undefined") {
      localStorage.removeItem("app_language");
      localStorage.removeItem("velqora_pref_module_view");
      localStorage.removeItem("velqora_pref_sound");
      localStorage.removeItem("velqora_notif_tasks");
      localStorage.removeItem("velqora_notif_classes");
      localStorage.removeItem("velqora_notif_system");
    }
    toast.success("Seluruh pengaturan workspace berhasil dikembalikan ke default!");
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-3">
          <Loader2 className="w-6 h-6 animate-spin text-brand-500" />
          <p className="text-xs font-mono text-text-tertiary">Memuat pengaturan workspace...</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* Navigation Tabs */}
        <SubNavTabs category="settings" />

        {/* Workspace Header */}
        <SettingsHeader />

        {/* Desktop 2-Column Grid Layout / Mobile Stack */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Settings Left Navigation (col-span-3) */}
          <div className="lg:col-span-3 lg:sticky lg:top-20">
            <SettingsNav
              activeSection={activeSection}
              onSelectSection={setActiveSection}
            />
          </div>

          {/* Settings Right Content Panel (col-span-9) */}
          <div className="lg:col-span-9 rounded-2xl border border-border bg-surface p-5 sm:p-7 shadow-2xs">
            {activeSection === "profile" && (
              <ProfileSettings
                fullName={fullName}
                onChangeFullName={setFullName}
                bio={bio}
                onChangeBio={setBio}
                institution={institution}
                onChangeInstitution={setInstitution}
                avatarUrl={avatarUrl}
                onChangeAvatarUrl={setAvatarUrl}
                email={email}
                onSave={handleSaveProfile}
                saving={savingProfile}
              />
            )}

            {activeSection === "appearance" && (
              <AppearanceSettings
                theme={theme}
                setTheme={setTheme}
                accent={accent}
                setAccent={setAccent}
                density={density}
                setDensity={setDensity}
                radius={radius}
                setRadius={setRadius}
                motion={motion}
                setMotion={setMotion}
                onReset={resetToDefaults}
              />
            )}

            {activeSection === "learning" && <LearningPreferences />}

            {activeSection === "notifications" && <NotificationSettings />}

            {activeSection === "privacy" && <PrivacySecuritySettings />}

            {activeSection === "account" && (
              <AccountSettings
                email={email}
                onExportSettings={exportSettings}
                onResetSettings={handleResetAllSettings}
              />
            )}

            {activeSection === "application" && <ApplicationSettings />}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
