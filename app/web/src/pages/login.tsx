import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Mail, Lock, EyeOff, ArrowRight } from 'lucide-react';
import bgImage from '@/assets/login-bg.png';
import { TraceLogo } from '@/components/trace-logo';
import { loginUser } from '@/api/users/login';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import axios from 'axios';
import { useAuth } from '@/context/auth.context';
import type { ApiErrorResponse } from '@/types';

const LoginPage = () => {
  const [userLoginData, setUserLoginData] = useState({
    username: '',
    password: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string[]>>({});

  const [statusError, setStatusError] = useState('');

  function updateUserData(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setUserLoginData((prev) => ({ ...prev, [name]: value }));
  }

  const auth = useAuth();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: loginUser,

    onSuccess: () => {
      auth.login();
      setFormErrors({});

      navigate({ to: '/dashboard' });
    },

    onError: (error: Error) => {
      if (axios.isAxiosError<ApiErrorResponse>(error)) {
        const errorData = error.response?.data;

        if (errorData) {
          if ('message' in errorData) {
            // console.error(errorData.message);
            setStatusError(errorData.message);
          }
          if ('fieldErrors' in errorData) {
            // console.error(errorData.fieldErrors);
            setFormErrors(errorData.fieldErrors);
          }
        }
      } else {
        console.error('Error: ', error);
      }
    },
  });

  return (
    <>
      <div className="min-h-screen w-full flex flex-col lg:flex-row relative bg-background">
        {/* Imagem de Fundo (Atrás do form no mobile, lado ESQUERDO no desktop) */}
        <div className="absolute inset-0 lg:relative lg:block lg:flex-1 overflow-hidden z-0">
          <div className="absolute inset-0 bg-violet-900/30 mix-blend-multiply z-10" />
          <div className="absolute inset-0 bg-background/80 lg:hidden z-10 backdrop-blur-md" />{' '}
          {/* Darken overlay for mobile */}
          <img
            src={bgImage}
            alt="Trace ERP Abstract Background"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          {/* Overlay Content (Only visible on Desktop) */}
          <div className="hidden lg:flex absolute inset-0 z-20 flex-col justify-end p-16 xl:p-24 bg-linear-to-t from-black/80 via-black/40 to-transparent">
            <div className="max-w-xl">
              <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
                Gestão inteligente para os negócios do futuro.
              </h2>
              <p className="text-indigo-200 text-lg leading-relaxed mb-8">
                Toda a sua operação centralizada em um ambiente de alta
                performance. Tenha controle absoluto sobre o seu inventário,
                vendas e financeiro.
              </p>
            </div>
          </div>
        </div>

        {/* Lado Direito - Formulário */}
        <div className="flex-1 lg:flex-none lg:w-120 xl:w-135 flex flex-col justify-center items-center px-8 sm:px-12 relative z-10 bg-background/50 lg:bg-background backdrop-blur-md lg:backdrop-blur-none border-l border-border/50 shadow-2xl">
          <div className="w-full max-w-85 flex flex-col">
            {/* Logo / Título */}
            <div className="mb-10 mt-12 lg:mt-0 text-center lg:text-left">
              <div className="w-12 h-12 bg-white rounded-xl mb-6 mx-auto lg:mx-0 flex items-center justify-center shadow-lg shadow-violet-600/20">
                {/* <span className="text-white font-black text-xl tracking-tighter">
                  TR
                </span> */}

                <TraceLogo />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground mb-2">
                Bem-vindo de volta
              </h1>
              <p className="text-sm text-muted-foreground">
                Insira suas credenciais para acessar o Trace.
              </p>
            </div>

            {/* Formulário */}
            <div className="space-y-5 w-full">
              <div className="space-y-2.5">
                <Label
                  htmlFor="username"
                  className="text-sm font-semibold text-foreground"
                >
                  Usuário de acesso
                </Label>
                <div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 w-10 flex items-center justify-center pointer-events-none">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <Input
                      id="username"
                      type="text"
                      placeholder="Usuário"
                      className={`h-10 pl-10 pr-4 bg-background lg:bg-card/50 text-sm ${formErrors.username ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                      onChange={updateUserData}
                      value={userLoginData.username}
                      name="username"
                    />
                  </div>
                  {formErrors.username && (
                    <span className="text-xs font-medium text-red-500 mt-1.5 block">
                      {formErrors.username[0]}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="password"
                    className="text-sm font-semibold text-foreground"
                  >
                    Senha
                  </Label>
                  <a
                    href="#"
                    className="text-[13px] font-medium text-violet-600 hover:text-violet-500 transition-colors"
                  >
                    Esqueceu a senha?
                  </a>
                </div>
                <div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 w-10 flex items-center justify-center pointer-events-none">
                      <Lock className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className={`h-10 pl-10 pr-10 bg-background lg:bg-card/50 text-sm ${formErrors.password ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                      onChange={updateUserData}
                      value={userLoginData.password}
                      name="password"
                    />
                    <div className="absolute inset-y-0 right-0 w-10 flex items-center justify-center cursor-pointer hover:text-foreground text-muted-foreground transition-colors">
                      <EyeOff className="h-4 w-4" />
                    </div>
                  </div>
                  {formErrors.password && (
                    <span className="text-xs font-medium text-red-500 mt-1.5 block">
                      {formErrors.password[0]}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2.5 py-1">
                <Checkbox
                  id="remember"
                  className="h-4 w-4 rounded-md border-2"
                />
                <Label
                  htmlFor="remember"
                  className="text-[13px] font-medium cursor-pointer text-foreground lg:text-muted-foreground"
                >
                  Lembrar de mim por 30 dias
                </Label>
              </div>

              <Button
                disabled={mutation.isPending}
                onClick={() => {
                  mutation.mutate(userLoginData);
                }}
                className="w-full h-11 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-lg shadow-md shadow-violet-600/20 flex items-center justify-between px-5 mt-2 transition-all hover:translate-x-1 disabled:opacity-70 disabled:hover:translate-x-0"
              >
                {mutation.isPending ? (
                  <span>Entrando...</span>
                ) : (
                  <span>Entrar na Plataforma</span>
                )}

                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Erro Geral (Status Error) */}
            {statusError && (
              <div className="mt-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center justify-center animate-in fade-in zoom-in-95 duration-200">
                <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                  {statusError}
                </span>
              </div>
            )}

            {/* Footer do formulário */}
            <div className="mt-12 lg:mt-16 pt-6 pb-8 lg:pb-0 text-[13px] text-center lg:text-left text-foreground/70 lg:text-muted-foreground">
              <p>
                © {new Date().getFullYear()} Trace ERP. Todos os direitos
                reservados.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
