import jwt from 'jsonwebtoken';
import { Usuario } from '../models/index.js';

/**
 * O que faz: Extrai o token Bearer do header Authorization.
 * Como faz: Lê o header, separa por espaço e valida o esquema `Bearer`.
 * Para que serve: Padronizar leitura de token antes de autenticar requests.
 */
function extractBearerToken(req) {
  const header = req.headers.authorization || req.headers.Authorization;
  if (!header || typeof header !== 'string') return null;

  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) return null;
  return token;
}

/**
 * O que faz: Resolve o usuário autenticado a partir do token JWT.
 * Como faz: Valida `JWT_SECRET`, verifica token, busca usuário no banco e checa se está ativo.
 * Para que serve: Centralizar a lógica de autenticação para reutilização nos middlewares.
 */
async function resolveAuthenticatedUser(req) {
  if (!process.env.JWT_SECRET) {
    return { ok: false, status: 500, error: 'JWT_SECRET não configurado' };
  }

  const token = extractBearerToken(req);
  if (!token) {
    return { ok: false, status: 401, error: 'Token de autenticação ausente' };
  }

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return { ok: false, status: 401, error: 'Token inválido ou expirado' };
  }

  const user = await Usuario.findByPk(payload.id, {
    attributes: ['id', 'name', 'email', 'is_active'],
  });

  if (!user) {
    return { ok: false, status: 401, error: 'Usuário não encontrado' };
  }

  if (!user.is_active) {
    return { ok: false, status: 401, error: 'Usuário inativo' };
  }

  return { ok: true, user };
}

/**
 * O que faz: Exige autenticação para acessar a rota.
 * Como faz: Usa `resolveAuthenticatedUser`; em sucesso injeta `req.user` e `req.usuario`.
 * Para que serve: Proteger endpoints que só podem ser usados por usuário logado.
 */
export async function requireAuth(req, res, next) {
  try {
    const authResult = await resolveAuthenticatedUser(req);
    if (!authResult.ok) {
      return res.status(authResult.status).json({
        success: false,
        error: authResult.error,
      });
    }

    req.user = authResult.user;
    req.usuario = authResult.user;
    return next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Erro ao autenticar usuário',
      message: error.message,
    });
  }
}

/**
 * O que faz: Mantém compatibilidade com rotas legadas que exigiam admin.
 * Como faz: Apenas garante que existe usuário autenticado (equivalente a requireAuth).
 * Para que serve: Evitar quebrar imports antigos após remoção de `is_admin`.
 */
export function requireAdmin(req, res, next) {
  if (!req.user) {
    return res.status(403).json({
      success: false,
      error: 'Usuário não autenticado',
    });
  }

  return next();
}

/**
 * O que faz: Permite criação apenas do admin inicial (bootstrap).
 * Como faz: Conta usuários; se já existir algum, bloqueia a operação.
 * Para que serve: Garantir que só exista um fluxo controlado de criação de conta admin.
 */
export async function requireBootstrapAdmin(req, res, next) {
  try {
    const usersCount = await Usuario.count();

    if (usersCount > 0) {
      return res.status(403).json({
        success: false,
        error: 'Cadastro de usuário desabilitado após bootstrap inicial',
      });
    }
    return next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Erro ao validar acesso administrativo',
      message: error.message,
    });
  }
}
