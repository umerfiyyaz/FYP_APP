import { useCallback, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

import { PressScale } from "@/components/animations/PressScale";
import { RingPhoto } from "@/components/cards/RingPhoto";
import { BrandHeader } from "@/components/ui/BrandHeader";
import { ConfirmSheet } from "@/components/ui/ConfirmSheet";
import { Icon, IconName } from "@/components/ui/Icon";
import { Toast } from "@/components/ui/Toast";
import { setAuthToken } from "@/services/api";
import { openAlertsOf, useAlerts } from "@/store/alertStore";
import { ageText, catActions, useActiveCat, useCats } from "@/store/catStore";
import { inPeriod, useHistory } from "@/store/historyStore";
import { colors, radius, shadows, spacing, type, withAlpha } from "@/theme";
import { go } from "@/utils/nav";
import { pickPhotoUri } from "@/utils/pickPhoto";

// ---------------------------------------------------------------------------------------------
// Screen 18 - Profile (+ log-out sheet). File: app/(tabs)/profile.tsx
// ---------------------------------------------------------------------------------------------

const OWNER = "Alex"; // later: from the signed-in user

type RowProps = {
  icon: IconName;
  iconColor?: string;
  iconBg?: string;
  title: string;
  subtitle: string;
  titleColor?: string;
  right?: "chevron" | "dot";
  badge?: string;
  last?: boolean;
  onPress: () => void;
};

function SettingRow({
  icon,
  iconColor = colors.tertiary,
  iconBg,
  title,
  subtitle,
  titleColor,
  right = "chevron",
  badge,
  last,
  onPress,
}: RowProps) {
  return (
    <PressScale
      onPress={onPress}
      scaleTo={0.99}
      accessibilityRole="button"
      accessibilityLabel={title}
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
        paddingVertical: 16,
        borderBottomWidth: last ? 0 : 1,
        borderBottomColor: withAlpha(colors.outlineVariant, 0.35),
      }}
    >
      <View
        style={{
          width: 48,
          height: 48,
          borderRadius: 24,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: iconBg ?? colors.surfaceContainerHigh,
        }}
      >
        <Icon name={icon} size={22} color={iconColor} />
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={[type.headlineSm, { color: titleColor ?? colors.onSurface }]}
        >
          {title}
        </Text>
        <Text style={[type.bodyMd, { color: colors.onSurfaceVariant }]}>
          {subtitle}
        </Text>
      </View>
      {badge ? (
        <View
          style={{
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: radius.full,
            backgroundColor: colors.primaryContainer,
          }}
        >
          <Text style={[type.labelMd, { color: colors.onPrimary }]}>
            {badge}
          </Text>
        </View>
      ) : null}
      {right === "dot" ? (
        <View
          style={{
            width: 10,
            height: 10,
            borderRadius: 5,
            backgroundColor: colors.secondary,
            boxShadow: shadows.dotGlow,
          }}
        />
      ) : null}
      <Icon name="chevron-right" size={22} color={colors.onSurfaceVariant} />
    </PressScale>
  );
}

