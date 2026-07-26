import { describe, expect, expectTypeOf, it, vi } from "vitest";

import { once } from "../src/index.js";

describe("once", () => {
  it("runs a function only for the first call", () => {
    const add = vi.fn<(left: number, right: number) => number>(
      (left, right) => left + right,
    );
    const addOnce = once(add);

    expect(addOnce(2, 3)).toBe(5);
    expect(addOnce(20, 30)).toBe(5);
    expect(add).toHaveBeenCalledOnce();
    expect(add).toHaveBeenCalledWith(2, 3);
    expectTypeOf(addOnce).toEqualTypeOf<
      (left: number, right: number) => number
    >();
  });

  it("replays the exact thrown value", () => {
    const failure = new Error("nope");
    const fail = vi.fn<() => never>(() => {
      throw failure;
    });
    const failOnce = once(fail);

    expect(failOnce).toThrow(failure);
    expect(failOnce).toThrow(failure);
    expect(fail).toHaveBeenCalledOnce();
  });

  it("rejects re-entrant calls and replays that error", () => {
    let recursive!: () => unknown;
    recursive = once(() => recursive());

    let firstError: unknown;
    try {
      recursive();
    } catch (error) {
      firstError = error;
    }

    expect(firstError).toEqual(
      new TypeError("A once-wrapped function cannot call itself"),
    );
    expect(() => recursive()).toThrow(firstError);
  });
});
