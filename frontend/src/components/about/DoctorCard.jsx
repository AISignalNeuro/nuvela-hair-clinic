import { motion } from "framer-motion";
import Icon from "../ui/Icon.jsx";
import { Avatar } from "../ui/Primitives.jsx";
import { useI18n } from "../../i18n/I18nProvider.jsx";
import { LANGUAGES } from "../../i18n/config.js";

const langLabel = (code) => LANGUAGES.find((l) => l.code === code)?.short ?? code.toUpperCase();

export default function DoctorCard({ doctor, detailed = false }) {
  const { t } = useI18n();
  return (
    <motion.article className="doctor-card" whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 260, damping: 20 }}>
      <div className="doctor-card-head">
        <Avatar initials={doctor.initials} hue={doctor.hue} size={detailed ? 76 : 64} />
        <div>
          <h3 className="doctor-name">{doctor.name}</h3>
          <p className="doctor-role">{doctor.role}</p>
        </div>
      </div>
      {detailed && <p className="doctor-bio">{doctor.bio}</p>}
      <div className="doctor-meta">
        <span>
          <Icon name="award" size={15} /> {t("common.yearsExp", { n: doctor.years })}
        </span>
        <span>
          <Icon name="chat" size={15} /> {doctor.languages.map(langLabel).join(" · ")}
        </span>
      </div>
      {detailed && (
        <div className="tag-row">
          {doctor.specialties?.map((s) => (
            <span key={s} className="tag">{s}</span>
          ))}
        </div>
      )}
    </motion.article>
  );
}
