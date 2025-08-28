import React from "react";
import { Shield, AlertTriangle, CheckCircle } from "lucide-react";

const PasswordStrengthMeter = ({ strength, message }) => {
  const getStrengthColor = (strength) => {
    if (strength < 2) return "text-red-600 bg-red-50";
    if (strength < 3) return "text-orange-600 bg-orange-50";
    if (strength < 4) return "text-yellow-600 bg-yellow-50";
    if (strength < 5) return "text-blue-600 bg-blue-50";
    return "text-green-600 bg-green-50";
  };

  const getStrengthIcon = (strength) => {
    if (strength < 2) return <AlertTriangle className="w-4 h-4" />;
    if (strength < 4) return <Shield className="w-4 h-4" />;
    return <CheckCircle className="w-4 h-4" />;
  };

  const getStrengthText = (strength) => {
    if (strength < 2) return "Muito fraca";
    if (strength < 3) return "Fraca";
    if (strength < 4) return "Média";
    if (strength < 5) return "Forte";
    return "Muito forte";
  };

  const getProgressColor = (strength) => {
    if (strength < 2) return "bg-red-500";
    if (strength < 3) return "bg-orange-500";
    if (strength < 4) return "bg-yellow-500";
    if (strength < 5) return "bg-blue-500";
    return "bg-green-500";
  };

  if (!strength) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {getStrengthIcon(strength)}
        <span className={`text-sm font-medium ${getStrengthColor(strength)}`}>
          {getStrengthText(strength)}
        </span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(
            strength
          )}`}
          style={{ width: `${(strength / 5) * 100}%` }}
        />
      </div>

      <div className="text-xs text-gray-500 space-y-1">
        <p>Requisitos:</p>
        <ul className="space-y-1 ml-2">
          <li
            className={`flex items-center gap-1 ${
              strength >= 1 ? "text-green-600" : "text-gray-400"
            }`}
          >
            <span className="w-1 h-1 rounded-full bg-current" />
            Pelo menos 8 caracteres
          </li>
          <li
            className={`flex items-center gap-1 ${
              strength >= 2 ? "text-green-600" : "text-gray-400"
            }`}
          >
            <span className="w-1 h-1 rounded-full bg-current" />
            Letra minúscula
          </li>
          <li
            className={`flex items-center gap-1 ${
              strength >= 3 ? "text-green-600" : "text-gray-400"
            }`}
          >
            <span className="w-1 h-1 rounded-full bg-current" />
            Letra maiúscula
          </li>
          <li
            className={`flex items-center gap-1 ${
              strength >= 4 ? "text-green-600" : "text-gray-400"
            }`}
          >
            <span className="w-1 h-1 rounded-full bg-current" />
            Número
          </li>
          <li
            className={`flex items-center gap-1 ${
              strength >= 5 ? "text-green-600" : "text-gray-400"
            }`}
          >
            <span className="w-1 h-1 rounded-full bg-current" />
            Caractere especial
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PasswordStrengthMeter;
