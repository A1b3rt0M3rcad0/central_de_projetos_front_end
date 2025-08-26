import { useState } from "react";
import footer from "../../assets/footer.png";
import logo from "../../assets/logo_gov.png";
import authApi from "../../services/api/auth";
import { useNavigate } from "react-router-dom";

function Login() {
  const navitate = useNavigate();
  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dataAtual = new Date();
  const anoAtual = dataAtual.getFullYear();

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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await authApi.login(cpf, password);
      navitate("/home");
      localStorage.setItem("access_token", response.data["token"]);
    } catch (err) {
      const status = err.response?.status;
      const errorData = err.response?.data?.errors?.[0];

      let errorMessage = "";

      if (status === 500) {
        errorMessage = "Erro no servidor. Tente novamente mais tarde.";
      } else if (status == 403) {
        errorMessage = "Senha ou CPF incorreto. Verifique antes de prosseguir.";
      } else if (status == 429) {
        errorMessage =
          "Número de tentativas excedido, tente novamente mais tarde";
      } else if (errorData) {
        errorMessage = `${errorData.title}: ${errorData.detail}`;
      } else {
        errorMessage = "Erro ao conectar. Verifique seu CPF e senha.";
      }

      console.error("Erro no login:", errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        {/* Cabeçalho */}
        <div className="mb-6 text-center">
          <img src={logo} alt="Logo Governo" className="mx-auto w-24 md:w-28" />
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 mt-4">
            Escritório de Projetos
          </h1>
          <p className="text-sm md:text-base text-gray-600">Acesso restrito</p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="cpf"
              className="block text-sm font-medium text-gray-700"
            >
              CPF
            </label>
            <input
              type="text"
              id="cpf"
              name="cpf"
              placeholder="000.000.000-00"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-600 focus:border-blue-600 outline-none"
              required
              value={cpf}
              onChange={handleCpfChange}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Senha
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="••••••••"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-600 focus:border-blue-600 outline-none"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Mensagem de erro */}
          {error && (
            <p className="text-sm text-red-500 text-center break-words">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition`}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        {/* Rodapé */}
        <div className="mt-8 text-center text-xs text-gray-500">
          <p>
            © {anoAtual} Prefeitura Municipal de Imbituba. Todos os direitos
            reservados.
          </p>
          <div className="mt-4">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://imbituba.atende.net/"
            >
              <img
                src={footer}
                alt="Logo Footer"
                className="mx-auto w-16 md:w-20"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
