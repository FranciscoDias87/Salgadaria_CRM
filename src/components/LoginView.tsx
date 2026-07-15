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
  updateProfile
} from 'firebase/auth';

interface LoginViewProps {
  onLogin: (username: string) => void;
}

export default function LoginView({ onLogin }: LoginViewProps) {
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
        default:
          setError('Ocorreu um erro ao conectar. Verifique sua conexão e tente novamente.');
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
