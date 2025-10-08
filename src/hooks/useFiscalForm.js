import { useState, useEffect, useCallback } from "react";

export const useFiscalForm = (initialData) => {
  const [formData, setFormData] = useState({
    fiscalName: "",
    fiscalEmail: "",
    fiscalPassword: "",
    fiscalPhone: "",
  });

  const [validation, setValidation] = useState({
    fiscalName: { isValid: true, message: "" },
    fiscalEmail: { isValid: true, message: "" },
    fiscalPassword: { isValid: true, message: "", strength: 0 },
    fiscalPhone: { isValid: true, message: "" },
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        fiscalName: initialData.name || "",
        fiscalEmail: initialData.email || "",
        fiscalPassword: "",
        fiscalPhone: initialData.phone || "",
      });
    }
  }, [initialData]);

  const validateName = useCallback((name) => {
    if (!name || name.trim().length === 0) {
      return { isValid: false, message: "Nome é obrigatório" };
    }
    if (name.trim().length < 3) {
      return {
        isValid: false,
        message: "Nome deve ter pelo menos 3 caracteres",
      };
    }
    const nameParts = name.trim().split(" ");
    if (nameParts.length < 2) {
      return { isValid: false, message: "Digite o nome completo" };
    }
    return { isValid: true, message: "" };
  }, []);

  const validateEmail = useCallback((email) => {
    if (!email || email.trim().length === 0) {
      return { isValid: false, message: "Email é obrigatório" };
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { isValid: false, message: "Email inválido" };
    }
    return { isValid: true, message: "" };
  }, []);

  const calculatePasswordStrength = useCallback((password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    return strength;
  }, []);

  const validatePassword = useCallback(
    (password) => {
      if (!password || password.length === 0) {
        return {
          isValid: false,
          message: "Senha é obrigatória",
          strength: 0,
        };
      }
      if (password.length < 8) {
        return {
          isValid: false,
          message: "Senha deve ter pelo menos 8 caracteres",
          strength: calculatePasswordStrength(password),
        };
      }

      const strength = calculatePasswordStrength(password);

      if (strength < 3) {
        return {
          isValid: false,
          message:
            "Senha fraca. Use letras maiúsculas, minúsculas, números e caracteres especiais",
          strength,
        };
      }

      return {
        isValid: true,
        message: "Senha forte",
        strength,
      };
    },
    [calculatePasswordStrength]
  );

  const validatePhone = useCallback((phone) => {
    if (!phone || phone.trim().length === 0) {
      return { isValid: false, message: "Telefone é obrigatório" };
    }
    const numbersOnly = phone.replace(/\D/g, "");
    if (numbersOnly.length < 10 || numbersOnly.length > 11) {
      return { isValid: false, message: "Telefone inválido" };
    }
    return { isValid: true, message: "" };
  }, []);

  const handleInputChange = useCallback(
    (field, value) => {
      setFormData((prev) => ({ ...prev, [field]: value }));

      let validationResult;
      switch (field) {
        case "fiscalName":
          validationResult = validateName(value);
          break;
        case "fiscalEmail":
          validationResult = validateEmail(value);
          break;
        case "fiscalPassword":
          validationResult = validatePassword(value);
          break;
        case "fiscalPhone":
          validationResult = validatePhone(value);
          break;
        default:
          return;
      }

      setValidation((prev) => ({
        ...prev,
        [field]: validationResult,
      }));
    },
    [validateName, validateEmail, validatePassword, validatePhone]
  );

  const isFormValid = useCallback(() => {
    return (
      validation.fiscalName.isValid &&
      validation.fiscalEmail.isValid &&
      validation.fiscalPassword.isValid &&
      validation.fiscalPhone.isValid &&
      formData.fiscalName.trim() !== "" &&
      formData.fiscalEmail.trim() !== "" &&
      formData.fiscalPassword.trim() !== "" &&
      formData.fiscalPhone.trim() !== ""
    );
  }, [validation, formData]);

  const resetForm = useCallback(() => {
    setFormData({
      fiscalName: "",
      fiscalEmail: "",
      fiscalPassword: "",
      fiscalPhone: "",
    });
    setValidation({
      fiscalName: { isValid: true, message: "" },
      fiscalEmail: { isValid: true, message: "" },
      fiscalPassword: { isValid: true, message: "", strength: 0 },
      fiscalPhone: { isValid: true, message: "" },
    });
  }, []);

  return {
    formData,
    validation,
    handleInputChange,
    isFormValid,
    resetForm,
  };
};

