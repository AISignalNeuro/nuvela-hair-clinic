import { useState } from "react";
import ScalpArt from "./ScalpArt.jsx";
import Icon from "./Icon.jsx";
import { useI18n } from "../../i18n/I18nProvider.jsx";

// Draggable before/after comparison. A native range input drives it, so it works
// with mouse, touch and keyboard. Always laid out LTR (before = left) for clarity.
export default function BeforeAfterSlider({ item, initial = 50, compact = false, className = "" }) {
  const { t } = useI18n();
  const [pos, setPos] = useState(initial);
  const art = { variant: item.art, severity: item.severity, seed: item.seed };

  return (
    <div className={`ba-slider ${compact ? "ba-slider--compact" : ""} ${className}`} dir="ltr" style={{ "--pos": `${pos}%` }}>
      <div className="ba-layer ba-layer--after">
        <ScalpArt {...art} stage="after" />
      </div>
      <div className="ba-layer ba-layer--before">
        <ScalpArt {...art} stage="before" />
      </div>
      <span className="ba-tag ba-tag--before">{t("gallery.before")}</span>
      <span className="ba-tag ba-tag--after">{t("gallery.after")}</span>
      <div className="ba-handle" aria-hidden="true">
        <span className="ba-handle-knob">
          <Icon name="arrowLeft" size={14} />
          <Icon name="arrowRight" size={14} />
        </span>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        className="ba-range"
        aria-label={t("gallery.dragHint")}
      />
    </div>
  );
}
