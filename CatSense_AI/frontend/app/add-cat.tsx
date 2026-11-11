// SCREEN 2 - Add your cat (prototype: 2_catsense_ai._add_your_cat) = onboarding step 1 of 3
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";

import { CatAvatar } from "@/components/cards/CatAvatar";
import { Button } from "@/components/ui/Button";
import { ChoiceChip, Badge } from "@/components/ui/Chip";
import { Glow } from "@/components/ui/Glow";
import { OnboardingTopBar } from "@/components/ui/Header";
import { Icon } from "@/components/ui/Icon";
import { InsetField } from "@/components/ui/Input";
import { StepProgress } from "@/components/ui/ProgressBar";
import { Screen } from "@/components/ui/Screen";
import { DEMO_PREFILL, SHOW_EDIT_CARD_PREVIEW } from "@/constants/config";
import { images } from "@/constants/images";
import { USE_MOCK } from "@/services/api";
import { errorMessage } from "@/services/auth";
import { petsApi } from "@/services/petsApi";
import { catActions } from "@/store/catStore";
import {
  colors,
  gradients,
  letterSpacing,
  radius,
  shadows,
  spacing,
  tracking,
  type,
  withAlpha,
} from "@/theme";

type Environment = "Indoor" | "Outdoor" | "Both";

const ENVIRONMENTS: {
  label: Environment;
  icon: "home" | "park" | "sync-alt";
}[] = [
  { label: "Indoor", icon: "home" },
  { label: "Outdoor", icon: "park" },
  { label: "Both", icon: "sync-alt" },
];

/** "3 years" -> 3, "6 months" -> 0.5, "2.5" -> 2.5, anything without a number -> null */
function parseAgeYears(text: string): number | null {
  const m = text.replace(",", ".").match(/\d+(\.\d+)?/);
  if (!m) return null;
  const n = parseFloat(m[0]);
  const years = /month|mo\b/i.test(text) ? n / 12 : n;
  return Math.round(years * 100) / 100;
}

