import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

import { buildDefaultCategories, ChecklistCategory, newId } from "@/constants/checklist";

export type Trip = {
  id: string;
  destination: string;
  country?: string;
  emoji?: string;
  startDate?: string;
  categories: ChecklistCategory[];
  tasks: { id: string; label: string; done: boolean }[];
};

type Ctx = {
  trips: Trip[];
  currentTripId: string | null;
  currentTrip: Trip | null;
  createTrip: (input: { destination: string; country?: string; emoji?: string; smart?: boolean }) => string;
  setCurrentTrip: (id: string | null) => void;
  toggleItem: (tripId: string, categoryId: string, itemId: string) => void;
  addItem: (tripId: string, categoryId: string, label: string) => void;
  addCategory: (tripId: string, name: string) => void;
  addTask: (tripId: string, label: string) => void;
  toggleTask: (tripId: string, taskId: string) => void;
};

const TripContext = createContext<Ctx | null>(null);

export function TripProvider({ children }: { children: React.ReactNode }) {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [currentTripId, setCurrentTripId] = useState<string | null>(null);

  const createTrip = useCallback<Ctx["createTrip"]>((input) => {
    const id = newId("trip");
    const trip: Trip = {
      id,
      destination: input.destination,
      country: input.country,
      emoji: input.emoji,
      categories: input.smart ? buildDefaultCategories() : [],
      tasks: [],
    };
    setTrips((t) => [...t, trip]);
    setCurrentTripId(id);
    return id;
  }, []);

  const toggleItem = useCallback<Ctx["toggleItem"]>((tripId, categoryId, itemId) => {
    setTrips((all) =>
      all.map((t) =>
        t.id !== tripId
          ? t
          : {
              ...t,
              categories: t.categories.map((c) =>
                c.id !== categoryId
                  ? c
                  : {
                      ...c,
                      items: c.items.map((i) =>
                        i.id !== itemId ? i : { ...i, done: !i.done },
                      ),
                    },
              ),
            },
      ),
    );
  }, []);

  const addItem = useCallback<Ctx["addItem"]>((tripId, categoryId, label) => {
    if (!label.trim()) return;
    setTrips((all) =>
      all.map((t) =>
        t.id !== tripId
          ? t
          : {
              ...t,
              categories: t.categories.map((c) =>
                c.id !== categoryId
                  ? c
                  : { ...c, items: [...c.items, { id: newId("it"), label: label.trim(), done: false }] },
              ),
            },
      ),
    );
  }, []);

  const addCategory = useCallback<Ctx["addCategory"]>((tripId, name) => {
    if (!name.trim()) return;
    setTrips((all) =>
      all.map((t) =>
        t.id !== tripId
          ? t
          : {
              ...t,
              categories: [
                ...t.categories,
                { id: newId("cat"), name: name.trim(), icon: "folder", items: [] },
              ],
            },
      ),
    );
  }, []);

  const addTask = useCallback<Ctx["addTask"]>((tripId, label) => {
    if (!label.trim()) return;
    setTrips((all) =>
      all.map((t) =>
        t.id !== tripId
          ? t
          : { ...t, tasks: [...t.tasks, { id: newId("tk"), label: label.trim(), done: false }] },
      ),
    );
  }, []);

  const toggleTask = useCallback<Ctx["toggleTask"]>((tripId, taskId) => {
    setTrips((all) =>
      all.map((t) =>
        t.id !== tripId
          ? t
          : { ...t, tasks: t.tasks.map((k) => (k.id !== taskId ? k : { ...k, done: !k.done })) },
      ),
    );
  }, []);

  const currentTrip = useMemo(
    () => trips.find((t) => t.id === currentTripId) ?? null,
    [trips, currentTripId],
  );

  const value = useMemo<Ctx>(
    () => ({
      trips,
      currentTripId,
      currentTrip,
      createTrip,
      setCurrentTrip: setCurrentTripId,
      toggleItem,
      addItem,
      addCategory,
      addTask,
      toggleTask,
    }),
    [trips, currentTripId, currentTrip, createTrip, toggleItem, addItem, addCategory, addTask, toggleTask],
  );

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
}

export function useTrips() {
  const ctx = useContext(TripContext);
  if (!ctx) throw new Error("useTrips must be used inside TripProvider");
  return ctx;
}
