// "from €2,350" or "from €150 / session", localized.
export function formatPriceFrom(service, t, format) {
  const price = format.price(service.priceFrom);
  return `${t("common.from")} ${price}${service.priceUnit === "session" ? ` ${t("common.perSession")}` : ""}`;
}

// A service fact like { key: "recovery", value: "7–10", unit: "days" } → "7–10 days".
export function formatFact(fact, t) {
  if (fact.unit === null) return t(`factValues.${fact.value}`);
  if (fact.value === "0") return t("factValues.0");
  const unit = t(`units.${fact.unit}`);
  return unit ? `${fact.value} ${unit}` : fact.value;
}
