import { useState, useEffect } from "react";
import Select from "@/components/atoms/Select";
import Label from "@/components/atoms/Label";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import languageService from "@/services/api/languageService";

const LanguageSelect = ({ 
  label, 
  value, 
  onChange, 
  placeholder = "Select language",
  excludeCode = null,
  className = "" 
}) => {
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadLanguages = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await languageService.getAll();
      setLanguages(data);
    } catch (err) {
      setError(err.message || "Failed to load languages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLanguages();
  }, []);

  if (loading) {
    return (
      <div className={className}>
        {label && <Label className="mb-2">{label}</Label>}
        <div className="h-[46px] bg-gray-100 rounded-xl animate-pulse"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={className}>
        {label && <Label className="mb-2">{label}</Label>}
        <Error 
          message={error} 
          onRetry={loadLanguages}
          showRetry={true}
        />
      </div>
    );
  }

  const filteredLanguages = excludeCode 
    ? languages.filter(lang => lang.code !== excludeCode)
    : languages;

  return (
    <div className={className}>
      {label && <Label className="mb-2">{label}</Label>}
      <Select
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      >
        {filteredLanguages.map((language) => (
          <option key={language.Id} value={language.code}>
            {language.flag} {language.name} ({language.nativeName})
          </option>
        ))}
      </Select>
    </div>
  );
};

export default LanguageSelect;