export default function ProfileScreen() {
  const cat = useActiveCat();
  const { cats } = useCats();
  const { items } = useHistory();
  const { alerts } = useAlerts();
  const [signOutOpen, setSignOutOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const clearToast = useCallback(() => setToast(null), []);

  if (!cat) return null;

  const mine = items.filter((i) => i.catId === cat.id);
  const thisWeek = mine.filter((i) => inPeriod(i.createdAt, "week")).length;
  const allAlerts = alerts.filter((a) => a.catId === cat.id).length;
  const openAlerts = openAlertsOf(alerts, cat.id).length;

  const changePhoto = async () => {
    const uri = await pickPhotoUri();
    if (uri) catActions.update(cat.id, { photo: { uri } });
  };
  const signOut = () => {
    setSignOutOpen(false);
    setAuthToken(null); // later: also clear the saved token / call /auth/logout
    router.replace("/(auth)/login" as never);
  };
  const soon = () => setToast("Coming soon");

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <BrandHeader subtitle="Profile" hasAlert={openAlerts > 0} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: spacing.margin,
          paddingBottom: 130,
          gap: 16,
        }}
      >
        {/* hero */}
        <LinearGradient
          colors={[
            colors.surfaceContainerHigh,
            colors.surfaceContainer,
            colors.surfaceContainerLow,
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            marginTop: 8,
            borderRadius: radius.lg,
            paddingVertical: 28,
            paddingHorizontal: 20,
            alignItems: "center",
            boxShadow: shadows.xlDeep,
          }}
        >
          <RingPhoto
            source={cat.photo}
            size={148}
            onCamera={changePhoto}
            badge={
              cat.mood ? (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 6,
                    paddingHorizontal: 12,
                    paddingVertical: 4,
                    borderRadius: radius.full,
                    backgroundColor: colors.secondaryContainer,
                  }}
                >
                  <Icon
                    name="graphic-eq"
                    size={14}
                    color={colors.onSecondary}
                  />
                  <Text style={[type.labelMd, { color: colors.onSecondary }]}>
                    {cat.mood}
                  </Text>
                </View>
              ) : null
            }
          />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              marginTop: 20,
            }}
          >
            <Text
              style={{
                ...type.headlineXlMobile,
                fontSize: 32,
                lineHeight: 38,
                color: colors.tertiary,
              }}
            >
              {cat.name}
            </Text>
            <Icon name="verified" size={24} color={colors.primaryContainer} />
          </View>
          <Text
            style={[
              type.bodyMd,
              {
                color: colors.onSurfaceVariant,
                textAlign: "center",
                marginTop: 4,
              },
            ]}
          >
            {`${ageText(cat.ageYears)}, ${cat.breed} • Owner: ${OWNER}`}
          </Text>
          <View
            style={{
              flexDirection: "row",
              gap: 10,
              marginTop: 16,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
                paddingHorizontal: 14,
                paddingVertical: 8,
                borderRadius: radius.full,
                backgroundColor: withAlpha(colors.surfaceContainerLowest, 0.7),
              }}
            >
              <View
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: 4,
                  backgroundColor: colors.secondary,
                }}
              />
              <Text style={[type.labelMd, { color: colors.secondary }]}>
                Synced to your account
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
                paddingHorizontal: 14,
                paddingVertical: 8,
                borderRadius: radius.full,
                backgroundColor: withAlpha(colors.surfaceContainerLowest, 0.7),
              }}
            >
              <Icon name="insights" size={15} color={colors.tertiary} />
              <Text
                style={[type.labelMd, { color: colors.tertiary }]}
              >{`Baseline ${cat.baselineVideos} of 3`}</Text>
            </View>
          </View>
        </LinearGradient>

        {/* stats */}
        <View style={{ flexDirection: "row", gap: 12 }}>
          <View
            style={{
              flex: 1,
              padding: 16,
              borderRadius: radius.sm,
              backgroundColor: colors.surfaceContainer,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: colors.surfaceContainerHigh,
                }}
              >
                <Icon name="analytics" size={20} color={colors.tertiary} />
              </View>
              <View
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 3,
                  borderRadius: radius.full,
                  backgroundColor: withAlpha(colors.secondaryContainer, 0.28),
                }}
              >
                <Text
                  style={[type.labelSm, { color: colors.secondary }]}
                >{`+${thisWeek} this wk`}</Text>
              </View>
            </View>
            <Text
              style={{
                ...type.headlineXlMobile,
                color: colors.primaryFixedDim,
                marginTop: 14,
              }}
            >
              {mine.length}
            </Text>
            <Text style={[type.bodyMd, { color: colors.onSurface }]}>
              Analyses Done
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              padding: 16,
              borderRadius: radius.sm,
              backgroundColor: colors.surfaceContainer,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: colors.errorContainer,
                }}
              >
                <Icon name="healing" size={20} color={colors.error} />
              </View>
              <View
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 3,
                  borderRadius: radius.full,
                  backgroundColor: colors.surfaceContainerHigh,
                }}
              >
                <Text
                  style={[type.labelSm, { color: colors.onSurfaceVariant }]}
                >
                  {openAlerts === 0 ? "All Resolved" : `${openAlerts} open`}
                </Text>
              </View>
            </View>
            <Text
              style={{
                ...type.headlineXlMobile,
                color: colors.primaryFixedDim,
                marginTop: 14,
              }}
            >
              {allAlerts}
            </Text>
            <Text style={[type.bodyMd, { color: colors.onSurface }]}>
              Health Alerts
            </Text>
          </View>
        </View>

        {/* settings */}
        <View
          style={{
            borderRadius: radius.lg,
            paddingHorizontal: 20,
            paddingTop: 22,
            paddingBottom: 6,
            backgroundColor: colors.surfaceContainer,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 4,
            }}
          >
            <Text
              style={[
                type.labelLg,
                {
                  color: colors.primaryFixedDim,
                  letterSpacing: 0.8,
                  fontSize: 15,
                },
              ]}
            >
              ACCOUNT & PET SETTINGS
            </Text>
            <Text style={[type.labelMd, { color: colors.onSurfaceVariant }]}>
              Cloud Active
            </Text>
          </View>
          <SettingRow
            icon="collections-bookmark"
            title="Cat profiles"
            subtitle="Switch or register additional felines"
            badge={`${cats.length} ${cats.length === 1 ? "cat" : "cats"}`}
            onPress={() => go("/cats")}
          />
          <SettingRow
            icon="notifications-active"
            iconColor={colors.secondary}
            title="Notifications"
            subtitle="Alerts & daily summary"
            onPress={() => go("/alerts")}
          />
          <SettingRow
            icon="water-drop"
            title="Water intake"
            subtitle="Bowl check reminders"
            right="dot"
            onPress={soon}
          />
          <SettingRow
            icon="lock"
            title="Privacy and my data"
            subtitle="Your clips & data"
            onPress={soon}
          />
          <SettingRow
            icon="help-outline"
            title="Help and FAQ"
            subtitle="Tips & contact support"
            onPress={soon}
          />
          <SettingRow
            icon="logout"
            iconColor={colors.error}
            iconBg={withAlpha(colors.errorContainer, 0.6)}
            title="Sign out"
            titleColor={colors.error}
            subtitle="Disconnect current session"
            last
            onPress={() => setSignOutOpen(true)}
          />
        </View>

        <View style={{ alignItems: "center", gap: 4, marginTop: 8 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Icon name="pets" size={16} color={colors.primaryFixedDim} />
            <Text
              style={[
                type.labelMd,
                { color: colors.primaryFixedDim, letterSpacing: 1 },
              ]}
            >
              CATSENSE AI V1.0
            </Text>
          </View>
          <Text style={[type.bodySm, { color: colors.onSurfaceVariant }]}>
            Made with care for felines
          </Text>
        </View>
      </ScrollView>

      <ConfirmSheet
        visible={signOutOpen}
        icon="logout"
        tone="warm"
        title="Sign out of CatSense AI?"
        message="You will need to sign in again to see your cats and analyses."
        confirmLabel="Sign out"
        cancelLabel="Stay signed in"
        onConfirm={signOut}
        onCancel={() => setSignOutOpen(false)}
      />
      <Toast message={toast} onDone={clearToast} />
    </View>
  );
}