export default function AddCatScreen() {
  const router = useRouter();
  const [name, setName] = useState(DEMO_PREFILL && USE_MOCK ? "Milo" : "");
  const [age, setAge] = useState(DEMO_PREFILL && USE_MOCK ? "3 years" : "");
  const [breed, setBreed] = useState(
    DEMO_PREFILL && USE_MOCK ? "Domestic Shorthair" : "",
  );
  const [environment, setEnvironment] = useState<Environment>("Indoor");
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const canContinue = name.trim().length > 0;
  const catName = name.trim() || "your cat";

  const pickPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) setPhotoUri(result.assets[0].uri);
  };

  const onContinue = async () => {
    if (!canContinue || saving) return;

    // Demo mode (no backend configured): same as before.
    if (USE_MOCK) {
      router.push("/onboarding");
      return;
    }

    const ageYears = parseAgeYears(age);
    if (ageYears === null || ageYears > 40) {
      setError("Enter your cat's age, for example 2 years or 6 months");
      return;
    }
    setError("");
    setSaving(true);
    try {
      const dto = await petsApi.createCat({
        name: name.trim(),
        breed: breed.trim() || "Unknown",
        age_years: ageYears,
        environment,
      });
      // save the picked photo on the server; if that fails the cat is still created
      let saved = dto;
      if (photoUri) {
        try {
          saved = await petsApi.uploadPhoto(dto.id, photoUri);
        } catch {
          saved = dto;
        }
      }
      catActions.addFromDto(saved, saved.photo_url ? null : photoUri);
      router.push("/onboarding");
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  const goHome = () => router.replace("/(tabs)/home"); // TODO: Skip behaviour to be confirmed

  return (
    <Screen>
      <OnboardingTopBar step={1} onBack={() => router.back()} onSkip={goHome} />
      <StepProgress step={1} />

      {/* Main card */}
      <View style={styles.card}>
        <Glow
          size={192}
          color={colors.surfaceTint}
          opacity={0.1}
          style={{ top: -64, right: -64 }}
        />

        <View style={styles.titleBox}>
          <Text style={[type.headlineXlMobile, styles.title]}>
            Tell us about your cat
          </Text>
          <Text style={[type.bodyMd, styles.subtitle]}>
            Help our acoustic AI calibrate its neural vocalization model.
          </Text>
        </View>

        {/* Photo */}
        <View style={styles.photoArea}>
          <Pressable
            onPress={pickPhoto}
            accessibilityRole="button"
            accessibilityLabel="Add photo"
          >
            <View style={styles.photoRing}>
              <CatAvatar
                source={photoUri ? { uri: photoUri } : images.catPortrait}
                size={104}
              />
            </View>
            <View style={styles.cameraBadge}>
              <Icon name="photo-camera" size={16} color={colors.onPrimary} />
            </View>
          </Pressable>
          <Text style={[type.labelMd, styles.photoLabel]}>
            Add photo (optional)
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <View style={styles.group}>
            <View style={styles.labelRow}>
              <Text style={[type.labelMd, styles.label]}>
                Cat name <Text style={{ color: colors.surfaceTint }}>*</Text>
              </Text>
              <Text style={[type.labelSm, { color: colors.surfaceTint }]}>
                Required
              </Text>
            </View>
            <InsetField
              leftIcon="pets"
              leftIconSize={16}
              leftIconColor={colors.onSurfaceVariant}
              shadow={shadows.insetFieldDeep}
              value={name}
              onChangeText={setName}
              placeholder="e.g. Luna"
              inputStyle={type.bodyLg}
              autoCapitalize="words"
              returnKeyType="next"
            />
          </View>

          <View style={styles.group}>
            <Text style={[type.labelMd, styles.label, styles.labelPad]}>
              Age
            </Text>
            <InsetField
              leftIcon="cake"
              leftIconSize={16}
              leftIconColor={colors.onSurfaceVariant}
              iconGap={8}
              shadow={shadows.insetFieldDeep}
              value={age}
              onChangeText={setAge}
              placeholder="e.g. 2 years"
              inputStyle={type.bodyLg}
              right={
                <Icon
                  name="unfold-more"
                  size={16}
                  color={colors.onSurfaceVariant}
                />
              }
            />
          </View>

          <View style={styles.group}>
            <Text style={[type.labelMd, styles.label, styles.labelPad]}>
              Breed
            </Text>
            <InsetField
              leftIcon="category"
              leftIconSize={16}
              leftIconColor={colors.onSurfaceVariant}
              iconGap={8}
              shadow={shadows.insetFieldDeep}
              value={breed}
              onChangeText={setBreed}
              placeholder="Search breeds"
              inputStyle={type.bodyLg}
              right={
                <Icon name="search" size={16} color={colors.onSurfaceVariant} />
              }
            />
          </View>

          <View
            style={[styles.group, { marginTop: spacing.xs, gap: spacing.sm }]}
          >
            <Text style={[type.labelMd, styles.label, styles.labelPad]}>
              Living environment
            </Text>
            <View style={styles.chips}>
              {ENVIRONMENTS.map((env) => (
                <ChoiceChip
                  key={env.label}
                  label={env.label}
                  icon={env.icon}
                  active={environment === env.label}
                  onPress={() => setEnvironment(env.label)}
                />
              ))}
            </View>
          </View>

          <View style={styles.infoRow}>
            <Icon name="auto-awesome" size={14} color={colors.surfaceTint} />
            <Text style={[type.bodySm, { color: colors.onSurfaceVariant }]}>
              Used to build {catName}'s personal baseline.
            </Text>
          </View>

          {!!error && (
            <Text
              style={[
                type.bodySm,
                { color: colors.error, textAlign: "center" },
              ]}
            >
              {error}
            </Text>
          )}

          <Button
            label={saving ? "Saving..." : "Continue"}
            icon="arrow-forward"
            iconSize={18}
            onPress={onContinue}
            disabled={!canContinue || saving}
            gradient={gradients.ctaWarm}
            paddingVertical={16}
            style={{ marginTop: spacing.sm }}
          />
        </View>
      </View>

      {/* Edit card (prototype shows it under the form) */}
      {SHOW_EDIT_CARD_PREVIEW && (
        <View style={styles.editCard}>
          <View style={styles.editHeader}>
            <View style={styles.editTitleRow}>
              <Icon name="tune" size={16} color={colors.tertiaryContainer} />
              <Text style={[type.headlineSm, { color: colors.onSurface }]}>
                Edit {catName}
              </Text>
            </View>
            <Badge
              label="Quick update"
              background={colors.surfaceContainerHighest}
              color={colors.tertiary}
              uppercase
              letterSpacing={0}
            />
          </View>

          <View style={styles.editSummary}>
            <CatAvatar source={images.catEdit} size={48} />
            <View style={{ flex: 1, minWidth: 0 }}>
              <View style={styles.nameRow}>
                <Text
                  numberOfLines={1}
                  style={[type.labelLg, { color: colors.onSurface }]}
                >
                  {name.trim() || "Your cat"}
                </Text>
                <View style={styles.onlineDot} />
              </View>
              <Text
                numberOfLines={1}
                style={[type.bodySm, { color: colors.onSurfaceVariant }]}
              >
                {[
                  breed.trim(),
                  age.trim().replace(/years?/i, "yrs"),
                  environment,
                ]
                  .filter(Boolean)
                  .join(" • ")}
              </Text>
            </View>
          </View>

          <View style={styles.editButtons}>
            <Button
              label="Cancel"
              labelStyle={type.labelLg}
              color={colors.onSurface}
              background={withAlpha(colors.surfaceVariant, 0.5)}
              paddingVertical={12}
              paddingHorizontal={16}
              shadow={shadows.cancel}
              pressScale={0.95}
              style={{ flex: 1 }}
              onPress={() => router.back()}
            />
            <Button
              label="Save changes"
              labelStyle={type.labelLg}
              icon="check"
              iconPosition="left"
              iconSize={14}
              gap={4}
              gradient={gradients.ctaWarmShort}
              paddingVertical={12}
              paddingHorizontal={16}
              shadow={shadows.ctaSoft}
              pressScale={0.95}
              style={{ flex: 1 }}
              onPress={() => {
                /* TODO: save the changes of an existing cat (PATCH /cats/:id) */
              }}
            />
          </View>
        </View>
      )}

      {/* Privacy footer */}
      <View style={styles.footer}>
        <Icon name="lock" size={12} color={colors.onSurfaceVariant} />
        <Text style={[type.bodySm, { color: colors.onSurfaceVariant }]}>
          Your cat's data stays private and encrypted.
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceContainer,
    overflow: "hidden",
    marginBottom: spacing.xl,
    boxShadow: shadows.xl,
  },
  titleBox: {
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  title: {
    color: colors.onSurface,
    textAlign: "center",
    letterSpacing: letterSpacing(26, tracking.tight),
    marginBottom: spacing.xs,
  },
  subtitle: {
    color: colors.onSurfaceVariant,
    textAlign: "center",
    maxWidth: 280,
  },
  photoArea: {
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  photoRing: {
    width: 112,
    height: 112,
    padding: 4,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceContainerLowest,
    boxShadow: shadows.inner,
  },
  cameraBadge: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 36,
    height: 36,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceTint,
    alignItems: "center",
    justifyContent: "center",
    boxShadow: shadows.badgeGlow,
  },
  photoLabel: {
    marginTop: spacing.xs,
    color: colors.onSurfaceVariant,
  },
  form: {
    gap: spacing.md,
  },
  group: {
    gap: 4,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },
  label: {
    color: colors.onSurface,
  },
  labelPad: {
    paddingHorizontal: 4,
  },
  chips: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
    paddingHorizontal: 4,
  },

  editCard: {
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceContainerLow,
    overflow: "hidden",
    marginBottom: spacing.lg,
    boxShadow: shadows.lg,
  },
  editHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.sm,
  },
  editTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  editSummary: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: 12,
    marginBottom: spacing.md,
    borderRadius: radius.base,
    backgroundColor: colors.surfaceContainer,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: radius.full,
    backgroundColor: colors.secondary,
    boxShadow: shadows.dotGlow,
  },
  editButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },

  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: spacing.sm,
  },
});
