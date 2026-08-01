import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';

/**
 * Hash de senhas com Argon2id.
 *
 * Parâmetros seguem a recomendação da OWASP (19 MiB, 2 iterações, 1 thread).
 * A senha em texto puro nunca é logada nem persistida.
 */
@Injectable()
export class PasswordService {
  private readonly options: argon2.Options = {
    type: argon2.argon2id,
    memoryCost: 19456,
    timeCost: 2,
    parallelism: 1,
  };

  hash(plain: string): Promise<string> {
    return argon2.hash(plain, this.options);
  }

  async verify(hash: string, plain: string): Promise<boolean> {
    try {
      return await argon2.verify(hash, plain);
    } catch {
      // Hash malformado ou algoritmo desconhecido: trata como senha incorreta.
      return false;
    }
  }
}
