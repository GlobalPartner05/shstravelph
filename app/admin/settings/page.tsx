import { getAllSettings, SETTING_KEYS } from "@/lib/settings";
import SettingEditor from "@/components/admin/SettingEditor";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await getAllSettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-charcoal)]">Settings</h1>
        <p className="text-sm text-[var(--color-charcoal-soft)]">
          Nothing here is shown to customers until you check &quot;confirmed&quot;.
        </p>
      </div>

      <SettingEditor
        settingKey={SETTING_KEYS.whatsappNumber}
        label="WhatsApp number"
        helpText="Digits only with country code, e.g. 639171234567. Shows the floating WhatsApp button once confirmed."
        initialValue={settings[SETTING_KEYS.whatsappNumber]?.value ?? ""}
        initialConfirmed={settings[SETTING_KEYS.whatsappNumber]?.isConfirmed ?? false}
      />
      <SettingEditor
        settingKey={SETTING_KEYS.waitingTimePolicy}
        label="Waiting-time policy"
        helpText="Shown on the homepage, confirmation page, and FAQ."
        initialValue={settings[SETTING_KEYS.waitingTimePolicy]?.value ?? ""}
        initialConfirmed={settings[SETTING_KEYS.waitingTimePolicy]?.isConfirmed ?? false}
        multiline
      />
      <SettingEditor
        settingKey={SETTING_KEYS.cancellationPolicy}
        label="Cancellation policy"
        helpText="Shown on the homepage and booking confirmation."
        initialValue={settings[SETTING_KEYS.cancellationPolicy]?.value ?? ""}
        initialConfirmed={settings[SETTING_KEYS.cancellationPolicy]?.isConfirmed ?? false}
        multiline
      />
      <SettingEditor
        settingKey={SETTING_KEYS.dispatchContact}
        label="Dispatch contact (for 'can't find your driver')"
        helpText="Shown on the homepage and booking confirmation."
        initialValue={settings[SETTING_KEYS.dispatchContact]?.value ?? ""}
        initialConfirmed={settings[SETTING_KEYS.dispatchContact]?.isConfirmed ?? false}
      />
    </div>
  );
}
