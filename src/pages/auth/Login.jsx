import { useState, useEffect } from "react";
import {
  Eye,
  EyeOff,
  Lock,
  User,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import footer from "../../assets/footer.png";
import logo from "../../assets/logo_gov.png";
import authApi from "../../services/api/auth";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isValidCpf, setIsValidCpf] = useState(false);
  const [isValidPassword, setIsValidPassword] = useState(false);
  const [focusedField, setFocusedField] = useState("");

  const dataAtual = new Date();
  const anoAtual = dataAtual.getFullYear();

  // Auto-focus no CPF quando a página carrega
  useEffect(() => {
    const cpfInput = document.getElementById("cpf");
    if (cpfInput) {
      cpfInput.focus();
    }
  }, []);

  // Validar CPF
  const validateCpf = (cpfValue) => {
    const cleanCpf = cpfValue.replace(/\D/g, "");
    return cleanCpf.length === 11;
  };

  const handleCpfChange = (e) => {
    let value = e.target.value;
    value = value.replace(/\D/g, ""); // Remove tudo que não é número

    // Limita a 11 dígitos
    if (value.length > 11) {
      value = value.slice(0, 11);
    }

    // Aplica a máscara
    value = value
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");

    setCpf(value);
    setIsValidCpf(validateCpf(value));
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setIsValidPassword(value.length >= 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validação adicional antes de enviar
    if (!isValidCpf) {
      setError("Por favor, insira um CPF válido");
      return;
    }

    if (!password.trim()) {
      setError("Por favor, insira sua senha");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await authApi.login(cpf, password);
      navigate("/home");
      localStorage.setItem("access_token", response.data["token"]);
    } catch (err) {
      const status = err.response?.status;
      const errorData = err.response?.data?.errors?.[0];

      let errorMessage = "";

      if (status === 500) {
        errorMessage = "Erro no servidor. Tente novamente mais tarde.";
      } else if (status === 403) {
        errorMessage = "CPF ou senha incorretos. Verifique suas credenciais.";
      } else if (status === 429) {
        errorMessage =
          "Muitas tentativas. Aguarde alguns minutos e tente novamente.";
      } else if (errorData) {
        errorMessage = `${errorData.title}: ${errorData.detail}`;
      } else {
        errorMessage =
          "Erro de conexão. Verifique sua internet e tente novamente.";
      }

      console.error("Erro no login:", errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 px-4 py-4">
      <div className="bg-white shadow-2xl rounded-3xl p-6 w-full max-w-sm border border-gray-100">
        {/* Cabeçalho */}
        <div className="mb-6 text-center">
          <div className="relative">
            <img
              src={logo}
              alt="Logo Governo"
              className="mx-auto w-20 md:w-24 drop-shadow-sm"
            />
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-3 h-3 text-white" />
            </div>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 mt-4 mb-1">
            Escritório de Projetos
          </h1>
          <p className="text-sm text-gray-600 font-medium">Sistema de Gestão</p>
          <div className="mt-3 w-12 h-0.5 bg-blue-600 rounded-full mx-auto"></div>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campo CPF */}
          <div className="space-y-1">
            <label
              htmlFor="cpf"
              className="block text-sm font-semibold text-gray-700 flex items-center gap-1"
            >
              <User className="w-4 h-4" />
              CPF
            </label>
            <div className="relative">
              <input
                type="text"
                id="cpf"
                name="cpf"
                placeholder="000.000.000-00"
                className={`w-full px-3 py-2.5 border-2 rounded-lg shadow-sm transition-all duration-200 outline-none ${
                  focusedField === "cpf"
                    ? "border-blue-500 ring-2 ring-blue-100"
                    : "border-gray-200 hover:border-gray-300"
                } ${
                  isValidCpf && cpf.length > 0
                    ? "border-green-500 bg-green-50"
                    : ""
                }`}
                required
                value={cpf}
                onChange={handleCpfChange}
                onFocus={() => setFocusedField("cpf")}
                onBlur={() => setFocusedField("")}
                onKeyPress={handleKeyPress}
                autoComplete="username"
                aria-describedby="cpf-help"
              />
              {isValidCpf && cpf.length > 0 && (
                <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-500" />
              )}
            </div>
            <p id="cpf-help" className="text-xs text-gray-500">
              Digite apenas os números
            </p>
          </div>

          {/* Campo Senha */}
          <div className="space-y-1">
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-700 flex items-center gap-1"
            >
              <Lock className="w-4 h-4" />
              Senha
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Digite sua senha"
                className={`w-full px-3 py-2.5 pr-10 border-2 rounded-lg shadow-sm transition-all duration-200 outline-none ${
                  focusedField === "password"
                    ? "border-blue-500 ring-2 ring-blue-100"
                    : "border-gray-200 hover:border-gray-300"
                } ${
                  isValidPassword && password.length > 0
                    ? "border-green-500 bg-green-50"
                    : ""
                }`}
                required
                value={password}
                onChange={handlePasswordChange}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField("")}
                onKeyPress={handleKeyPress}
                autoComplete="current-password"
                aria-describedby="password-help"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            <p id="password-help" className="text-xs text-gray-500">
              Sua senha é confidencial
            </p>
          </div>

          {/* Mensagem de erro */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}

          {/* Botão de Login */}
          <button
            type="submit"
            disabled={loading || !isValidCpf || !isValidPassword}
            className={`w-full py-2.5 px-4 rounded-lg font-semibold text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-100 ${
              loading || !isValidCpf || !isValidPassword
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            }`}
            aria-describedby="submit-help"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Entrando...
              </div>
            ) : (
              "Entrar no Sistema"
            )}
          </button>

          <p id="submit-help" className="text-xs text-gray-500 text-center">
            Pressione Enter para fazer login
          </p>
        </form>

        {/* Botão de Login como Fiscal */}
        <div className="mt-4">
          <button
            type="button"
            onClick={() => navigate("/fiscal/login")}
            className="w-full py-2.5 px-4 rounded-lg font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 hover:border-blue-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-100"
          >
            Entrar como Fiscal
          </button>
          <p className="text-xs text-gray-500 text-center mt-2">
            Acesso exclusivo para fiscais de obras
          </p>
        </div>

        {/* Informações de Segurança */}
        <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-sm font-semibold text-blue-800 mb-1 flex items-center gap-1">
            <Lock className="w-4 h-4" />
            Segurança
          </h3>
          <ul className="text-xs text-blue-700 space-y-0.5">
            <li>• Conexão criptografada</li>
            <li>• Dados protegidos</li>
            <li>• Não compartilhe credenciais</li>
          </ul>
        </div>

        {/* Rodapé */}
        <div className="mt-6 text-center">
          <div className="mb-3">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://imbituba.atende.net/"
              className="inline-block transition-transform hover:scale-105"
            >
              <img
                src={footer}
                alt="Prefeitura Municipal de Imbituba"
                className="mx-auto w-14 md:w-16 drop-shadow-sm"
              />
            </a>
          </div>
          <p className="text-xs text-gray-500">
            © {anoAtual} Prefeitura Municipal de Imbituba
          </p>
          <p className="text-xs text-gray-400">Todos os direitos reservados</p>
        </div>
      </div>
    </div>
  );
}

export default Login;
