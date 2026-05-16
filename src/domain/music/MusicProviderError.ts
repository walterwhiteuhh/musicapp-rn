export type MusicProviderErrorKind =
  | 'invalid-response'
  | 'network'
  | 'rate-limited'
  | 'unauthorized'
  | 'unknown';

export class MusicProviderError extends Error {
  readonly kind: MusicProviderErrorKind;
  readonly status?: number;

  constructor(kind: MusicProviderErrorKind, message: string, status?: number) {
    super(message);
    this.name = 'MusicProviderError';
    this.kind = kind;
    this.status = status;
  }
}
