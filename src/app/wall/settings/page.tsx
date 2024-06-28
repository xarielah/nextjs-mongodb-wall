"use client";

import AlertComponent from "@/app/components/alerts/alert-component";
import EmailsPermitted from "@/app/components/settings/emails-permitted";
import ToggleSwitch from "@/app/components/toggle-switch";
import LoadingSession from "@/app/components/wall/loading-session";
import useAlerts from "@/app/hooks/use-alerts";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

type UserSettings = {
  defaultRTL: boolean;
  defaultPublic: boolean;
  shareWithAll: boolean;
  sharedWith: string[];
};
export default function SettingsPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const { data: session } = useSession();

  const [wallId, setWallId] = useState<string>("");

  const [fetchedEmails, setFetchedEmails] = useState<string[]>([]);

  const [shareWithAll, setShareWithAll] = useState<boolean>(false);
  const [defaultRTL, setDefaultRTL] = useState<boolean>(false);
  const [defaultPublic, setDefaultPublic] = useState<boolean>(false);

  const [updatingPref, setUpdatingPref] = useState<boolean>(false);

  const [formDirty, setFormDirty] = useState<boolean>(false);
  const [defaults, setDefaults] = useState<Partial<UserSettings>>({});

  const { alerts, addAlert } = useAlerts();

  useEffect(() => {
    // Fetch preferences from the server
    if (session && session?.user?.wallId) {
      setWallId(session.user.wallId);

      fetch(`/api/wall/${session.user.wallId}/settings`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch");
          return res.json();
        })
        .then((res) => {
          const pref = res.preferences || {};
          const privacy = res.privacy || {};

          const defaultFetchedSettings = defaults;

          // Wall settings
          setDefaultRTL(pref.defaultRTL || false);
          defaultFetchedSettings.defaultRTL = pref.defaultRTL || false;
          setDefaultPublic(pref.defaultPublic || false);
          defaultFetchedSettings.defaultPublic = pref.defaultPublic || false;

          // Privacy settings
          setFetchedEmails(privacy.sharedWith || []);
          setShareWithAll(privacy.shareWithAll || false);
          defaultFetchedSettings.shareWithAll = privacy.shareWithAll || false;

          setDefaults(defaultFetchedSettings);
        })
        .finally(() => {
          setLoading(false);
          setDefaults({ defaultRTL, defaultPublic, shareWithAll });
        });
    }
  }, [session?.user.wallId]);

  useEffect(() => {
    if (loading || Object.keys(defaults).length === 0) return;
    if (
      defaultRTL !== defaults.defaultRTL ||
      defaultPublic !== defaults.defaultPublic ||
      shareWithAll !== defaults.shareWithAll
    ) {
      setFormDirty(true);
    } else {
      setFormDirty(false);
    }
  }, [defaultRTL, defaultPublic, shareWithAll]);

  const handleSavedChanges = () => {
    setUpdatingPref(true);

    fetch(`/api/wall/${wallId}/settings`, {
      method: "PUT",
      body: JSON.stringify({
        preferences: {
          defaultRTL,
          defaultPublic,
        },
        privacy: {
          shareWithAll,
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
      })
      .catch(console.error)
      .finally(() => setUpdatingPref(false));
  };

  if (loading) return <LoadingSession />;
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
                <label htmlFor="share-with-all">
                  Share with all{" "}
                  <sup className="text-green-400 px-1">
                    (public for everyone)
                  </sup>
                </label>
                <ToggleSwitch
                  id="share-with-all"
                  value={shareWithAll}
                  setValue={(value) => setShareWithAll(value)}
                />
              </div>
            </div>
          </div>
          <div className="w-full">
            <h3 className="mb-4 text-2xl">Wall</h3>
            <div className="w-full flex items-center flex-col gap-4">
              <div className="setting-property-wrapper">
                <label htmlFor="default-rtl">
                  Default RTL <sup className="px-1">(Right-to-left)</sup>
                </label>
                <ToggleSwitch
                  disabled={updatingPref}
                  id="default-rtl"
                  value={defaultRTL}
                  setValue={(value) => setDefaultRTL(value)}
                />
              </div>
              <div className="setting-property-wrapper">
                <label htmlFor="default-public">Default Public</label>
                <ToggleSwitch
                  disabled={updatingPref}
                  id="default-public"
                  value={defaultPublic}
                  setValue={(value) => setDefaultPublic(value)}
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

        {!shareWithAll ? (
          <EmailsPermitted wallId={wallId} fetchedValue={[...fetchedEmails]} />
        ) : (
          ""
        )}
      </section>
    </>
  );
}
