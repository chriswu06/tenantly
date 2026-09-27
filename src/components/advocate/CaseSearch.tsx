"use client";

import { useId, useRef } from "react";
import { Funnel, Search } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { useCaseSearch } from "./useCaseSearch";

/** Mobile search field with a filter button. Hidden from `lg` up, where the top bar has search. */
export function CaseSearch() {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const search = useCaseSearch(inputRef);
  return (
    <form
      role="search"
      onSubmit={search.onSubmit}
      className="flex h-10.5 items-center gap-2 rounded-lg border border-border-strong bg-bg-surface pr-1.5 pl-3 focus-within:border-accent lg:hidden"
    >
      <Icon icon={Search} size={16} className="text-text-tertiary" />
      <label htmlFor={inputId} className="sr-only">
        Search cases
      </label>
      <input
        id={inputId}
        ref={inputRef}
        type="search"
        name="q"
        defaultValue={search.defaultValue}
        onChange={search.onChange}
        placeholder="Search address, case #, landlord"
        className="min-w-0 flex-1 bg-transparent text-14 leading-none text-text-primary outline-none placeholder:text-text-tertiary"
      />
      <button
        type="button"
        aria-label="Filter cases"
        className="flex size-8 items-center justify-center rounded-md text-text-secondary hover:bg-bg-subtle"
      >
        <Icon icon={Funnel} size={16} />
      </button>
    </form>
  );
}
