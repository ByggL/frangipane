"use client";

import { Card } from "@/lib/types";
import { useEffect, useState } from "react";

export default function Page() {
  const [cards, setCards] = useState<Card[]>([]);

  // fetch data on mount
  useEffect(() => {
    fetch("/api/cards")
      .then((res) => res.json())
      .then((data) => setCards(data))
      .catch(console.error);
  }, []);

  return (
    <main className="p-8">
      <h1 className="text-4xl font-bold mb-8">Wrestler TCG Roster</h1>

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b-2 border-gray-300">
            <th className="p-2">Name</th>
            <th className="p-2">Rarity</th>
            <th className="p-2">Alignment</th>
            <th className="p-2">Height</th>
            <th className="p-2">Weight</th>
            <th className="p-2">Birthdate</th>
            <th className="p-2">Birthplace</th>
            <th className="p-2">Promotion</th>
          </tr>
        </thead>
        <tbody>
          {cards.map((card) => (
            <tr key={card.id} className="border-b border-gray-200">
              <td className="p-2 font-semibold">{card.name}</td>
              <td className="p-2">{card.rarity}</td>
              <td className="p-2">{card.alignment}</td>
              <td className="p-2">{card.height}</td>
              <td className="p-2">{card.weight}</td>
              <td className="p-2">{card.birthdate}</td>
              <td className="p-2">{card.birthplace}</td>
              <td className="p-2">{card.promotion || "Independent"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
