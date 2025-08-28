import { useState, useEffect, useCallback } from "react";
import userApi from "../services/api/user";
import Swal from "sweetalert2";

export const useUserForm = (initialData = null) => {
  const [formData, setFormData] = useState({
    userName: "",
    userEmail: "",
    userCpf: "",
    userRole: "",
    userPassword: "",
  });

  const [validation, setValidation] = useState({
    userName: { isValid: true, message: "", isChecking: false },
    userEmail: { isValid: true, message: "", isChecking: false },
    userCpf: { isValid: true, message: "", isChecking: false },
    userRole: { isValid: true, message: "" },
    userPassword: { isValid: true, message: "", strength: 0 },
  });

  const [suggestions, setSuggestions] = useState({
    names: [],
  });

  const [isLoading, setIsLoading] = useState(false);
  const [userStats, setUserStats] = useState(null);

  // Debounce function
  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  };

  // Validação de CPF
  const validateCpf = useCallback(
    debounce(async (cpf) => {
      if (!cpf || cpf.replace(/\D/g, "").length !== 11) return;

      setValidation((prev) => ({
        ...prev,
        userCpf: { ...prev.userCpf, isChecking: true },
      }));

      try {
        const exists = await userApi.validateCpfExists(cpf);
        if (exists && !initialData) {
          setValidation((prev) => ({
            ...prev,
            userCpf: {
              isValid: false,
              message: "CPF já cadastrado no sistema",
              isChecking: false,
            },
          }));
        } else {
          setValidation((prev) => ({
            ...prev,
            userCpf: {
              isValid: true,
              message: "",
              isChecking: false,
            },
          }));
        }
      } catch (error) {
        setValidation((prev) => ({
          ...prev,
          userCpf: {
            isValid: true,
            message: "",
            isChecking: false,
          },
        }));
      }
    }, 500),
    [initialData]
  );

  // Validação de email
  const validateEmail = useCallback(
    debounce(async (email) => {
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;

      setValidation((prev) => ({
        ...prev,
        userEmail: { ...prev.userEmail, isChecking: true },
      }));

      try {
        const exists = await userApi.validateEmailExists(email);
        if (exists && email !== initialData?.email) {
          setValidation((prev) => ({
            ...prev,
            userEmail: {
              isValid: false,
              message: "Email já cadastrado no sistema",
              isChecking: false,
            },
          }));
        } else {
          setValidation((prev) => ({
            ...prev,
            userEmail: {
              isValid: true,
              message: "",
              isChecking: false,
            },
          }));
        }
      } catch (error) {
        setValidation((prev) => ({
          ...prev,
          userEmail: {
            isValid: true,
            message: "",
            isChecking: false,
          },
        }));
      }
    }, 500),
    [initialData]
  );

  // Validação de força da senha
  const validatePasswordStrength = (password) => {
    if (!password) return 0;

    let strength = 0;
    const checks = [
      password.length >= 8, // Comprimento mínimo
      /[a-z]/.test(password), // Letra minúscula
      /[A-Z]/.test(password), // Letra maiúscula
      /\d/.test(password), // Número
      /[!@#$%^&*(),.?":{}|<>]/.test(password), // Caractere especial
    ];

    strength = checks.filter(Boolean).length;

    let message = "";
    if (strength < 2) message = "Senha muito fraca";
    else if (strength < 3) message = "Senha fraca";
    else if (strength < 4) message = "Senha média";
    else if (strength < 5) message = "Senha forte";
    else message = "Senha muito forte";

    return { strength, message };
  };

  // Buscar sugestões
  const fetchSuggestions = useCallback(
    debounce(async (query, type) => {
      if (!query || query.length < 2) return;

      try {
        const response = await userApi.getUsersSuggestions(query);
        setSuggestions((prev) => ({
          ...prev,
          [type]: response.data || [],
        }));
      } catch (error) {
        console.error("Erro ao buscar sugestões:", error);
      }
    }, 300),
    []
  );

  // Carregar dados do usuário para edição
  const loadUserData = useCallback(async (cpf) => {
    if (!cpf) return;

    setIsLoading(true);
    try {
      const response = await userApi.getUserByCpf(cpf);
      const userData = response.data.content;

      setFormData({
        userName: userData.name || "",
        userEmail: userData.email || "",
        userCpf: userData.cpf || "",
        userRole: userData.role || "",
        userPassword: "",
      });

      // Carregar estatísticas do usuário
      try {
        const statsResponse = await userApi.getUserStats(cpf);
        setUserStats(statsResponse.data.content);
      } catch (error) {
        console.error("Erro ao carregar estatísticas:", error);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Erro ao carregar dados",
        text: "Não foi possível carregar os dados do usuário.",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Validação em tempo real
  const validateField = (name, value) => {
    const validations = {
      userName: {
        isValid: value.length >= 3,
        message:
          value.length < 3 ? "Nome deve ter pelo menos 3 caracteres" : "",
      },
      userEmail: {
        isValid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        message: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ? "Email inválido"
          : "",
      },
      userCpf: {
        isValid: value.replace(/\D/g, "").length === 11,
        message:
          value.replace(/\D/g, "").length !== 11
            ? "CPF deve ter 11 dígitos"
            : "",
      },
      userRole: {
        isValid: value !== "",
        message: value === "" ? "Selecione um cargo" : "",
      },
      userPassword: {
        isValid: !initialData ? value.length >= 6 : true,
        message:
          !initialData && value.length < 6
            ? "Senha deve ter pelo menos 6 caracteres"
            : "",
      },
    };

    return validations[name] || { isValid: true, message: "" };
  };

  // Handler para mudanças nos campos
  const handleInputChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    const fieldValidation = validateField(name, value);
    setValidation((prev) => ({
      ...prev,
      [name]: { ...fieldValidation, isChecking: false },
    }));

    // Validações específicas
    if (name === "userCpf" && value.replace(/\D/g, "").length === 11) {
      validateCpf(value);
    }

    if (name === "userEmail" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      validateEmail(value);
    }

    if (name === "userPassword") {
      const strength = validatePasswordStrength(value);
      setValidation((prev) => ({
        ...prev,
        userPassword: {
          ...prev.userPassword,
          strength: strength.strength,
          message: strength.message,
        },
      }));
    }

    // Buscar sugestões apenas para nomes
    if (name === "userName" && value.length >= 2) {
      fetchSuggestions(value, "names");
    }
  };

  // Verificar se o formulário é válido
  const isFormValid = () => {
    const requiredFields = initialData
      ? ["userEmail"]
      : ["userName", "userEmail", "userCpf", "userRole", "userPassword"];

    return requiredFields.every(
      (field) =>
        formData[field] &&
        validation[field].isValid &&
        !validation[field].isChecking
    );
  };

  // Reset do formulário
  const resetForm = () => {
    setFormData({
      userName: "",
      userEmail: "",
      userCpf: "",
      userRole: "",
      userPassword: "",
    });
    setValidation({
      userName: { isValid: true, message: "", isChecking: false },
      userEmail: { isValid: true, message: "", isChecking: false },
      userCpf: { isValid: true, message: "", isChecking: false },
      userRole: { isValid: true, message: "" },
      userPassword: { isValid: true, message: "", strength: 0 },
    });
    setSuggestions({ names: [] });
    setUserStats(null);
  };

  // Carregar dados iniciais
  useEffect(() => {
    if (initialData) {
      setFormData({
        userName: initialData.name || "",
        userEmail: initialData.email || "",
        userCpf: initialData.cpf || "",
        userRole: initialData.role || "",
        userPassword: "",
      });

      if (initialData.cpf) {
        loadUserData(initialData.cpf);
      }
    }
  }, [initialData, loadUserData]);

  return {
    formData,
    validation,
    suggestions,
    isLoading,
    userStats,
    handleInputChange,
    isFormValid,
    resetForm,
    loadUserData,
  };
};
