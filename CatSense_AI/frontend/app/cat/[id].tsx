import { useState, type ReactNode } from "react";
import { ScrollView, Text, TextInput, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";

import { PressScale } from "@/components/animations/PressScale";
import { RingPhoto } from "@/components/cards/RingPhoto";
import { BrandHeader } from "@/components/ui/BrandHeader";
import { Button } from "@/components/ui/Button";
import { ChoiceChip } from "@/components/ui/Chip";
import { ConfirmSheet } from "@/components/ui/ConfirmSheet";
import { Icon, IconName } from "@/components/ui/Icon";
import { openAlertsOf, useAlerts } from "@/store/alertStore";
import { ageText, catActions, useActiveCat, useCat } from "@/store/catStore";
import { historyActions, useHistory } from "@/store/historyStore";
import {
  colors,
  gradients,
  radius,
  shadows,
  spacing,
  type,
  withAlpha,
} from "@/theme";
import type { Environment } from "@/types/pets";
import { goBack } from "@/utils/nav";
import { pickPhotoUri } from "@/utils/pickPhoto";

// ---------------------------------------------------------------------------------------------
// Screen 20 - Cat profile (+ edit + delete). Route: /cat/[id]   (Profile > Cat profiles > tap a cat)
// ---------------------------------------------------------------------------------------------

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const ENV_ICON: Record<Environment, IconName> = {
  Indoor: "home",
  Outdoor: "park",
  Both: "sync-alt",
};
const ENVS: Environment[] = ["Indoor", "Outdoor", "Both"];

function Card({
  children,
  gap = 14,
  style,
}: {
  children: ReactNode;
  gap?: number;
  style?: object;
}) {
  return (
    <View
      style={[
        {
          borderRadius: radius.lg,
          padding: 20,
          gap,
          backgroundColor: colors.surfaceContainer,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        minHeight: 40,
        gap: 12,
      }}
    >
      <Text style={[type.bodyLg, { color: colors.onSurfaceVariant }]}>
        {label}
      </Text>
      {children}
    </View>
  );
}

const inputStyle = {
  minWidth: 150,
  maxWidth: "62%",
  paddingHorizontal: 14,
  paddingVertical: 8,
  borderRadius: radius.base,
  backgroundColor: colors.surfaceContainerLowest,
  color: colors.onSurface,
  fontFamily: type.headlineSm.fontFamily,
  fontSize: 16,
  textAlign: "right",
  boxShadow: "inset 0 2px 6px rgba(0,0,0,0.6)",
} as const;

export default function CatProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const cat = useCat(id);
  const active = useActiveCat();
  const { items } = useHistory();
  const { alerts } = useAlerts();

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [breed, setBreed] = useState("");
  const [env, setEnv] = useState<Environment>("Indoor");
  const [error, setError] = useState<string | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  if (!cat) return null; // just deleted

  const isActive = active?.id === cat.id;
  const analyses = items.filter((i) => i.catId === cat.id).length;
  const alertCount = alerts.filter((a) => a.catId === cat.id).length;
  const openAlerts = openAlertsOf(alerts, cat.id).length;
  const since = new Date(cat.createdAt);
  const sinceText = `${MONTHS[since.getMonth()]} '${String(since.getFullYear()).slice(2)}`;
  const baselinePct = Math.min(cat.baselineVideos, 3) / 3;

  const startEdit = () => {
    setName(cat.name);
    setAge(String(cat.ageYears));
    setBreed(cat.breed);
    setEnv(cat.environment);
    setError(null);
    setEditing(true);
  };
  const save = () => {
    const years = Number(age);
    if (!name.trim()) return setError("Please enter a name.");
    if (!Number.isFinite(years) || years < 0 || years > 30)
      return setError("Age must be between 0 and 30 years.");
    catActions.update(cat.id, {
      name: name.trim(),
      ageYears: Math.round(years),
      breed: breed.trim() || "Domestic Shorthair",
      environment: env,
    });
    setEditing(false);
  };
  const changePhoto = async () => {
    const uri = await pickPhotoUri();
    if (uri) catActions.update(cat.id, { photo: { uri } });
  };
  const doDelete = () => {
    setDeleteOpen(false);
    items
      .filter((i) => i.catId === cat.id)
      .forEach((i) => historyActions.remove(i.id));
    historyActions.clearUndo(); // no "Undo" toast for a deleted cat
    const left = catActions.remove(cat.id);
    router.replace((left ? "/(tabs)/profile" : "/add-cat") as never);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <BrandHeader subtitle="Profile" hasAlert={openAlerts > 0} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingHorizontal: spacing.margin,
          paddingBottom: 48,
          gap: 16,
        }}
      >
        {/* title row */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 4,
          }}
        >
          <PressScale
            onPress={goBack}
            accessibilityRole="button"
            accessibilityLabel="Back"
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: colors.surfaceContainer,
            }}
          >
            <Icon name="arrow-back" size={22} />
          </PressScale>
          <View style={{ alignItems: "center" }}>
            <Text
              style={[
                type.headlineSm,
                { color: colors.tertiary, fontSize: 20 },
              ]}
            >{`${cat.name}'s Profile`}</Text>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
            >
              <View
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: colors.secondary,
                }}
              />
              <Text style={[type.labelSm, { color: colors.onSurfaceVariant }]}>
                Profile › Cat profiles
              </Text>
            </View>
          </View>
          <PressScale
            onPress={editing ? () => setEditing(false) : startEdit}
            accessibilityRole="button"
            accessibilityLabel={editing ? "Cancel editing" : "Edit"}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              paddingHorizontal: 16,
              height: 48,
              borderRadius: radius.full,
              backgroundColor: colors.surfaceContainer,
            }}
          >
            <Icon
              name={editing ? "close" : "edit"}
              size={18}
              color={colors.primaryFixedDim}
            />
            <Text style={[type.labelLg, { color: colors.primaryFixedDim }]}>
              {editing ? "Cancel" : "Edit"}
            </Text>
          </PressScale>
        </View>

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
            borderRadius: radius.lg,
            paddingVertical: 28,
            paddingHorizontal: 20,
            alignItems: "center",
            boxShadow: shadows.xlDeep,
          }}
        >
          <RingPhoto
            source={cat.photo}
            size={144}
            cameraTone="orange"
            onCamera={changePhoto}
          />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              marginTop: 18,
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
              type.bodyLg,
              { color: colors.onSurfaceVariant, marginTop: 2 },
            ]}
          >{`${cat.breed} • ${ageText(cat.ageYears)}`}</Text>
          {isActive ? (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 7,
                marginTop: 14,
                paddingHorizontal: 16,
                paddingVertical: 7,
                borderRadius: radius.full,
                backgroundColor: withAlpha(colors.surfaceContainerLowest, 0.7),
              }}
            >
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: colors.secondary,
                }}
              />
              <Text style={[type.labelMd, { color: colors.secondary }]}>
                Active cat
              </Text>
            </View>
          ) : (
            <PressScale
              onPress={() => catActions.setActive(cat.id)}
              accessibilityRole="button"
              accessibilityLabel={`Make ${cat.name} the active cat`}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
                marginTop: 14,
                paddingHorizontal: 18,
                paddingVertical: 9,
                borderRadius: radius.full,
                backgroundColor: withAlpha(colors.secondaryContainer, 0.35),
              }}
            >
              <Icon
                name="check-circle-outline"
                size={16}
                color={colors.secondary}
              />
              <Text style={[type.labelMd, { color: colors.secondary }]}>
                Make active cat
              </Text>
            </PressScale>
          )}
        </LinearGradient>

        {/* stats */}
        <View style={{ flexDirection: "row", gap: 4 }}>
          {[
            { v: String(analyses), l: "Analyses", c: colors.primaryFixedDim },
            { v: String(alertCount), l: "Alerts", c: colors.secondary },
            { v: sinceText, l: "Since", c: colors.primary },
          ].map((s) => (
            <View
              key={s.l}
              style={{
                flex: 1,
                alignItems: "center",
                paddingVertical: 14,
                backgroundColor: colors.surfaceContainer,
              }}
            >
              <Text
                style={{
                  ...type.headlineSm,
                  fontFamily: type.headlineXlMobile.fontFamily,
                  fontSize: 22,
                  color: s.c,
                }}
              >
                {s.v}
              </Text>
              <Text style={[type.bodySm, { color: colors.onSurfaceVariant }]}>
                {s.l}
              </Text>
            </View>
          ))}
        </View>

        {/* baseline */}
        <Card gap={12}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <Icon name="analytics" size={22} color={colors.tertiary} />
              <Text
                style={{
                  ...type.headlineXlMobile,
                  fontSize: 21,
                  color: colors.onSurface,
                }}
              >{`${cat.name}'s baseline`}</Text>
            </View>
            <Text
              style={[type.labelLg, { color: colors.primaryFixedDim }]}
            >{`${Math.min(cat.baselineVideos, 3)} of 3 videos`}</Text>
          </View>
          <View
            style={{
              height: 12,
              borderRadius: 6,
              backgroundColor: colors.surfaceContainerLowest,
              overflow: "hidden",
            }}
          >
            <LinearGradient
              colors={[colors.primaryContainer, colors.secondary]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={{
                width: `${baselinePct * 100}%`,
                height: "100%",
                borderRadius: 6,
              }}
            />
          </View>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <Icon
              name="info-outline"
              size={18}
              color={colors.onSurfaceVariant}
            />
            <Text
              style={[type.bodyMd, { color: colors.onSurfaceVariant, flex: 1 }]}
            >
              {baselinePct >= 1
                ? "Baseline complete. The risk score is fully calibrated for this cat."
                : "The risk score becomes significantly more reliable after 3 calibrated video sessions."}
            </Text>
          </View>
        </Card>

        {/* basic info */}
        <Card gap={10}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <Icon name="badge" size={22} color={colors.tertiary} />
              <Text
                style={{
                  ...type.headlineXlMobile,
                  fontSize: 21,
                  color: colors.onSurface,
                }}
              >
                Basic info
              </Text>
            </View>
            <Text style={[type.labelMd, { color: colors.onSurfaceVariant }]}>
              {editing ? "Editing" : "Saved"}
            </Text>
          </View>

          <Row label="Name">
            {editing ? (
              <TextInput
                value={name}
                onChangeText={setName}
                style={inputStyle}
                placeholder="Cat name"
                placeholderTextColor={colors.outline}
                maxLength={24}
                accessibilityLabel="Name"
              />
            ) : (
              <Text style={[type.headlineSm, { color: colors.onSurface }]}>
                {cat.name}
              </Text>
            )}
          </Row>
          <Row label="Age">
            {editing ? (
              <TextInput
                value={age}
                onChangeText={(t) => setAge(t.replace(/[^0-9]/g, ""))}
                style={inputStyle}
                keyboardType="number-pad"
                placeholder="Years"
                placeholderTextColor={colors.outline}
                maxLength={2}
                accessibilityLabel="Age in years"
              />
            ) : (
              <Text style={[type.headlineSm, { color: colors.onSurface }]}>
                {ageText(cat.ageYears)}
              </Text>
            )}
          </Row>
          <Row label="Breed">
            {editing ? (
              <TextInput
                value={breed}
                onChangeText={setBreed}
                style={inputStyle}
                placeholder="Breed"
                placeholderTextColor={colors.outline}
                maxLength={32}
                accessibilityLabel="Breed"
              />
            ) : (
              <Text
                style={[
                  type.headlineSm,
                  {
                    color: colors.onSurface,
                    flexShrink: 1,
                    textAlign: "right",
                  },
                ]}
              >
                {cat.breed}
              </Text>
            )}
          </Row>
          {editing ? (
            <View style={{ gap: 8 }}>
              <Text style={[type.bodyLg, { color: colors.onSurfaceVariant }]}>
                Living environment
              </Text>
              <View style={{ flexDirection: "row", gap: 8 }}>
                {ENVS.map((e) => (
                  <ChoiceChip
                    key={e}
                    label={e}
                    icon={ENV_ICON[e]}
                    active={env === e}
                    onPress={() => setEnv(e)}
                  />
                ))}
              </View>
            </View>
          ) : (
            <Row label="Living environment">
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                  paddingHorizontal: 14,
                  paddingVertical: 6,
                  borderRadius: radius.full,
                  backgroundColor: withAlpha(colors.secondaryContainer, 0.35),
                }}
              >
                <Icon
                  name={ENV_ICON[cat.environment]}
                  size={16}
                  color={colors.secondary}
                />
                <Text style={[type.labelLg, { color: colors.secondary }]}>
                  {cat.environment}
                </Text>
              </View>
            </Row>
          )}

          {error ? (
            <Text style={[type.bodyMd, { color: colors.error }]}>{error}</Text>
          ) : null}

          {editing ? (
            <View style={{ gap: 10, marginTop: 8 }}>
              <Button
                label="Save changes"
                icon="check"
                iconPosition="left"
                gradient={gradients.ctaVertical}
                paddingVertical={16}
                onPress={save}
              />
              <Button
                label="Cancel"
                background={colors.surfaceContainerHigh}
                color={colors.onSurface}
                shadow={null}
                paddingVertical={14}
                onPress={() => setEditing(false)}
              />
            </View>
          ) : (
            <Button
              label="Edit profile"
              icon="edit"
              iconPosition="left"
              gradient={gradients.ctaVertical}
              paddingVertical={16}
              style={{ marginTop: 8 }}
              onPress={startEdit}
            />
          )}
        </Card>

        {/* danger zone */}
        <View
          style={{
            borderRadius: radius.lg,
            padding: 20,
            gap: 12,
            backgroundColor: colors.surfaceContainerLow,
            borderWidth: 1,
            borderColor: withAlpha(colors.error, 0.12),
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
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <Icon
                name="warning-amber"
                size={22}
                color={colors.primaryFixedDim}
              />
              <Text
                style={{ ...type.headlineSm, color: colors.primaryFixedDim }}
              >
                Danger Zone
              </Text>
            </View>
            <Text style={[type.labelMd, { color: colors.onSurfaceVariant }]}>
              Permanent
            </Text>
          </View>
          <Text style={[type.bodyMd, { color: colors.onSurfaceVariant }]}>
            {`Remove ${cat.name}'s profile, history, sound patterns and behavior trends from your account.`}
          </Text>
          <PressScale
            onPress={() => setDeleteOpen(true)}
            accessibilityRole="button"
            accessibilityLabel={`Delete ${cat.name} and all data`}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              paddingVertical: 16,
              borderRadius: radius.full,
              backgroundColor: withAlpha(colors.errorContainer, 0.75),
            }}
          >
            <Icon name="delete-forever" size={20} color={colors.error} />
            <Text
              style={[type.labelLg, { color: colors.error, fontSize: 15 }]}
            >{`Delete ${cat.name} and all data`}</Text>
          </PressScale>
        </View>
      </ScrollView>

      <ConfirmSheet
        visible={deleteOpen}
        icon="delete-forever"
        tone="danger"
        title={`Delete ${cat.name} and all data?`}
        message="The profile, history, sound patterns and trends will be removed. This cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Keep"
        onConfirm={doDelete}
        onCancel={() => setDeleteOpen(false)}
      />
    </View>
  );
}
