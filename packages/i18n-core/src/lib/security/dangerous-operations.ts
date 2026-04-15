export const DANGEROUS_OPERATION_NAMES = [
  "exec",
  "spawn",
  "shell",
  "fs_write",
  "fs_delete",
  "fs_move",
  "apply_patch",
  "eval",
  "function_constructor",
] as const;

export type DangerousOperation = (typeof DANGEROUS_OPERATION_NAMES)[number];

export const DANGEROUS_OPERATIONS_SET = new Set<string>(DANGEROUS_OPERATION_NAMES);

export function isDangerousOperation(operationName: string): boolean {
  return DANGEROUS_OPERATIONS_SET.has(operationName.toLowerCase());
}

export function getDangerousOperations(): readonly string[] {
  return DANGEROUS_OPERATION_NAMES;
}
