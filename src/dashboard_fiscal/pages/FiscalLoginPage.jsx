import { useState, useEffect } from "react";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  AlertCircle,
  CheckCircle,
  HardHat,
  Camera,
  FileText,
  ArrowLeft,
  CircleAlert,
} from "lucide-react";
import footer from "../../assets/footer.png";
import logo from "../../assets/logo_gov.png";
import { fiscalApiService } from "../services/fiscalApi";
import { useNavigate } from "react-router-dom";

function FiscalLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [isValidPassword, setIsValidPassword] = useState(false);
  const [focusedField, setFocusedField] = useState("");

  const dataAtual = new Date();
  const anoAtual = dataAtual.getFullYear();

  // Auto-focus no email quando a página carrega
  useEffect(() => {
    const emailInput = document.getElementById("email");
    if (emailInput) {
      emailInput.focus();
    }
  }, []);

  // Validar Email
  const validateEmail = (emailValue) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailValue);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setIsValidEmail(validateEmail(value));
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setIsValidPassword(value.length >= 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validação adicional antes de enviar
    if (!isValidEmail) {
      setError("Por favor, insira um email válido");
      return;
    }

    if (!password.trim()) {
      setError("Por favor, insira sua senha");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Tentar fazer login
      const response = await fiscalApiService.login(email, password);

      // Se chegou aqui, login foi bem-sucedido (status 200)
      const token = response.data.token;
      localStorage.setItem("fiscal_token", token);

      // Buscar informações do fiscal
      const meResponse = await fiscalApiService.getMe();
      const fiscalInfo = {
        id: meResponse.data.content.id,
        name: meResponse.data.content.name,
        email: meResponse.data.content.email,
        phone: meResponse.data.content.phone,
        token: token,
      };

      localStorage.setItem("fiscal_info", JSON.stringify(fiscalInfo));

      // Apenas redireciona em caso de sucesso
      navigate("/fiscal/dashboard");
    } catch (err) {
      const status = err.response?.status;
      const errorData = err.response?.data?.errors?.[0];

      let errorMessage = "";

      // Priorizar mensagens da API (já estão em português)
      if (errorData?.detail) {
        errorMessage = errorData.detail;
      } else if (status === 500) {
        errorMessage = "Erro no servidor. Tente novamente mais tarde.";
      } else if (status === 429) {
        errorMessage =
          "Muitas tentativas. Aguarde alguns minutos e tente novamente.";
      } else if (!err.response) {
        errorMessage =
          "Erro de conexão. Verifique sua internet e tente novamente.";
      } else {
        errorMessage = "Erro ao fazer login. Tente novamente.";
      }

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-50 px-4 py-4">
      <div className="bg-white shadow-2xl rounded-3xl p-6 w-full max-w-md border border-gray-100">
        {/* Botão Voltar */}
        <button
          type="button"
          onClick={() => navigate("/")}
          className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Voltar ao login principal</span>
        </button>

        {/* Cabeçalho */}
        <div className="mb-6 text-center">
          <div className="relative inline-block">
            <img
              src={logo}
              alt="Logo Governo"
              className="mx-auto w-20 md:w-24 drop-shadow-sm"
            />
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <HardHat className="w-5 h-5 text-white" />
            </div>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 mt-4 mb-1">
            Portal do Fiscal
          </h1>
          <p className="text-sm text-gray-600 font-medium">
            Fiscalização de Obras em Campo
          </p>
          <div className="mt-3 w-12 h-0.5 bg-orange-600 rounded-full mx-auto"></div>
        </div>

        {/* Features Mobile */}
        <div className="mb-6 grid grid-cols-3 gap-3">
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <Camera className="w-6 h-6 text-orange-600 mx-auto mb-1" />
            <p className="text-xs font-medium text-gray-700">Fotos</p>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <FileText className="w-6 h-6 text-orange-600 mx-auto mb-1" />
            <p className="text-xs font-medium text-gray-700">Relatórios</p>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <HardHat className="w-6 h-6 text-orange-600 mx-auto mb-1" />
            <p className="text-xs font-medium text-gray-700">Obras</p>
          </div>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campo Email */}
          <div className="space-y-1">
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-700 flex items-center gap-1"
            >
              <Mail className="w-4 h-4" />
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                name="email"
                placeholder="seu@email.com"
                className={`w-full px-4 py-3 border-2 rounded-lg shadow-sm transition-all duration-200 outline-none text-base ${
                  focusedField === "email"
                    ? "border-orange-500 ring-2 ring-orange-100"
                    : "border-gray-200 hover:border-gray-300"
                } ${
                  isValidEmail && email.length > 0
                    ? "border-green-500 bg-green-50"
                    : ""
                }`}
                required
                value={email}
                onChange={handleEmailChange}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField("")}
                onKeyPress={handleKeyPress}
                autoComplete="email"
                aria-describedby="email-help"
              />
              {isValidEmail && email.length > 0 && (
                <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
              )}
            </div>
            <p id="email-help" className="text-xs text-gray-500">
              Use o email cadastrado como fiscal
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
                className={`w-full px-4 py-3 pr-12 border-2 rounded-lg shadow-sm transition-all duration-200 outline-none text-base ${
                  focusedField === "password"
                    ? "border-orange-500 ring-2 ring-orange-100"
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
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            <p id="password-help" className="text-xs text-gray-500">
              Sua senha é confidencial
            </p>
          </div>

          {/* Mensagem de erro */}
          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 flex items-start gap-3">
              <CircleAlert className="w-6 h-6 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium leading-relaxed text-red-700">
                  {error}
                </p>
              </div>
            </div>
          )}

          {/* Botão de Login */}
          <button
            type="submit"
            disabled={loading || !isValidEmail || !isValidPassword}
            className={`w-full py-3.5 px-4 rounded-lg font-semibold text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-100 text-base ${
              loading || !isValidEmail || !isValidPassword
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Entrando...
              </div>
            ) : (
              "Entrar como Fiscal"
            )}
          </button>
        </form>

        {/* Informações de Uso Mobile */}
        <div className="mt-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
          <h3 className="text-sm font-semibold text-orange-800 mb-2 flex items-center gap-1">
            <HardHat className="w-4 h-4" />
            Acesso Mobile
          </h3>
          <ul className="text-xs text-orange-700 space-y-1">
            <li>• Tire fotos diretamente da câmera</li>
            <li>• Crie relatórios em campo</li>
            <li>• Acompanhe suas fiscalizações</li>
            <li>• Funciona offline (em breve)</li>
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

export default FiscalLoginPage;
