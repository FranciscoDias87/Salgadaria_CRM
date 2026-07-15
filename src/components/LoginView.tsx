/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Key, Mail, User, ChefHat, LogIn, UserPlus } from 'lucide-react';
import { auth } from '../firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';

interface LoginViewProps {
  onLogin: (username: string) => void;
  onBypassOffline: () => void;
}

export default function LoginView({ onLogin, onBypassOffline }: LoginViewProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('admin@salgadaria.com');
  const [password, setPassword] = useState('123456');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (isRegister && !name.trim()) {
      setError('Por favor, informe seu nome para o cadastro.');
      return;
    }

    setLoading(true);

    try {
      if (isRegister) {
        // Sign Up Flow
        const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
        
        // Update display name
        if (auth.currentUser) {
          await updateProfile(auth.currentUser, {
            displayName: name.trim()
          });
        }
        
        const userName = name.trim() || userCredential.user.email || 'Usuário';
        onLogin(userName);
      } else {
        // Sign In Flow
        const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
        const userName = userCredential.user.displayName || userCredential.user.email || 'Usuário';
        onLogin(userName);
      }
    } catch (err: any) {
      console.error('Erro de autenticação:', err);
      // Translate common Firebase Auth errors
      switch (err.code) {
        case 'auth/invalid-credential':
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          setError('E-mail ou senha incorretos.');
          break;
        case 'auth/email-already-in-use':
          setError('Este e-mail já está sendo utilizado.');
          break;
        case 'auth/weak-password':
          setError('A senha deve conter pelo menos 6 caracteres.');
          break;
        case 'auth/invalid-email':
          setError('Por favor, insira um e-mail válido.');
          break;
        case 'auth/operation-not-allowed':
          setError('O login por E-mail/Senha está desativado no console do Firebase. Ative-o em "Authentication > Sign-in method" ou use o Modo de Demonstração Offline abaixo.');
          break;
        default:
          setError('Ocorreu um erro ao conectar. Verifique sua conexão e tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const userName = userCredential.user.displayName || userCredential.user.email || 'Usuário';
      onLogin(userName);
    } catch (err: any) {
      console.error('Erro de autenticação com o Google:', err);
      if (err.code === 'auth/popup-blocked') {
        setError('O pop-up de login foi bloqueado pelo seu navegador. Por favor, permita pop-ups ou abra o app em uma nova aba (clique no ícone de seta no canto superior direito do preview).');
      } else if (err.code === 'auth/operation-not-allowed') {
        setError('O login por Google está desativado no console do Firebase. Ative-o em "Authentication > Sign-in method" no console do Firebase.');
      } else {
        setError('Erro ao fazer login com o Google. Se estiver no visualizador do AI Studio, abra o app em uma nova aba para permitir a janela de login do Google.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12 select-none relative overflow-hidden">
      {/* Decorative Background Blobs */}
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-orange-100 rounded-full blur-3xl opacity-60"></div>
      <div className="absolute bottom-10 right-10 w-60 h-60 bg-amber-100 rounded-full blur-3xl opacity-60"></div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md bg-white rounded-3xl p-8 md:p-10 shadow-xl border border-slate-100"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="w-20 h-20 mx-auto bg-orange-500 rounded-2xl flex items-center justify-center text-4xl shadow-md text-white mb-4"
          >
            🥟
          </motion.div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Salgadaria CRM</h1>
          <p className="text-slate-500 mt-2 text-sm">
            {isRegister ? 'Crie sua conta administrativa segura.' : 'Controle sua empresa de forma simples e moderna.'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {isRegister && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                Nome Completo
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                  <User size={18} />
                </span>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome"
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              E-mail Seguro
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                <Mail size={18} />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemplo@salgadaria.com"
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Senha
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                <Key size={18} />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Sua senha secreta"
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 mt-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 active:scale-[0.98] transition-all duration-200 text-base flex items-center justify-center gap-2 cursor-pointer ${
              loading ? 'opacity-70 pointer-events-none' : ''
            }`}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                PROCESSANDO...
              </span>
            ) : isRegister ? (
              <>
                <UserPlus size={20} />
                CRIAR MINHA CONTA
              </>
            ) : (
              <>
                <ChefHat size={20} />
                ENTRAR NO SISTEMA
              </>
            )}
          </button>
        </form>

        <div className="my-5 flex items-center justify-between text-xs text-slate-400">
          <span className="w-full h-px bg-slate-100"></span>
          <span className="px-3 text-[10px] font-bold tracking-wider uppercase">OU</span>
          <span className="w-full h-px bg-slate-100"></span>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full py-3.5 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-2xl border border-slate-200 shadow-sm active:scale-[0.98] transition-all duration-200 text-sm flex items-center justify-center gap-2.5 cursor-pointer"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
          </svg>
          ENTRAR COM O GOOGLE
        </button>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
            }}
            className="text-xs font-bold text-orange-500 hover:text-orange-600 hover:underline cursor-pointer transition"
          >
            {isRegister ? 'Já possui uma conta? Faça Login' : 'Não tem uma conta? Cadastre-se aqui'}
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-400 mb-2">Instabilidade na rede ou Firebase desconfigurado?</p>
          <button
            type="button"
            onClick={onBypassOffline}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-700 font-semibold rounded-xl text-xs transition duration-200 flex items-center justify-center gap-2 cursor-pointer"
          >
            ⚡ Acessar no Modo de Demonstração Offline
          </button>
        </div>

        <div className="mt-8 text-center text-slate-400 text-xs">
          <p className="font-medium">Sistema de Gestão para Salgadarias</p>
          <div className="mt-1.5 inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 rounded-full text-[10px] font-mono text-slate-400 border border-slate-100">
            <Shield size={10} />
            Nuvem & Login Seguro Ativos
          </div>
        </div>
      </motion.div>
    </div>
  );
}
