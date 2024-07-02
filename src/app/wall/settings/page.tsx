"use client";

import AlertComponent from "@/app/components/alerts/alert-component";
import EmailsPermitted from "@/app/components/settings/emails-permitted";
import ToggleSwitch from "@/app/components/toggle-switch";
import LoadingSession from "@/app/components/wall/loading-session";
import useAlerts, { AlertOptions } from "@/app/hooks/use-alerts";
import { Settings } from "@/lib/auth-options";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useState } from "react";

type UserSettings = {
  defaultRTL: boolean;
  defaultPublic: boolean;
  shareWithAll: boolean;
  sharedWith: string[];
};
export default function SettingsPage() {
  const { data: session, status, update } = useSession();
  console.log("🚀 ~ SettingsPage ~ status:", status);

  const [wallId, setWallId] = useState<string>("");

  const [fetchedEmails, setFetchedEmails] = useState<string[]>([]);

  const [settings, setSettings] = useState<Partial<UserSettings>>({});

  const [updatingPref, setUpdatingPref] = useState<boolean>(false);

  const [formDirty, setFormDirty] = useState<boolean>(false);
  console.log("🚀 ~ SettingsPage ~ formDirty:", formDirty);
  const [defaults, setDefaults] = useState<Partial<UserSettings>>({});

  const { alerts, addAlert } = useAlerts();

  const updateField = (field: keyof UserSettings, value: boolean) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const router = useRouter();
  useLayoutEffect(() => {
    // Redirect to home if unauthenticated
    // if (status === "unauthenticated") {
    //   router.replace("/");
    // }
    // // Fetch preferences from the server if user authenticated
    // else
    if (status === "authenticated" && session?.user?.wallId) {
      setWallId(session.user.wallId);
      const pref = session.user.settings!.preferences || {};
      console.log("🚀 ~ useEffect ~ pref:", pref);
      const privacy = session.user.settings!.privacy || {};
      console.log("🚀 ~ useEffect ~ privacy:", privacy);

      const defaultFetchedSettings = defaults;

      // Wall settings
      updateField("defaultRTL", pref.defaultRTL || false);
      defaultFetchedSettings.defaultRTL = pref.defaultRTL || false;
      updateField("defaultPublic", pref.defaultPublic || false);
      defaultFetchedSettings.defaultPublic = pref.defaultPublic || false;

      // Privacy settings
      setFetchedEmails(privacy.sharedWith || []);
      updateField("shareWithAll", privacy.shareWithAll || false);
      defaultFetchedSettings.shareWithAll = privacy.shareWithAll || false;

      setDefaults(defaultFetchedSettings);

      setDefaults({
        defaultRTL: settings.defaultRTL,
        defaultPublic: settings.defaultPublic,
        shareWithAll: settings.shareWithAll,
      });
      // fetch(`/api/wall/${session.user.wallId}/settings`)
      //   .then((res) => {
      //     if (!res.ok) {
      //       setLoading(false);
      //       throw new Error("Failed to fetch");
      //     }
      //     return res.json();
      //   })
      //   .then((res) => {
      //     const pref = res.preferences || {};
      //     const privacy = res.privacy || {};

      //     const defaultFetchedSettings = defaults;

      //     // Wall settings
      //     setDefaultRTL(pref.defaultRTL || false);
      //     defaultFetchedSettings.defaultRTL = pref.defaultRTL || false;
      //     setDefaultPublic(pref.defaultPublic || false);
      //     defaultFetchedSettings.defaultPublic = pref.defaultPublic || false;

      //     // Privacy settings
      //     setFetchedEmails(privacy.sharedWith || []);
      //     setShareWithAll(privacy.shareWithAll || false);
      //     defaultFetchedSettings.shareWithAll = privacy.shareWithAll || false;

      //     setDefaults(defaultFetchedSettings);
      //   })
      //   .finally(() => {
      //     setLoading(false);
      //     setDefaults({ defaultRTL, defaultPublic, shareWithAll });
      //   });
    }
  }, [session?.user.wallId, status]);

  useEffect(() => {
    if (status !== "authenticated" || Object.keys(defaults).length === 0)
      return;
    if (
      settings.defaultRTL !== defaults.defaultRTL ||
      settings.defaultPublic !== defaults.defaultPublic ||
      settings.shareWithAll !== defaults.shareWithAll
    ) {
      setFormDirty(true);
    } else {
      setFormDirty(false);
    }
  }, [settings]);

  const handleSavedChanges = () => {
    setUpdatingPref(true);

    fetch(`/api/wall/${wallId}/settings`, {
      method: "PUT",
      body: JSON.stringify({
        preferences: {
          defaultRTL: settings.defaultRTL,
          defaultPublic: settings.defaultPublic,
        },
        privacy: {
          shareWithAll: settings.shareWithAll,
        },
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to save changes");
        setFormDirty(false);
        addAlert({
          message: "Saved changes successfully!",
          type: "success",
          closeable: false,
          ttl: 7,
          toast: true,
        });
        return res.json();
      })
      .then((res) => {
        const newSession = { ...session };
        newSession.user!.settings = res.updatedSettings as Settings;
        update(newSession);
      })
      .catch(console.error)
      .finally(() => setUpdatingPref(false));
  };

  if (status === "loading") return <LoadingSession />;
  return (
    <>
      <AlertComponent alerts={alerts} />

      <section className="container-bg space-y-8">
        <h1 className="text-4xl font-bold mb-4">Settings</h1>
        <section className="max-w-2xl mx-auto flex items-center flex-col gap-16 justify-between p-6 my-6">
          <div className="w-full">
            <h3 className="mb-4 text-2xl">Privacy</h3>
            <div className="w-full flex items-center flex-col gap-4">
              <div className="setting-property-wrapper">
                <label htmlFor="share-with-all" className="settings-label">
                  Share with all{" "}
                  <sup className="text-green-400 px-1">
                    (public for everyone)
                  </sup>
                </label>
                <ToggleSwitch
                  id="share-with-all"
                  value={settings.shareWithAll || false}
                  setValue={(value) => updateField("shareWithAll", value)}
                />
              </div>
            </div>
          </div>
          <div className="w-full">
            <h3 className="mb-4 text-2xl">Wall</h3>
            <div className="w-full flex items-center flex-col gap-4">
              <div className="setting-property-wrapper">
                <label htmlFor="default-rtl" className="settings-label">
                  Default RTL <sup className="px-1">(Right-to-left)</sup>
                </label>
                <ToggleSwitch
                  disabled={updatingPref}
                  id="default-rtl"
                  value={settings.defaultRTL || false}
                  setValue={(value) => updateField("defaultRTL", value)}
                />
              </div>
              <div className="setting-property-wrapper">
                <label htmlFor="default-public" className="settings-label">
                  Default Public
                </label>
                <ToggleSwitch
                  disabled={updatingPref}
                  id="default-public"
                  value={settings.defaultPublic || false}
                  setValue={(value) => updateField("defaultPublic", value)}
                />
              </div>
            </div>
          </div>
        </section>
        <div className="w-full flex items-center">
          <button
            className="bg-blue-700/60 mx-auto py-2 px-6 w-max duration-300 hover:bg-blue-700/40 font-bold disabled:text-zinc-500 disabled:cursor-not-allowed disabled:bg-zinc-700/20"
            onClick={handleSavedChanges}
            disabled={updatingPref || !formDirty}
          >
            {updatingPref ? "Updating..." : "Save Changes"}
          </button>
        </div>

        {!settings.shareWithAll ? (
          <EmailsPermitted
            addAlert={(alertOptions: AlertOptions) => addAlert(alertOptions)}
            wallId={wallId}
            fetchedValue={[...fetchedEmails]}
          />
        ) : (
          ""
        )}
      </section>
    </>
  );
}
