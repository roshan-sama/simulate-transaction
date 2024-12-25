import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const EconomyHistory = () => {
  const [timeStep, setTimeStep] = useState([0]);

  // Define all transactions that will occur
  const transactions = [
    {
      time: 2,
      from: "Person 1",
      to: "Person 2",
      commodity: "Watch",
      units: -2,
    },
    {
      time: 2,
      from: "Person 2",
      to: "Person 1",
      commodity: "Apple",
      units: 2,
    },
  ];

  // Initial state
  const initialState = {
    "Person 1": {
      currency: 5,
      commodities: ["Watch"],
    },
    "Person 2": {
      currency: 3,
      commodities: ["Apple"],
    },
  } as const;

  // Calculate current state based on time step
  const getCurrentState = (entityName: string) => {
    const state = {
      //@ts-ignore
      currency: initialState[entityName].currency,
      //@ts-ignore
      commodities: [...initialState[entityName].commodities],
    };

    transactions.forEach((tx) => {
      if (tx.time <= timeStep[0]) {
        if (tx.from === entityName) {
          state.currency += tx.units;
          state.commodities = state.commodities.filter(
            (c) => c !== tx.commodity
          );
        }
        if (tx.to === entityName) {
          state.currency -= tx.units;
          state.commodities.push(tx.commodity);
        }
      }
    });

    return state;
  };

  // Get transactions for a specific entity
  const getEntityTransactions = (entityName: any) => {
    return transactions
      .filter((tx) => tx.from === entityName || tx.to === entityName)
      .map((tx) => ({
        ...tx,
        units: tx.from === entityName ? tx.units : -tx.units,
        commodity:
          tx.from === entityName ? `-${tx.commodity}` : `+${tx.commodity}`,
        otherParty: tx.from === entityName ? tx.to : tx.from,
      }))
      .filter((tx) => tx.time <= timeStep[0]);
  };

  const EntitySection = ({ name }: any) => {
    const currentState = getCurrentState(name);
    const entityTransactions = getEntityTransactions(name);

    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>
              {name} Current State (Time Step {timeStep[0]})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Currency: {currentState.currency} units</p>
            <p>Commodities: {currentState.commodities.join(", ") || "None"}</p>
          </CardContent>
        </Card>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Time</TableHead>
              <TableHead>Transacted With</TableHead>
              <TableHead>Currency Exchange</TableHead>
              <TableHead>Commodity Exchange</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entityTransactions.map((tx, idx) => (
              <TableRow key={idx}>
                <TableCell>{tx.time}</TableCell>
                <TableCell>{tx.otherParty}</TableCell>
                <TableCell
                  className={tx.units > 0 ? "text-green-600" : "text-red-600"}
                >
                  {tx.units > 0 ? `+${tx.units}` : tx.units} units
                </TableCell>
                <TableCell>{tx.commodity}</TableCell>
              </TableRow>
            ))}
            {entityTransactions.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  No transactions yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-8">
      <div className="space-y-2">
        <h3 className="font-medium text-sm">Time Step: {timeStep[0]} units</h3>
        <Slider
          value={timeStep}
          onValueChange={setTimeStep}
          max={5}
          step={1}
          className="w-full"
        />
      </div>

      <EntitySection name="Person 1" />
      <div className="my-8 border-t" />
      <EntitySection name="Person 2" />
    </div>
  );
};

export default EconomyHistory;
