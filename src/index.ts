type OnceState<TResult> =
  | { readonly status: "ready" }
  | { readonly status: "running" }
  | { readonly status: "value"; readonly value: TResult }
  | { readonly status: "error"; readonly error: unknown };

/**
 * Wraps `function_` so it runs at most once.
 *
 * Its returned value or thrown error is replayed for later calls.
 */
export function once<TArguments extends unknown[], TResult>(
  function_: (...arguments_: TArguments) => TResult,
): (...arguments_: TArguments) => TResult {
  let state: OnceState<TResult> = { status: "ready" };

  return (...arguments_: TArguments): TResult => {
    if (state.status === "value") {
      return state.value;
    }
    if (state.status === "error") {
      throw state.error;
    }
    if (state.status === "running") {
      throw new TypeError("A once-wrapped function cannot call itself");
    }

    state = { status: "running" };
    try {
      const value = function_(...arguments_);
      state = { status: "value", value };
      return value;
    } catch (error) {
      state = { status: "error", error };
      throw error;
    }
  };
}
