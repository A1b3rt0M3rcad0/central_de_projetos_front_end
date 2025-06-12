import { useNavigate, useLocation } from "react-router-dom";
import UserForm from "../forms/UserForm";
import BasePage from "../components/BasePage";
import userApi from "../services/endpoints/user";
import Swal from "sweetalert2";

export default function UserFormPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const initial_date = location?.state?.initial_date;

  // Função para criar usuário - usa todos os dados
  async function onSubmit({
    userName,
    userEmail,
    userCpf,
    userRole,
    userPassword,
  }) {
    try {
      await userApi.postUser({
        name: userName,
        email: userEmail,
        cpf: userCpf,
        role: userRole,
        password: userPassword,
      });
      Swal.fire(
        "Criado com sucesso!",
        "O usuário foi criado com sucesso.",
        "success"
      );
      navigate(-1);
    } catch (error) {
      const status = error?.response?.status;
      Swal.fire(
        "Erro!",
        `${status === 409 ? "Usuário já existe" : "Erro ao criar usuário"}`,
        "error"
      );
    }
  }

  async function onUpdate({ userEmail, userPassword, userCpf }, oldData) {
    try {
      // Atualiza email se mudou
      if (userEmail !== oldData.oldUserEmail) {
        await userApi.patchUserEmail({
          cpf: userCpf,
          email: userEmail,
        });
      }

      // Atualiza senha se foi informada (pode atualizar mesmo se email não mudou)
      if (userPassword) {
        await userApi.patchUserPassword({
          cpf: userCpf,
          password: userPassword,
        });
      }

      Swal.fire(
        "Atualizado com sucesso!",
        "O usuário foi atualizado com sucesso.",
        "success"
      );
      navigate(-1);
    } catch (error) {
      const status = error?.response?.status;
      Swal.fire(
        "Erro!",
        `${
          status === 409 ? "Email já está em uso" : "Erro ao atualizar usuário"
        }`,
        "error"
      );
    }
  }

  return (
    <BasePage pageTitle={initial_date ? "Editar Usuário" : "Criar Usuário"}>
      <UserForm
        onBack={() => navigate(-1)}
        onSubmit={onSubmit}
        onUpdate={onUpdate}
        initial_date={initial_date}
      />
    </BasePage>
  );
}
