"use client";

import { useEffect, useRef, type ChangeEvent, type FormEvent, type RefObject } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const CASES_PATH = "/advocate/cases";
const DEBOUNCE_MS = 300;

/**
 * Search box behavior shared by the desktop top bar and the mobile cases search.
 * On the cases list, typing updates `?q=` after a 300 ms pause (and resets `?page=`).
 * Anywhere else, pressing Enter opens the cases list with the search applied.
 * Pass the ref of the (uncontrolled) search input.
 */
export function useCaseSearch(inputRef: RefObject<HTMLInputElement | null>) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const onCases = pathname === CASES_PATH;
  const q = onCases ? (searchParams.get("q") ?? "") : "";
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Follow the URL (e.g. "Clear search") unless the person is typing in this box.
  useEffect(() => {
    const input = inputRef.current;
    if (input && document.activeElement !== input && input.value !== q) input.value = q;
  }, [q, inputRef]);

  useEffect(() => () => clearTimeout(timer.current), []);

  function apply(term: string) {
    const params = new URLSearchParams(onCases ? searchParams : undefined);
    const value = term.trim();
    if (value) params.set("q", value);
    else params.delete("q");
    params.delete("page");
    const qs = params.toString();
    const href = qs ? `${CASES_PATH}?${qs}` : CASES_PATH;
    if (onCases) router.replace(href, { scroll: false });
    else router.push(href);
  }

  return {
    defaultValue: q,
    onChange(event: ChangeEvent<HTMLInputElement>) {
      if (!onCases) return;
      const value = event.target.value;
      clearTimeout(timer.current);
      timer.current = setTimeout(() => apply(value), DEBOUNCE_MS);
    },
    onSubmit(event: FormEvent<HTMLFormElement>) {
      event.preventDefault();
      clearTimeout(timer.current);
      apply(inputRef.current?.value ?? "");
    },
  };
}
